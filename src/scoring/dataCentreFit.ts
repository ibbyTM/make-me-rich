/**
 * "Data Centre Fit" score (Phase 1, 2026-07-19; grid-signal rebuilt
 * 2026-07-22) — read-only analysis layer on top of listings already in the
 * dashboard. Pure function, same discipline as src/filter/stageZero.ts:
 * inputs in, a score + human-readable reasons out, so the "why" is
 * inspectable rather than a black box, and every weight/threshold below is a
 * named constant specifically so it's easy to sanity-check and retune.
 *
 * Three weighted components, 100 points total:
 *   - proximity to a high-voltage electricity SUBSTATION — 60 pts, by far
 *     the heaviest weight ("weight heavily on proximity" per the original
 *     brief). This replaced power-station proximity as the primary signal
 *     2026-07-22: checked against the live dataset, half of the 185 GB power
 *     stations >=50MW are wind farms, which sit in remote/rural locations
 *     far from substantial grid infrastructure — "near a big wind farm"
 *     isn't strong evidence of "near spare grid capacity" the way "near a
 *     275kV substation" is. A data centre physically connects to a
 *     substation, not a generation site, so that's the more direct signal.
 *     See src/geo/substations.ts and docs/data-centre-fit-substations-2026-07-22.md.
 *   - property size — 25 pts, favouring large plots (industrial/warehouse/
 *     land scale, acres or tens of thousands of sq ft) over small retail/
 *     office units.
 *   - property subtype — 15 pts, favouring Industrial/Warehouse/Land/
 *     Development, deprioritising Retail/Office, per the brief.
 */

export interface DataCentreFitInput {
  /** Points (0-60) already computed for the nearest usable substation by src/geo/substations.ts's bestSubstationScore — tier (voltage) × distance decay, folded into one number so this function doesn't need to know about voltage tiers itself. Null if no location data or no substation found nearby. */
  substationPoints: number | null;
  /** Human-readable description of the substation match, for the reasons array (e.g. "1.2km to Thorpe Marsh Substation (400kV)"). */
  substationReason: string;
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
  const substationPts = Math.max(0, Math.min(60, input.substationPoints ?? 0));
  const s = sizePoints(input.sizeSqftEquivalent);
  const t = subtypePoints(input.propertyType);
  const score = substationPts + s.points + t.points;
  return { score, band: bandOf(score), reasons: [input.substationReason, s.reason, t.reason] };
}
