/**
 * Pure detection primitives used by `classifySite` (spec §3, steps 3–7).
 *
 * Every function here is a pure function of its inputs so they can be unit
 * tested against fixtures with no network or browser. Each returns not just a
 * boolean but the evidence notes that get written to
 * `site_audits.detected_structure`, keeping the "why" inspectable (spec §2.2).
 */

import type { NetworkEntry } from '../types.js';

export interface Detection {
  found: boolean;
  /** Human-readable evidence, e.g. "found `window.properties`". */
  notes: string;
}

/** Strip tags/whitespace so we compare content, not markup noise. */
function textContent(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Spec §3 step 3 — ratio of visible text that appears only after rendering.
 * 0 = rendered DOM adds nothing over raw HTML (static); approaching 1 = almost
 * all content is injected by JS (js_rendered).
 */
export function domDiffRatio(rawHtml: string, renderedDom: string): number {
  const rawText = textContent(rawHtml);
  const renderedText = textContent(renderedDom);
  const renderedLen = renderedText.length;
  if (renderedLen === 0) return 0;
  const added = Math.max(0, renderedLen - rawText.length);
  // Clamp — rendered can occasionally be shorter (e.g. cookie banners removed).
  return Math.min(1, added / renderedLen);
}

const MIN_JSON_BLOB = 500; // spec §3 step 4: "large inline JSON blobs (>500 chars)"

/**
 * Spec §3 step 4 — scan raw HTML for embedded data:
 *  - `window.<name> = {...}` / `= [...]` assignments near <script> tags
 *  - <script type="application/ld+json"> blocks
 *  - large valid inline JSON blobs
 */
export function findEmbeddedJson(rawHtml: string): Detection {
  const notes: string[] = [];

  // application/ld+json blocks
  const ldMatches = [
    ...rawHtml.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  for (const m of ldMatches) {
    if (isProbablyJson(m[1])) {
      notes.push('found <script type="application/ld+json"> block');
      break;
    }
  }

  // window.<name> = {...} / [...] — use balanced-brace extraction (not a lazy
  // regex, which breaks on nested objects) to validate the payload as JSON.
  const windowAssign = /window\.([a-zA-Z_$][\w$]*)\s*=\s*(?=[[{])/.exec(rawHtml);
  if (windowAssign) {
    const from = windowAssign.index + windowAssign[0].length;
    const blob = extractJsonBlob(rawHtml.slice(from));
    if (blob) {
      notes.push('found `window.' + windowAssign[1] + '` assignment with JSON payload');
    }
  }

  // Common SSR hydration hooks (__NEXT_DATA__, __NUXT__, etc.)
  const hydration = rawHtml.match(
    /(__NEXT_DATA__|__NUXT__|__APOLLO_STATE__|__INITIAL_STATE__)/,
  );
  if (hydration) {
    notes.push('found SSR hydration blob `' + hydration[1] + '`');
  }

  // Large inline JSON blob inside any <script>
  if (notes.length === 0) {
    const scripts = [...rawHtml.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
    for (const s of scripts) {
      const body = (s[1] ?? '').trim();
      if (body.length >= MIN_JSON_BLOB) {
        const blob = extractJsonBlob(body);
        if (blob && blob.length >= MIN_JSON_BLOB) {
          notes.push(`found large inline JSON blob (${blob.length} chars)`);
          break;
        }
      }
    }
  }

  return { found: notes.length > 0, notes: notes.join('; ') };
}

/** Field names that make a JSON object look like a property listing (spec §3 step 5). */
const LISTING_FIELDS = [
  'price',
  'address',
  'sqft',
  'sq_ft',
  'size',
  'tenure',
  'postcode',
  'bedrooms',
  'propertyType',
  'property_type',
];

/**
 * Spec §3 step 5 — inspect the network log for XHR/fetch calls returning JSON
 * that looks like a listings payload (an array of property-like objects).
 */
export function findListingApi(networkLog: NetworkEntry[]): Detection & {
  endpoint?: string;
} {
  for (const entry of networkLog) {
    if (entry.status < 200 || entry.status >= 300) continue;
    if (!/json/i.test(entry.contentType)) continue;
    const arr = firstArrayOfObjects(entry.responseBody);
    if (!arr) continue;
    const sample = arr.slice(0, 5);
    const looksLikeListing = sample.some((obj) => propertyFieldHits(obj) >= 2);
    if (looksLikeListing) {
      return {
        found: true,
        endpoint: entry.url,
        notes: `XHR ${entry.method} ${entry.url} returned JSON array of ${arr.length} property-like objects`,
      };
    }
  }
  return { found: false, notes: '' };
}

/**
 * Spec §3 step 6 — no addressable listing URLs and search is POST-only.
 * Heuristic: no anchors that look like individual listing detail pages, and a
 * search <form> using method="post".
 */
export function detectManualOnly(rawHtml: string, renderedDom: string): Detection {
  const dom = renderedDom || rawHtml;
  const hasListingLinks =
    /<a[^>]+href=["'][^"']*\/(propert|listing|detail|for-sale|to-let|commercial)[^"']*["']/i.test(
      dom,
    );
  const postForm = /<form[^>]+method=["']post["']/i.test(dom);
  const hasSearchForm = /<form[\s\S]{0,400}(search|find|keyword|location)/i.test(dom);

  if (!hasListingLinks && postForm && hasSearchForm) {
    return {
      found: true,
      notes: 'no addressable listing URLs; search is a POST-only form',
    };
  }
  return { found: false, notes: '' };
}

/**
 * Spec §3 step 7 — robots.txt broad Disallow over listing paths, or ToS text
 * with scraping-restriction language. Either sets tos_flag and forces review.
 */
export function checkRobotsAndTos(
  robotsTxt: string | undefined,
  tosText: string | undefined,
): Detection {
  const notes: string[] = [];

  if (robotsTxt) {
    const disallows = [...robotsTxt.matchAll(/^\s*Disallow:\s*(\S*)/gim)].map(
      (m) => (m[1] ?? '').trim(),
    );
    const broad = disallows.some(
      (path) =>
        path === '/' ||
        /^\/(search|propert|listing|commercial|for-sale|to-let)/i.test(path),
    );
    if (broad) notes.push('robots.txt Disallow covers listing paths');
  }

  if (tosText) {
    const restriction =
      /(no\s+(automated|robot|scrap)|scraping|crawl(er|ing)?\s+(is\s+)?(prohibit|not\s+permit|forbidden)|data\s+mining|without\s+(our\s+)?(prior\s+)?written\s+(consent|permission))/i;
    if (restriction.test(tosText)) {
      notes.push('terms-of-use contains scraping-restriction language');
    }
  }

  return { found: notes.length > 0, notes: notes.join('; ') };
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function isProbablyJson(s: string | undefined): boolean {
  if (!s) return false;
  const t = s.trim();
  if (!(t.startsWith('{') || t.startsWith('['))) return false;
  try {
    JSON.parse(t);
    return true;
  } catch {
    return false;
  }
}

/** Extract the first balanced {...} or [...] region and validate it as JSON. */
function extractJsonBlob(body: string): string | null {
  const start = body.search(/[[{]/);
  if (start === -1) return null;
  const open = body[start];
  const close = open === '{' ? '}' : ']';
  let depth = 0;
  for (let i = start; i < body.length; i++) {
    const c = body[i];
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) {
        const candidate = body.slice(start, i + 1);
        return isProbablyJson(candidate) ? candidate : null;
      }
    }
  }
  return null;
}

function firstArrayOfObjects(body: unknown): Record<string, unknown>[] | null {
  if (Array.isArray(body)) {
    return body.every((x) => x && typeof x === 'object') ? (body as Record<string, unknown>[]) : null;
  }
  if (body && typeof body === 'object') {
    for (const value of Object.values(body as Record<string, unknown>)) {
      const nested = firstArrayOfObjects(value);
      if (nested && nested.length > 0) return nested;
    }
  }
  return null;
}

function propertyFieldHits(obj: Record<string, unknown>): number {
  const keys = new Set(Object.keys(obj).map((k) => k.toLowerCase()));
  return LISTING_FIELDS.filter((f) => keys.has(f.toLowerCase())).length;
}
