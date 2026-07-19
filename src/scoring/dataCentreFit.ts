/**
 * "Data Centre Fit" score (Phase 1, 2026-07-19) — read-only analysis layer on
 * top of listings already in the dashboard. Pure function, same discipline as
 * src/filter/stageZero.ts: inputs in, a score + human-readable reasons out, so
 * the "why" is inspectable rather than a black box, and every weight/threshold
 * below is a named constant specifically so it's easy to sanity-check and
 * retune once real distance/size numbers are in hand (that's the explicit
 * point of this pass — see docs/data-centre-fit-2026-07-19.md).
 *
 * Three weighted components, 100 points total:
 *   - proximity to the nearest MAJOR power station (>=50MW) — 60 pts, by far
 *     the heaviest weight per the brief ("weight heavily on proximity").
 *     Deliberately keyed to major stations, not any generation site: a data
 *     centre needs a meaningful nearby grid connection, and a 1MW rooftop
 *     solar array a few hundred metres away isn't evidence of one the way a
 *     ex-coal/gas/nuclear/large-wind-farm site is.
 *   - property size — 25 pts, favouring large plots (industrial/warehouse/
 *     land scale, acres or tens of thousands of sq ft) over small retail/
 *     office units.
 *   - property subtype — 15 pts, favouring Industrial/Warehouse/Land/
 *     Development, deprioritising Retail/Office, per the brief.
 */

export const MAJOR_STATION_MIN_MW = 50;

export interface DataCentreFitInput {
  /** Distance in km to the nearest power station with capacity >= MAJOR_STATION_MIN_MW, or null if no location data. */
  nearestMajorStationKm: number | null;
  /** Best-effort size in sq ft (acres already converted), or null if unknown. */
  sizeSqftEquivalent: number | null;
  /** Raw property type/subtype string as stored on the listing (may be blank). */
  propertyType: string;
}

export interface DataCentreFitResult {
  score: number;
  band: 'strong' | 'possible' | 'unlikely';
  reasons: string[];
}

/** 1 acre = 43,560 sq ft. Falls back to this when a listing only carries an acreage label. */
export function sizeSqftEquivalent(sizeLabel: string, sizeSqft: number | null): number | null {
  if (sizeSqft && sizeSqft > 0) return sizeSqft;
  const acres = /([\d.]+)\s*acres?/i.exec(sizeLabel ?? '');
  if (acres) return Math.round(Number(acres[1]) * 43560);
  return null;
}

const DISTANCE_BANDS: { maxKm: number; points: number }[] = [
  { maxKm: 2, points: 60 },
  { maxKm: 5, points: 50 },
  { maxKm: 10, points: 35 },
  { maxKm: 20, points: 20 },
  { maxKm: 40, points: 8 },
  { maxKm: Infinity, points: 0 },
];

function distancePoints(km: number | null): { points: number; reason: string } {
  if (km === null) return { points: 0, reason: 'no location data — distance to power station unknown' };
  const band = DISTANCE_BANDS.find((b) => km <= b.maxKm)!;
  return { points: band.points, reason: `${km.toFixed(1)}km to nearest major (>=${MAJOR_STATION_MIN_MW}MW) power station` };
}

const SIZE_BANDS: { minSqft: number; points: number }[] = [
  { minSqft: 100_000, points: 25 },
  { minSqft: 20_000, points: 18 },
  { minSqft: 5_000, points: 10 },
  { minSqft: 2_000, points: 5 },
  { minSqft: 0, points: 0 },
];

function sizePoints(sqft: number | null): { points: number; reason: string } {
  if (sqft === null) return { points: 0, reason: 'size unknown' };
  const band = SIZE_BANDS.find((b) => sqft >= b.minSqft)!;
  return { points: band.points, reason: `${sqft.toLocaleString('en-GB')} sq ft equivalent` };
}

const SUBTYPE_RULES: { pattern: RegExp; points: number }[] = [
  { pattern: /industrial|warehouse|distribution|logistics/i, points: 15 },
  { pattern: /\bland\b|development/i, points: 15 },
  { pattern: /mixed use/i, points: 8 },
  { pattern: /office/i, points: 3 },
  { pattern: /retail/i, points: 0 },
];

function subtypePoints(propertyType: string): { points: number; reason: string } {
  const t = (propertyType ?? '').trim();
  if (!t) return { points: 5, reason: 'subtype unknown (neutral)' };
  const rule = SUBTYPE_RULES.find((r) => r.pattern.test(t));
  return rule
    ? { points: rule.points, reason: `subtype "${t}"` }
    : { points: 5, reason: `subtype "${t}" — no specific rule, neutral` };
}

/** Score bands — tune once the real distribution (docs/data-centre-fit-2026-07-19.md) is reviewed. */
function bandOf(score: number): DataCentreFitResult['band'] {
  if (score >= 65) return 'strong';
  if (score >= 35) return 'possible';
  return 'unlikely';
}

export function scoreDataCentreFit(input: DataCentreFitInput): DataCentreFitResult {
  const d = distancePoints(input.nearestMajorStationKm);
  const s = sizePoints(input.sizeSqftEquivalent);
  const t = subtypePoints(input.propertyType);
  const score = d.points + s.points + t.points;
  return { score, band: bandOf(score), reasons: [d.reason, s.reason, t.reason] };
}
