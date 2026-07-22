/**
 * Environment Agency flood risk zone lookup (free, no auth, OGC/WFS endpoint).
 * Determines which flood risk zone a property falls into:
 *   - Zone 1 (low): <0.1% annual probability, lowest risk
 *   - Zone 2 (medium): 0.1–1% annual probability
 *   - Zone 3 (high): >1% annual probability, highest risk
 *   - Null: location unknown or outside EA coverage
 *
 * For MVP, this accepts lat/lon and returns a zone. Real implementation
 * would query https://services.arcgisonline.com/arcgis/rest/services/
 * (Environment Agency's public WFS endpoint) or cache results locally.
 */

export type FloodRiskZone = 1 | 2 | 3 | null;

export interface FloodRiskResult {
  zone: FloodRiskZone;
  reason: string;
}

/**
 * Mock flood risk lookup. In production, this would query the EA's WFS
 * endpoint with lat/lon and return the zone containing that point.
 * For now, we return null (unknown) since lat/lon may be postcode-level precision.
 */
export function lookupFloodRisk(lat: number | null, lon: number | null): FloodRiskResult {
  if (lat === null || lon === null) {
    return { zone: null, reason: 'location unknown (postcode-level precision)' };
  }

  // In production, query Environment Agency WFS here and return actual zone
  // For MVP, return null to indicate lookup pending
  // Real query would be:
  //   https://services.arcgisonline.com/arcgis/rest/services/FloodRiskZones/MapServer
  //   with georeferencing to find containing zone
  return { zone: null, reason: 'location available but EA lookup pending (MVP)' };
}

/**
 * Estimate flood risk zone from postcode (simplified).
 * Returns a rough guess based on historical flood data by region.
 * Replaced by real WFS lookup once lat/lon is available.
 */
export function estimateFloodRiskByPostcode(postcode: string): FloodRiskResult {
  // Very simplified: some postcodes (e.g., river valleys, coastal) are known high-risk
  // This is a placeholder and will be replaced by real EA data
  const normalizedPostcode = postcode.toUpperCase().trim();

  // A few known high-risk postcodes from historic flooding (placeholder data)
  const knownHighRisk = ['M34', 'M35', 'M40', 'S1', 'S2', 'HD1', 'HD2'];
  const knownMediumRisk = ['M25', 'M26', 'S8', 'S9', 'HD3', 'HD4'];

  for (const prefix of knownHighRisk) {
    if (normalizedPostcode.startsWith(prefix)) {
      return { zone: 3, reason: `postcode district "${prefix}" — known flood-risk area` };
    }
  }

  for (const prefix of knownMediumRisk) {
    if (normalizedPostcode.startsWith(prefix)) {
      return { zone: 2, reason: `postcode district "${prefix}" — medium flood-risk area` };
    }
  }

  return { zone: 1, reason: 'postcode district — low historical flood risk' };
}
