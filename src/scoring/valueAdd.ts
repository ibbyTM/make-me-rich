/**
 * Value-Add score (Phase 2, 2026-07-22) — read-only analysis layer measuring
 * price attractiveness vs. a local commercial rental-value benchmark. Pure
 * function, same discipline as dataCentreFit.ts: inputs in, a score + reasons
 * out.
 *
 * The price component was originally built against Land Registry Price Paid
 * Data, then rebuilt against VOA business rates data after discovering Land
 * Registry only covers *residential* sales (gov.uk's own guidance, confirmed
 * 2026-07-22) — comparing a warehouse's asking price to nearby house prices
 * would have been comparing two markets that don't move together. VOA
 * publishes a "rateable value" (its professional estimate of a commercial
 * property's annual market rent) for every non-domestic property in England
 * & Wales, free, no auth. See docs/value-add-2026-07-22.md for the full
 * investigation.
 *
 * Because rateable value is a *rental* figure and a listing's asking price
 * is a *capital* figure, there's no verifiable free source for the yield
 * (rent-to-price) multiple that would convert one into the other — inventing
 * one would look precise while being fabricated. Instead: compute each
 * listing's own (price per sq ft) ÷ (local VOA rate per sq ft) ratio, then
 * rank that ratio's PERCENTILE against every other scored listing in the
 * dataset. A listing in the cheapest percentile is trading at a lower
 * multiple of its local rental-value benchmark than its peers — a real,
 * relative "better value, controlling for location" signal, without
 * pretending to know the area's true cap rate.
 *
 * Flood risk was scored here in the first build (25 of 100 pts) but dropped
 * 2026-07-22 at the user's direction — not a priority, and it was only ever
 * a coarse postcode-prefix guess-list anyway (never a real Environment
 * Agency lookup). Score is now 100% the price-percentile signal.
 */

export interface ValueAddInput {
  priceAmount: number | null;
  sizeSqft: number | null;
  /** District median rateable-value-per-sqft from VOA business rates data, or null if no district benchmark. */
  localVoaRatePerSqft: number | null;
  /** Sample size behind that district median (should be reasonably large — VOA districts typically carry hundreds of records). */
  voaSampleCount: number;
  /**
   * 0-100 percentile rank of this listing's (price/sqft ÷ localVoaRatePerSqft)
   * ratio within the full set of scoreable listings, precomputed by the
   * caller (a single row can't rank itself). Lower = cheaper relative to its
   * local commercial rental-value benchmark than most peers. Null if this
   * listing itself couldn't be ranked (missing price/size/benchmark).
   */
  ratioPercentile: number | null;
}

export interface ValueAddResult {
  score: number;
  band: 'strong' | 'possible' | 'unlikely' | 'insufficient_data';
  reasons: string[];
}

const MIN_VOA_SAMPLES = 10;

const PERCENTILE_BANDS: { maxPercentile: number; points: number }[] = [
  { maxPercentile: 20, points: 100 },
  { maxPercentile: 35, points: 80 },
  { maxPercentile: 50, points: 60 },
  { maxPercentile: 65, points: 35 },
  { maxPercentile: 80, points: 15 },
  { maxPercentile: 100, points: 0 },
];

function priceAttractivenessPoints(
  priceAmount: number | null,
  sizeSqft: number | null,
  localVoaRatePerSqft: number | null,
  voaSampleCount: number,
  ratioPercentile: number | null,
): { points: number; reason: string; hasData: boolean } {
  if (priceAmount === null || priceAmount <= 0 || sizeSqft === null || sizeSqft <= 0) {
    return { points: 0, reason: 'price or size unknown', hasData: false };
  }
  if (localVoaRatePerSqft === null || voaSampleCount < MIN_VOA_SAMPLES) {
    return { points: 0, reason: `no VOA business-rates benchmark for this district (need ≥${MIN_VOA_SAMPLES} samples)`, hasData: false };
  }
  if (ratioPercentile === null) {
    return { points: 0, reason: 'could not rank against other scored listings', hasData: false };
  }

  const pricePerSqft = priceAmount / sizeSqft;
  const ratio = pricePerSqft / localVoaRatePerSqft;
  const band = PERCENTILE_BANDS.find((b) => ratioPercentile <= b.maxPercentile)!;

  return {
    points: band.points,
    reason: `£${pricePerSqft.toFixed(0)}/sqft vs local VOA benchmark £${localVoaRatePerSqft.toFixed(2)}/sqft (ratio ${ratio.toFixed(1)}×) — ${ratioPercentile.toFixed(0)}th percentile among scored listings (lower = cheaper)`,
    hasData: true,
  };
}

function bandOf(score: number): ValueAddResult['band'] {
  if (score >= 65) return 'strong';
  if (score >= 35) return 'possible';
  return 'unlikely';
}

export function scoreValueAdd(input: ValueAddInput): ValueAddResult {
  const price = priceAttractivenessPoints(
    input.priceAmount,
    input.sizeSqft,
    input.localVoaRatePerSqft,
    input.voaSampleCount,
    input.ratioPercentile,
  );

  if (!price.hasData) {
    return { score: 0, band: 'insufficient_data', reasons: [price.reason] };
  }

  return { score: price.points, band: bandOf(price.points), reasons: [price.reason] };
}
