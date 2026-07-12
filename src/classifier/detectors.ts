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

export interface EmbeddedJsonDetection extends Detection {
  /**
   * True only when a parsed JSON payload actually contains a listing-shaped
   * array (objects carrying property fields). `found && !listingShaped` means
   * JSON is present but generic (SEO schema, config, analytics) — not proof of
   * extractable listings.
   */
  listingShaped: boolean;
}

/**
 * schema.org @types that are SEO/site-structure markup, present on nearly every
 * modern site and never a signal of embedded listings (trial report finding).
 * The real gate is the listing-shape check below; this list makes the audit
 * note explicit about *why* an ld+json block was not trusted.
 */
const SEO_SCHEMA_TYPES = new Set([
  'organization',
  'website',
  'breadcrumblist',
  'localbusiness',
  'realestateagent',
  'webpage',
  'sitenavigationelement',
  'postaladdress',
  'imageobject',
  'place',
  'searchaction',
  'collectionpage',
  'person',
  'logo',
]);

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
 *  - <script type="application/ld+json"> and __NEXT_DATA__ blocks
 *  - large valid inline JSON blobs
 *
 * Every candidate is parsed and tested for listing shape. Only a listing-shaped
 * payload counts as extractable-listings embedded JSON; generic JSON (SEO
 * schema, config, analytics) is reported as present-but-generic so the caller
 * can decline to auto-approve it (trial report: SEO ld+json was producing
 * confident false positives).
 */
export function findEmbeddedJson(rawHtml: string): EmbeddedJsonDetection {
  const parsed: { source: string; value: unknown }[] = [];
  const ldTypes: string[] = [];

  // application/ld+json blocks
  for (const m of rawHtml.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    const v = tryParse(m[1]);
    if (v !== undefined) {
      parsed.push({ source: 'ld+json', value: v });
      ldTypes.push(...collectLdTypes(v));
    }
  }

  // __NEXT_DATA__ (Next.js SSR payload lives in a type="application/json" script)
  const nextData = rawHtml.match(
    /<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i,
  );
  if (nextData) {
    const v = tryParse(nextData[1]);
    if (v !== undefined) parsed.push({ source: '__NEXT_DATA__', value: v });
  }

  // window.<name> = {...} / [...] — balanced-brace extraction (a lazy regex
  // breaks on nested objects), then validate as JSON.
  const windowAssign = /window\.([a-zA-Z_$][\w$]*)\s*=\s*(?=[[{])/.exec(rawHtml);
  if (windowAssign) {
    const from = windowAssign.index + windowAssign[0].length;
    const blob = extractJsonBlob(rawHtml.slice(from));
    const v = blob ? tryParse(blob) : undefined;
    if (v !== undefined) parsed.push({ source: `window.${windowAssign[1]}`, value: v });
  }

  // Other SSR hydration hooks — token presence only (payloads vary in shape).
  const hydration = rawHtml.match(/(__NUXT__|__APOLLO_STATE__|__INITIAL_STATE__)/);

  // Large inline JSON blob, only if nothing structured was parsed above.
  if (parsed.length === 0) {
    for (const s of rawHtml.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) {
      const body = (s[1] ?? '').trim();
      if (body.length >= MIN_JSON_BLOB) {
        const blob = extractJsonBlob(body);
        const v = blob && blob.length >= MIN_JSON_BLOB ? tryParse(blob) : undefined;
        if (v !== undefined) {
          parsed.push({ source: `inline blob (${blob!.length} chars)`, value: v });
          break;
        }
      }
    }
  }

  // Listing-shaped wins.
  const listing = parsed.find((p) => jsonHasListingArray(p.value));
  if (listing) {
    return {
      found: true,
      listingShaped: true,
      notes: `found listing-shaped JSON in ${listing.source} (array of objects with property fields)`,
    };
  }

  const found = parsed.length > 0 || Boolean(hydration);
  if (!found) return { found: false, listingShaped: false, notes: '' };

  // Generic JSON only — spell out why it was not trusted as listings.
  const noteParts: string[] = [];
  if (parsed.length) {
    noteParts.push('JSON present but not listing-shaped: ' + parsed.map((p) => p.source).join(', '));
  }
  const seo = uniq(ldTypes.filter((t) => SEO_SCHEMA_TYPES.has(t.toLowerCase())));
  if (seo.length) noteParts.push(`ld+json is SEO schema (${seo.join(', ')}) — excluded`);
  if (hydration && parsed.length === 0) {
    noteParts.push(`hydration blob \`${hydration[1]}\` present but unparsed`);
  }

  return { found: true, listingShaped: false, notes: noteParts.join('; ') };
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
 * Spec §3 step 6 — search is POST-only, so listings are not addressable by URL.
 *
 * A POST search form is the defining signal and must outweigh the mere presence
 * of category/nav links like `/property-search/` or `/commercial` (trial report:
 * Michael Steel has a real POST search form but was missed because such nav
 * links tripped a blanket "has listing links" veto). The only thing that should
 * veto manual-entry is evidence that individual listings ARE addressable, i.e.
 * several deep listing-*detail* links (a category segment followed by a slug).
 */
export function detectManualOnly(rawHtml: string, renderedDom: string): Detection {
  const dom = renderedDom || rawHtml;

  // A <form method="post"> that is search-related (by action or nearby content).
  let postSearchForm = false;
  for (const f of dom.matchAll(/<form\b[^>]*\bmethod=["']post["'][^>]*>/gi)) {
    const tag = f[0];
    const window = dom.slice(f.index ?? 0, (f.index ?? 0) + 600);
    if (
      /action=["'][^"']*(search|find|propert|listing)/i.test(tag) ||
      /(search|keyword|location|find|radius|min\s*price|max\s*price)/i.test(window)
    ) {
      postSearchForm = true;
      break;
    }
  }
  if (!postSearchForm) return { found: false, notes: '' };

  // Deep listing-detail links = a category segment followed by a slug/id.
  const detailLinks = [
    ...dom.matchAll(
      /<a\b[^>]+href=["'][^"']*\/(?:propert(?:y|ies)|listing[s]?|for-sale|to-let|commercial)\/[a-z0-9][^"']{2,}["']/gi,
    ),
  ].length;

  if (detailLinks >= 3) {
    return {
      found: false,
      notes: `POST search form present, but ${detailLinks} addressable listing-detail links exist`,
    };
  }

  return {
    found: true,
    notes: `POST-only search form present; ${detailLinks} addressable listing-detail links — listings not URL-addressable`,
  };
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
  return tryParse(s) !== undefined;
}

/** Parse trimmed JSON, returning undefined (not throwing) on anything invalid. */
function tryParse(s: string | undefined): unknown {
  if (!s) return undefined;
  const t = s.trim();
  if (!(t.startsWith('{') || t.startsWith('['))) return undefined;
  try {
    return JSON.parse(t);
  } catch {
    return undefined;
  }
}

function uniq(xs: string[]): string[] {
  return [...new Set(xs)];
}

/** Collect every @type string from a JSON-LD value, following @graph. */
function collectLdTypes(value: unknown): string[] {
  const out: string[] = [];
  const visit = (x: unknown, depth: number): void => {
    if (depth > 6 || x === null) return;
    if (Array.isArray(x)) {
      x.forEach((el) => visit(el, depth + 1));
    } else if (typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const t = o['@type'];
      if (typeof t === 'string') out.push(t);
      else if (Array.isArray(t)) t.forEach((tt) => typeof tt === 'string' && out.push(tt));
      if (Array.isArray(o['@graph'])) (o['@graph'] as unknown[]).forEach((el) => visit(el, depth + 1));
    }
  };
  visit(value, 0);
  return out;
}

/**
 * True if `value` contains, anywhere within it, an array of objects where at
 * least one object carries >= 2 property fields. Same bar as `findListingApi`,
 * so embedded and API detection agree on what "listing-shaped" means.
 */
function jsonHasListingArray(value: unknown, depth = 0): boolean {
  if (depth > 8 || value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) {
    const objs = value.filter(
      (x): x is Record<string, unknown> => Boolean(x) && typeof x === 'object' && !Array.isArray(x),
    );
    if (objs.slice(0, 20).some((o) => propertyFieldHits(o) >= 2)) return true;
    return value.some((v) => jsonHasListingArray(v, depth + 1));
  }
  return Object.values(value as Record<string, unknown>).some((v) =>
    jsonHasListingArray(v, depth + 1),
  );
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
