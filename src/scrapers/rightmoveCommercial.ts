/**
 * Rightmove Commercial for-sale scraper (read-only; additive).
 *
 * Structure confirmed live 2026-07-14: commercial search-results pages
 * (`/commercial-property-for-sale/find.html?locationIdentifier=REGION^<id>&index=<n>`)
 * are Next.js pages embedding PLAIN JSON in
 * `<script id="__NEXT_DATA__" type="application/json">`, with listings at
 * `props.pageProps.searchResults.properties` (24 per page + featured repeats,
 * index paginates in steps of 24, `pagination.total` = page count).
 *
 * Note this differs from Rightmove *detail* pages, which now serve
 * `window.__PAGE_MODEL` in React-Flight reference-indexed format (see
 * docs/property-web-scraper-eval-2026-07-14.md). The search page is the right
 * surface for a portal-wide pull: one page yields ~24 listings across many
 * agents, with price/size/agent all present — no detail-page fetches needed.
 *
 * robots.txt (checked 2026-07-14): `find.html` for commercial channels is NOT
 * disallowed (only contactBranch/map/photos/full-description paths are).
 * Portal ToS may still restrict automated collection — in the CAIS pipeline
 * portals remain a route-to-review item (spec §4/§5); this module is for
 * explicit, low-volume, read-only pulls: it fetches only search pages, capped
 * per city, with a delay between requests.
 */

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const PAGE_SIZE = 24;

/** REGION location identifiers, verified live via los.rightmove.co.uk typeahead. */
export const CITYWIDE_CITIES: ReadonlyArray<{
  city: string;
  region: 'Yorkshire' | 'Greater Manchester';
  locationId: string;
}> = [
  { city: 'Leeds', region: 'Yorkshire', locationId: '787' },
  { city: 'Sheffield', region: 'Yorkshire', locationId: '1195' },
  { city: 'Bradford', region: 'Yorkshire', locationId: '198' },
  { city: 'Huddersfield', region: 'Yorkshire', locationId: '664' },
  { city: 'Doncaster', region: 'Yorkshire', locationId: '430' },
  { city: 'Manchester', region: 'Greater Manchester', locationId: '904' },
  { city: 'Bolton', region: 'Greater Manchester', locationId: '182' },
];

/** Raw Rightmove search-result property (fields we rely on). */
interface RawProperty {
  id: number | string;
  displayAddress?: string;
  price?: { amount?: number; displayPrices?: { displayPrice?: string; displayPriceQualifier?: string }[] };
  displaySize?: string;
  propertySubType?: string;
  propertyTypeFullDescription?: string;
  summary?: string;
  keyFeatures?: string[];
  /** String on some listings, `{ tenureType: ... }` object on others. */
  tenure?: string | { tenureType?: string | null } | null;
  customer?: { branchDisplayName?: string; brandTradingName?: string };
  images?: { srcUrl?: string; caption?: string }[];
  commercial?: boolean;
  residential?: boolean;
  transactionType?: string;
  auction?: boolean;
  displayStatus?: string;
  propertyUrl?: string;
  firstVisibleDate?: string;
  [key: string]: unknown;
}

export interface RightmoveListing {
  id: string;
  address: string;
  city: string;
  region: string;
  /** Sale price in GBP (0 when POA/unspecified). */
  priceAmount: number;
  priceDisplay: string;
  /** e.g. "5,242 sq. ft." — verbatim from the site. */
  sizeLabel: string;
  /** Parsed sq ft, null when the size is absent or in other units (acres). */
  sizeSqft: number | null;
  subType: string;
  agent: string;
  tenure: string;
  /** Marketing text (summary + key features) for keyword matching. */
  text: string;
  status: string;
  auction: boolean;
  url: string;
  /** First listing photo, already cropped by Rightmove (~476x317). Null if none. */
  imageUrl: string | null;
}

export interface CityPull {
  city: string;
  region: string;
  resultCount: number;
  pagesFetched: number;
  listings: RightmoveListing[];
}

interface SearchResults {
  resultCount: number;
  pageCount: number;
  properties: RawProperty[];
}

/** Extract and parse the __NEXT_DATA__ JSON blob from a search page. */
export function extractNextData(html: string): unknown {
  const m = /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/.exec(html);
  if (!m) {
    throw new Error('Rightmove: __NEXT_DATA__ script not found — page layout may have changed.');
  }
  return JSON.parse(m[1]!);
}

/** Navigate to searchResults; throws with a clear message if the shape moved. */
export function extractSearchResults(html: string): SearchResults {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = extractNextData(html) as any;
  const sr = data?.props?.pageProps?.searchResults;
  if (!sr || !Array.isArray(sr.properties)) {
    throw new Error('Rightmove: props.pageProps.searchResults.properties missing — shape changed.');
  }
  return {
    resultCount: Number(sr.resultCount ?? sr.properties.length),
    pageCount: Number(sr.pagination?.total ?? 1),
    properties: sr.properties as RawProperty[],
  };
}

/** Parse "5,242 sq. ft." → 5242; returns null for acres/absent/unparseable. */
export function parseSqft(displaySize: string | undefined): number | null {
  if (!displaySize) return null;
  const m = /([\d,.]+)\s*sq\.?\s*ft/i.exec(displaySize);
  if (!m) return null;
  const n = Number(m[1]!.replace(/,/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

/** Keep genuine commercial for-sale rows and normalise. */
export function normalizeProperties(
  raw: RawProperty[],
  city: string,
  region: string,
): RightmoveListing[] {
  return raw
    .filter(
      (p) =>
        p.commercial === true &&
        p.residential !== true &&
        (p.transactionType ?? 'buy').toLowerCase() === 'buy' &&
        p.id !== undefined,
    )
    .map((p) => {
      const dp = p.price?.displayPrices?.[0];
      const tenure =
        typeof p.tenure === 'string'
          ? p.tenure.trim()
          : (p.tenure?.tenureType ?? '').toString().trim();
      return {
        id: String(p.id),
        address: (p.displayAddress ?? '').trim(),
        city,
        region,
        priceAmount: typeof p.price?.amount === 'number' ? p.price.amount : 0,
        priceDisplay: [dp?.displayPrice, dp?.displayPriceQualifier].filter(Boolean).join(' ').trim() || 'POA',
        sizeLabel: (p.displaySize ?? '').trim(),
        sizeSqft: parseSqft(p.displaySize),
        subType: (p.propertySubType ?? p.propertyTypeFullDescription ?? '').trim(),
        agent: (p.customer?.branchDisplayName ?? p.customer?.brandTradingName ?? 'Unknown agent').trim(),
        tenure,
        text: [p.propertyTypeFullDescription, p.summary, ...(p.keyFeatures ?? []), tenure]
          .filter(Boolean)
          .join(' '),
        status: (p.displayStatus ?? '').trim(),
        auction: p.auction === true,
        url: p.propertyUrl ? new URL(p.propertyUrl, 'https://www.rightmove.co.uk').toString() : '',
        imageUrl: p.images?.[0]?.srcUrl ?? null,
      };
    });
}

/**
 * propertySubType values that denote a business-for-sale (going concern) rather
 * than investable commercial premises — cafés, salons, licensed trade, etc.
 * These distort Stage-0 (their marketing text nearly always says "freehold")
 * without being commercial-investment stock. Values observed live 2026-07-14
 * (Cafe, Restaurant, Convenience Store, ...) plus Rightmove's standard
 * going-concern categories. Deliberately NOT excluded: Retail Property
 * (premises), Shop, Childcare Facility, Commercial/Residential Development,
 * Mixed Use — those are premises/development stock even when an operator lists
 * them. Pubs, bars/nightclubs and hotels are also KEPT (decision 2026-07-14):
 * they're often licensed-trade sales, but at Citywide's price band a large
 * freehold pub/hotel is genuine C2R conversion stock, and the portal-aware
 * Stage-0 (price+keyword required) filters the small trading businesses
 * anyway. Guest houses/B&Bs stay excluded — trading-income-priced, not
 * conversion-scale.
 */
const GOING_CONCERN_SUBTYPES: RegExp[] = [
  /\bcaf[eé]\b/i,
  /coffee\s*shop/i,
  /restaurant/i,
  /take\s*away|takeaway|fast\s*food/i,
  /convenience\s*store|newsagent|off\s*licence|post\s*office/i,
  /hairdresser|barber|hair\s*salon|beauty|nail\s*(bar|salon)|tanning|spa\b/i,
  /guest\s*house|bed\s*(and|&)\s*breakfast|\bb\s*&\s*b\b|hostel/i,
  /florist|butcher|baker(y)?|dry\s*clean|launderette|laundrette/i,
  /travel\s*agen/i,
  /petrol\s*station|garage\s*services|car\s*wash/i,
];

/** True when a listing's subtype marks it as a business-for-sale going concern. */
export function isGoingConcern(listing: Pick<RightmoveListing, 'subType'>): boolean {
  return GOING_CONCERN_SUBTYPES.some((re) => re.test(listing.subType));
}

function searchUrl(locationId: string, index: number): string {
  return (
    'https://www.rightmove.co.uk/commercial-property-for-sale/find.html' +
    `?locationIdentifier=REGION%5E${locationId}&index=${index}`
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface FetchOptions {
  /** Cap on pages fetched per city (default 5 ≈ 120 listings). */
  maxPagesPerCity?: number;
  /** Delay between HTTP requests in ms (default 1500). */
  delayMs?: number;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

/** Fetch all (capped) pages for one city; dedupes featured repeats by id. */
export async function fetchCityListings(
  target: { city: string; region: string; locationId: string },
  opts: FetchOptions = {},
): Promise<CityPull> {
  const f = opts.fetchImpl ?? fetch;
  const maxPages = opts.maxPagesPerCity ?? 5;
  const delayMs = opts.delayMs ?? 1500;
  const timeoutMs = opts.timeoutMs ?? 30000;

  const byId = new Map<string, RightmoveListing>();
  let resultCount = 0;
  let pageCount = 1;
  let page = 0;

  for (; page < Math.min(pageCount, maxPages); page++) {
    if (page > 0) await sleep(delayMs);
    const res = await f(searchUrl(target.locationId, page * PAGE_SIZE), {
      headers: { 'user-agent': UA, accept: 'text/html' },
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) throw new Error(`Rightmove ${target.city}: HTTP ${res.status} on page ${page + 1}`);
    const sr = extractSearchResults(await res.text());
    resultCount = sr.resultCount;
    pageCount = sr.pageCount;
    for (const l of normalizeProperties(sr.properties, target.city, target.region)) {
      if (!byId.has(l.id)) byId.set(l.id, l);
    }
  }

  return {
    city: target.city,
    region: target.region,
    resultCount,
    pagesFetched: page,
    listings: [...byId.values()],
  };
}
