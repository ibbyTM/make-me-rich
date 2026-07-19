/**
 * UK postcode geocoding via postcodes.io (free, no API key — ONS-backed).
 *
 * Two lookup modes, matched to what's actually present in each dashboard
 * source's stored data (checked 2026-07-19):
 *   - Barnsdales / PropertyHive-sourced rows embed a real postcode at the end
 *     of the address string ("Castleford, WF10 5HX") — `extractPostcode` +
 *     `bulkGeocodePostcodes` (POST /postcodes, up to 100/request) gives an
 *     exact, address-level point.
 *   - Rightmove Commercial's search-results payload carries no postcode at
 *     all (confirmed in src/scrapers/rightmoveCommercial.ts — only a human
 *     address string and city name); the dashboard row embeds the city in
 *     parens ("... (Leeds)"). For those, `extractTrailingCity` +
 *     `outcodeCentroid` (GET /outcodes/{outcode}) gives a city-centre
 *     APPROXIMATION only — every listing from that city collapses to one
 *     point. This is a real precision limitation, not a bug; callers must
 *     carry the distinction through (see scripts/data-centre-fit.ts).
 */

export interface LatLon {
  lat: number;
  lon: number;
}

const UK_POSTCODE_RE = /([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\s*$/i;

/** Extract a trailing UK postcode from a free-text address, or null. */
export function extractPostcode(text: string): string | null {
  const m = UK_POSTCODE_RE.exec(text.trim());
  if (!m) return null;
  // Normalise to "outward inward" — inward code is always exactly 3 chars
  // (1 digit + 2 letters), so re-inserting the space works regardless of
  // whether the source text had one.
  const compact = m[1]!.toUpperCase().replace(/\s+/g, '');
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}

/** Extract a trailing "(City)" group, as used by rightmove-commercial-report.ts. */
export function extractTrailingParen(text: string): string | null {
  const m = /\(([^()]+)\)\s*$/.exec(text.trim());
  return m ? m[1]!.trim() : null;
}

interface BulkPostcodeResponseItem {
  query: string;
  result: { latitude: number; longitude: number } | null;
}

/**
 * Bulk-geocode postcodes via POST /postcodes (max 100 per request, chunked
 * automatically). Unresolvable postcodes are simply absent from the returned
 * map — callers should treat that as "no location", not an error.
 */
export async function bulkGeocodePostcodes(
  postcodes: string[],
  fetchImpl: typeof fetch = fetch,
): Promise<Map<string, LatLon>> {
  const out = new Map<string, LatLon>();
  const unique = [...new Set(postcodes)];
  for (let i = 0; i < unique.length; i += 100) {
    const chunk = unique.slice(i, i + 100);
    const res = await fetchImpl('https://api.postcodes.io/postcodes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ postcodes: chunk }),
    });
    if (!res.ok) throw new Error(`postcodes.io bulk lookup: HTTP ${res.status}`);
    const body = (await res.json()) as { result: BulkPostcodeResponseItem[] };
    for (const item of body.result) {
      if (item.result) out.set(item.query, { lat: item.result.latitude, lon: item.result.longitude });
    }
  }
  return out;
}

/** Centroid of a postcode outward code (e.g. "LS1"), or null if not found. Cached per call site. */
export async function outcodeCentroid(
  outcode: string,
  fetchImpl: typeof fetch = fetch,
): Promise<LatLon | null> {
  const res = await fetchImpl(`https://api.postcodes.io/outcodes/${encodeURIComponent(outcode)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`postcodes.io outcode lookup ${outcode}: HTTP ${res.status}`);
  const body = (await res.json()) as { result: { latitude: number; longitude: number } | null };
  return body.result ? { lat: body.result.latitude, lon: body.result.longitude } : null;
}
