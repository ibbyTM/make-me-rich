/**
 * Value-Add score (Phase 2, 2026-07-22) — read-only analysis layer measuring
 * price undervaluation vs. market comparables + flood risk. Pure function,
 * same discipline as dataCentreFit.ts: inputs in, a score + reasons out.
 *
 * Two weighted components, 100 points total:
 *   - Price vs. comparables (75 pts): how much cheaper than local median?
 *     Properties 20%+ below comparable median score full 75 pts. Above median
 *     scores 0 pts. Gated by having ≥3 comparables samples in postcode.
 *   - Flood risk (25 pts): flood-zone classification. Zone 1 (low) scores 25 pts,
 *     Zone 2 (medium) scores 10 pts, Zone 3 (high) scores 0 pts.
 *
 * Floored at 0, can never exceed 100.
 */

export type FloodRiskZone = 1 | 2 | 3 | null;

export interface ValueAddInput {
  priceAmount: number | null;
  postcode: string | null;
  floodRiskZone: FloodRiskZone;
  /** Median sale price for this postcode (from Land Registry comparables), or null if unknown */
  postcodeMedianPrice: number | null;
  /** Sample size used to compute median (should be ≥3 for confidence) */
  comparableSampleCount: number;
}

export interface ValueAddResult {
  score: number;
  band: 'strong' | 'possible' | 'unlikely' | 'insufficient_data';
  reasons: string[];
}

const PRICE_BANDS: { discountPercent: number; points: number }[] = [
  { discountPercent: 30, points: 75 },
  { discountPercent: 20, points: 75 },
  { discountPercent: 15, points: 60 },
  { discountPercent: 10, points: 45 },
  { discountPercent: 5, points: 25 },
  { discountPercent: 0, points: 0 },
  { discountPercent: -100, points: -10 }, // Premium over median (rare, scores negative)
];

function priceUndervaluationPoints(
  price: number | null,
  postcodeMedian: number | null,
  sampleCount: number,
): { points: number; reason: string } {
  if (price === null || postcodeMedian === null) {
    return { points: 0, reason: 'price or comparables unknown' };
  }

  if (sampleCount < 3) {
    return { points: 0, reason: `only ${sampleCount} comparable samples (need ≥3 for confidence)` };
  }

  const discountPercent = ((postcodeMedian - price) / postcodeMedian) * 100;

  if (discountPercent >= 20) {
    return {
      points: 75,
      reason: `${discountPercent.toFixed(0)}% below postcode median (£${postcodeMedian.toLocaleString('en-GB')})`,
    };
  } else if (discountPercent >= 15) {
    return {
      points: 60,
      reason: `${discountPercent.toFixed(0)}% below postcode median`,
    };
  } else if (discountPercent >= 10) {
    return {
      points: 45,
      reason: `${discountPercent.toFixed(0)}% below postcode median`,
    };
  } else if (discountPercent >= 5) {
    return {
      points: 25,
      reason: `${discountPercent.toFixed(0)}% below postcode median`,
    };
  } else if (discountPercent >= 0) {
    return {
      points: 0,
      reason: `at or above postcode median (no undervaluation)`,
    };
  } else {
    return {
      points: -10,
      reason: `${Math.abs(discountPercent).toFixed(0)}% above postcode median (premium)`,
    };
  }
}

function floodRiskPoints(zone: FloodRiskZone): { points: number; reason: string } {
  switch (zone) {
    case 1:
      return { points: 25, reason: 'Zone 1 — low flood risk' };
    case 2:
      return { points: 10, reason: 'Zone 2 — medium flood risk' };
    case 3:
      return { points: 0, reason: 'Zone 3 — high flood risk' };
    case null:
      return { points: 5, reason: 'flood risk unknown (neutral)' };
  }
}

function bandOf(score: number, hasComparables: boolean): ValueAddResult['band'] {
  if (!hasComparables) return 'insufficient_data';
  if (score >= 65) return 'strong';
  if (score >= 35) return 'possible';
  return 'unlikely';
}

export function scoreValueAdd(input: ValueAddInput): ValueAddResult {
  const hasComparables =
    input.priceAmount !== null &&
    input.priceAmount > 0 &&
    (input.postcodeMedianPrice ?? null) !== null &&
    input.comparableSampleCount >= 3;

  const price = priceUndervaluationPoints(input.priceAmount, input.postcodeMedianPrice, input.comparableSampleCount);
  const flood = floodRiskPoints(input.floodRiskZone);

  // If insufficient comparable data, return 0 score regardless of flood zone
  if (!hasComparables) {
    return {
      score: 0,
      band: 'insufficient_data',
      reasons: [price.reason, flood.reason],
    };
  }

  const rawScore = price.points + flood.points;
  const score = Math.max(0, Math.min(100, rawScore)); // Clamp to [0, 100]

  return {
    score,
    band: bandOf(score, true),
    reasons: [price.reason, flood.reason],
  };
}
