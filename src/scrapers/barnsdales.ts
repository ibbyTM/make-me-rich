/**
 * Barnsdales listing scraper (additive; independent of the classifier pipeline).
 *
 * Barnsdales publishes its whole listing set as an embedded JS array on the
 * listings page: `var properties = [ {…}, … ]`. This module extracts that array
 * and applies the documented commercial-freehold filter from the handover doc:
 *
 *   freehold_from != null  AND  residential === false  AND
 *   status ∈ { "Available", "Coming Soon" }
 *
 * Read-only: it fetches a public page and parses it. Nothing is written back.
 */

const UA = 'CAIS-SourceOnboarding/0.1 (read-only listing pull; +https://example.invalid/bot)';

export const BARNSDALES_LISTINGS_URL = 'https://www.barnsdales.co.uk/properties';

/** Statuses that count as a live opportunity (handover doc). */
const ACTIVE_STATUSES = new Set(['Available', 'Coming Soon']);

/** Raw shape of a Barnsdales property object (only the fields we rely on). */
export interface BarnsdalesProperty {
  id: number;
  location: string | null;
  postcode: string | null;
  name: string | null;
  min_size: number | null;
  max_size: number | null;
  residential: boolean;
  status: string;
  freehold: boolean;
  freehold_from: number | null;
  freehold_to: number | null;
  freehold_price: string | null;
  categories: string[];
  [key: string]: unknown;
}

/** Normalised commercial-freehold listing. */
export interface BarnsdalesListing {
  id: number;
  location: string;
  postcode: string;
  /** Human-readable size straight from the site, e.g. "2776 sqft" / "1.1 acres". */
  sizeLabel: string;
  /** Numeric floor area in sq ft, only when the native unit is sq ft (null for land/acres). */
  sizeSqft: number | null;
  /** Guide price from `freehold_from` (GBP). */
  priceFrom: number;
  /** Display price string as shown on the site, e.g. "Offers in the region of £425,000". */
  priceDisplay: string;
  status: string;
  categories: string[];
  /** Live detail page (pattern `/properties/<id>`, verified 2026-07-17). */
  url: string;
}

/**
 * Extract the `var properties = [...]` array from the listings page HTML.
 * Uses a string-aware balanced-bracket scan so brackets inside string values
 * (media URLs, price blurbs) don't break parsing.
 */
export function extractProperties(html: string): BarnsdalesProperty[] {
  const at = html.indexOf('var properties');
  if (at === -1) {
    throw new Error('Barnsdales: `var properties` not found on page — layout may have changed.');
  }
  const start = html.indexOf('[', at);
  if (start === -1) throw new Error('Barnsdales: could not locate start of properties array.');

  let depth = 0;
  let inStr = false;
  let esc = false;
  let end = -1;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) throw new Error('Barnsdales: properties array was not balanced.');

  return JSON.parse(html.slice(start, end + 1)) as BarnsdalesProperty[];
}

/** Apply the documented commercial-freehold filter and normalise. */
export function filterCommercialFreehold(props: BarnsdalesProperty[]): BarnsdalesListing[] {
  return props
    .filter(
      (p) =>
        p.freehold_from != null &&
        p.residential === false &&
        ACTIVE_STATUSES.has(p.status),
    )
    .map(toListing);
}

function toListing(p: BarnsdalesProperty): BarnsdalesListing {
  const name = (p.name ?? '').trim();
  const isSqft = /sq\s*\.?\s*ft/i.test(name);
  return {
    id: p.id,
    location: (p.location ?? '').trim(),
    postcode: (p.postcode ?? '').trim(),
    sizeLabel: name || (typeof p.min_size === 'number' ? String(p.min_size) : ''),
    sizeSqft: isSqft && typeof p.min_size === 'number' ? p.min_size : null,
    priceFrom: p.freehold_from as number,
    priceDisplay: (p.freehold_price ?? `£${(p.freehold_from as number).toLocaleString('en-GB')}`).trim(),
    status: p.status,
    categories: Array.isArray(p.categories) ? p.categories : [],
    url: `https://www.barnsdales.co.uk/properties/${p.id}`,
  };
}

export interface BarnsdalesPull {
  totalOnPage: number;
  listings: BarnsdalesListing[];
}

/** Fetch the live listings page and return the filtered commercial-freehold set. */
export async function fetchBarnsdalesListings(opts?: {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}): Promise<BarnsdalesPull> {
  const f = opts?.fetchImpl ?? fetch;
  const res = await f(BARNSDALES_LISTINGS_URL, {
    headers: { 'user-agent': UA },
    redirect: 'follow',
    signal: AbortSignal.timeout(opts?.timeoutMs ?? 45000),
  });
  if (!res.ok) throw new Error(`Barnsdales: listings page returned HTTP ${res.status}`);
  const html = await res.text();
  const props = extractProperties(html);
  return { totalOnPage: props.length, listings: filterCommercialFreehold(props) };
}
