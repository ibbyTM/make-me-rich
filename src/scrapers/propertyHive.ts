/**
 * Generic PropertyHive WordPress REST scraper (read-only; additive).
 *
 * Many independent UK agents run the PropertyHive plugin, which (when the
 * property post type is REST-exposed) serves full structured listings at
 *   <base>/wp-json/wp/v2/<postType>?per_page=100&page=N
 * with address, postcode, price_from/price, floor_area_from(+units),
 * availability, department and the live listing link.
 *
 * First confirmed source: SMC Brownill Vickers (Sheffield), discovered via the
 * 2026-07-17 search-discovery batch and verified live: department=commercial,
 * availability="For Sale", floor_area_units="sqft".
 *
 * Follows the Barnsdales pattern: fetch → documented filter (commercial +
 * for-sale + on-market) → normalise. Read-only public API GETs, paginated
 * politely with a delay, page count from X-WP-TotalPages.
 */

const UA = 'CAIS-SourceOnboarding/0.1 (read-only listing pull)';

/** Raw PropertyHive REST property (fields we rely on). */
interface PHProperty {
  id: number;
  title?: { rendered?: string };
  link?: string;
  department?: string;
  availability?: string;
  on_market?: string;
  address_street?: string;
  address_two?: string;
  address_three?: string;
  address_postcode?: string;
  price?: string | number;
  price_from?: string | number;
  price_qualifier?: string;
  floor_area_from?: string | number;
  floor_area_to?: string | number;
  floor_area_units?: string;
  tenure?: string;
  features?: string[];
  excerpt?: { rendered?: string } | string;
  /** Human-readable, e.g. "Office" — a real field, not a taxonomy ID lookup. */
  property_type?: string;
  images?: { url?: string; large?: string; medium?: string; thumbnail?: string }[];
  [key: string]: unknown;
}

export interface PropertyHiveListing {
  id: number;
  address: string;
  town: string;
  postcode: string;
  priceAmount: number;
  priceDisplay: string;
  sizeSqft: number | null;
  sizeLabel: string;
  availability: string;
  propertyType: string;
  text: string;
  url: string;
  /** First photo, "medium" WP conversion (~300x225). Null if none uploaded. */
  imageUrl: string | null;
}

export interface PropertyHiveSource {
  /** e.g. "SMC Brownill Vickers" — used as the dashboard source label. */
  name: string;
  /** e.g. "https://smcbrownillvickers.com" */
  baseUrl: string;
  /** REST post type slug, e.g. "property". */
  postType: string;
}

/** Confirmed PropertyHive sources from the 2026-07-17 discovery batch. */
export const PROPERTY_HIVE_SOURCES: PropertyHiveSource[] = [
  { name: 'SMC Brownill Vickers', baseUrl: 'https://smcbrownillvickers.com', postType: 'property' },
  // Cardwells also exposes PropertyHive REST but its API carries residential
  // stock only (verified across all pages 2026-07-17) — not listed here.
];

const num = (v: unknown): number => {
  const n = Number(String(v ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

/** Keep for-sale, on-market commercial rows and normalise (exported for tests). */
export function normalizePH(props: PHProperty[]): PropertyHiveListing[] {
  return props
    .filter(
      (p) =>
        p.department === 'commercial' &&
        p.availability === 'For Sale' &&
        p.on_market !== 'no' &&
        p.on_market !== '',
    )
    .map((p) => {
      const street = (p.address_street ?? '').trim();
      const town = (p.address_three ?? p.address_two ?? '').trim();
      const postcode = (p.address_postcode ?? '').trim();
      const priceAmount = num(p.price_from) || num(p.price);

      const units = (p.floor_area_units ?? '').toLowerCase();
      const rawArea = num(p.floor_area_from);
      let sizeSqft: number | null = null;
      if (rawArea > 0) {
        if (/sq\s*ft|sqft|ft/.test(units) || units === '') sizeSqft = Math.round(rawArea);
        else if (/m/.test(units)) sizeSqft = Math.round(rawArea * 10.7639);
      }
      const sizeLabel = rawArea > 0 ? `${rawArea} ${p.floor_area_units || 'sq ft'}` : '';

      const excerpt =
        typeof p.excerpt === 'object' ? (p.excerpt?.rendered ?? '') : (p.excerpt ?? '');
      return {
        id: p.id,
        address: [street, town].filter(Boolean).join(', '),
        town,
        postcode,
        priceAmount,
        priceDisplay:
          priceAmount > 0
            ? '£' + priceAmount.toLocaleString('en-GB') +
              (p.price_qualifier ? ` ${p.price_qualifier}` : '')
            : 'POA',
        sizeSqft,
        sizeLabel,
        availability: p.availability ?? '',
        propertyType: (p.property_type ?? '').trim(),
        text: [
          p.title?.rendered,
          ...(p.features ?? []),
          stripTags(String(excerpt)),
          p.tenure,
        ]
          .filter(Boolean)
          .join(' '),
        url: p.link ?? '',
        imageUrl: p.images?.[0]?.medium ?? p.images?.[0]?.thumbnail ?? null,
      };
    });
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export interface PHPull {
  source: string;
  totalOnApi: number;
  listings: PropertyHiveListing[];
}

export async function fetchPropertyHiveListings(
  source: PropertyHiveSource,
  opts: { maxPages?: number; delayMs?: number; timeoutMs?: number; fetchImpl?: typeof fetch } = {},
): Promise<PHPull> {
  const f = opts.fetchImpl ?? fetch;
  const maxPages = opts.maxPages ?? 10;
  const delayMs = opts.delayMs ?? 1000;
  const all: PHProperty[] = [];
  let totalPages = 1;

  for (let page = 1; page <= Math.min(totalPages, maxPages); page++) {
    if (page > 1) await new Promise((r) => setTimeout(r, delayMs));
    const url = `${source.baseUrl}/wp-json/wp/v2/${source.postType}?per_page=100&page=${page}`;
    const res = await f(url, {
      headers: { 'user-agent': UA, accept: 'application/json' },
      signal: AbortSignal.timeout(opts.timeoutMs ?? 30000),
    });
    if (!res.ok) throw new Error(`${source.name}: HTTP ${res.status} on page ${page}`);
    totalPages = Number(res.headers.get('x-wp-totalpages') ?? totalPages) || totalPages;
    all.push(...((await res.json()) as PHProperty[]));
  }

  return { source: source.name, totalOnApi: all.length, listings: normalizePH(all) };
}
