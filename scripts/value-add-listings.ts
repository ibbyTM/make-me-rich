/**
 * Value-Add scoring (2026-07-22, rebuilt on VOA data) — read-only enrichment
 * layer, same pattern as data-centre-fit.ts and dedup-listings.ts: reads the
 * 3 dashboard data files, loads the VOA business-rates comparables table
 * (scripts/voa-rates-fetch.ts), looks up flood risk, computes each listing's
 * price/sqft-to-local-VOA-rate ratio, ranks that ratio's percentile across
 * every scoreable listing, then computes the final Value-Add score.
 *
 * IMPORTANT ordering note: the 3 base report scripts fully regenerate their
 * files, which wipes this enrichment — run this (and the other enrichment
 * scripts) again after any fresh base pull. Also run scripts/voa-rates-fetch.ts
 * first (or whenever the postcode districts in the dataset change) so the
 * comparables table is up to date.
 *
 *   node --import tsx scripts/value-add-listings.ts
 */

import { readFile, writeFile } from 'node:fs/promises';
import { scoreValueAdd, type ValueAddInput } from '../src/scoring/valueAdd.js';
import { estimateFloodRiskByPostcode } from '../src/geo/floodRisk.js';
import { extractPostcode } from '../src/geo/postcodes.js';

interface VoaComparablesData {
  districts: Record<string, { medianRatePerSqft: number; sampleCount: number }>;
  [key: string]: unknown;
}

interface DashboardRow {
  url: string;
  source: string;
  address: string;
  priceAmount?: number;
  sizeSqft?: number | null;
  powerStation?: { geocodePrecision?: string };
  dataCentreFit?: { score?: number };
  dedup?: { isDuplicate?: boolean };
  valueAdd?: unknown;
  [key: string]: unknown;
}

const FILES = ['dashboard/data/barnsdales.json', 'dashboard/data/rightmove.json', 'dashboard/data/discovered.json'];
const VOA_FILE = 'dashboard/data/voa-rates-comparables.json';

async function loadVoaComparables(): Promise<VoaComparablesData['districts']> {
  try {
    const data: VoaComparablesData = JSON.parse(await readFile(VOA_FILE, 'utf8'));
    return data.districts ?? {};
  } catch {
    console.warn(`VOA comparables file not found (${VOA_FILE}) — run scripts/voa-rates-fetch.ts first. Continuing with no benchmark data...`);
    return {};
  }
}

/** Percentile rank of `value` within `sorted` (ascending), as 0-100. */
function percentileRank(sorted: number[], value: number): number {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid]! < value) lo = mid + 1;
    else hi = mid;
  }
  return (lo / sorted.length) * 100;
}

async function main() {
  console.log('Loading VOA business-rates comparables...');
  const voaDistricts = await loadVoaComparables();
  console.log(`Loaded VOA benchmarks for ${Object.keys(voaDistricts).length} postcode districts`);

  const files: { path: string; data: { rows: DashboardRow[]; [k: string]: unknown } }[] = [];
  for (const path of FILES) {
    files.push({ path, data: JSON.parse(await readFile(path, 'utf8')) });
  }
  const allRows = files.flatMap((f) => f.data.rows);

  // Pass 1: compute each row's raw price/VOA-rate ratio where possible.
  const ratios = new Map<DashboardRow, number>();
  for (const row of allRows) {
    const postcode = extractPostcode(row.address ?? '');
    const district = postcode?.split(/\s+/)[0];
    const voa = district ? voaDistricts[district] : null;
    if (!voa || !row.priceAmount || !row.sizeSqft) continue;
    const pricePerSqft = row.priceAmount / row.sizeSqft;
    ratios.set(row, pricePerSqft / voa.medianRatePerSqft);
  }
  const sortedRatios = [...ratios.values()].sort((a, b) => a - b);
  console.log(`${sortedRatios.length} of ${allRows.length} rows have both a price/size and a VOA district benchmark — ranking those.`);

  // Pass 2: score every row, using the percentile rank computed above.
  let scoredCount = 0;
  let insufficientCount = 0;

  for (const row of allRows) {
    const postcode = extractPostcode(row.address ?? '');
    const district = postcode?.split(/\s+/)[0] ?? null;
    const voa = district ? voaDistricts[district] : null;
    const floodRisk = postcode ? estimateFloodRiskByPostcode(postcode) : { zone: null, reason: 'postcode unknown' };

    const ratio = ratios.get(row);
    const ratioPercentile = ratio !== undefined ? percentileRank(sortedRatios, ratio) : null;

    const input: ValueAddInput = {
      priceAmount: row.priceAmount ?? null,
      sizeSqft: row.sizeSqft ?? null,
      floodRiskZone: floodRisk.zone,
      localVoaRatePerSqft: voa?.medianRatePerSqft ?? null,
      voaSampleCount: voa?.sampleCount ?? 0,
      ratioPercentile,
    };

    const result = scoreValueAdd(input);

    row.valueAdd = {
      score: result.score,
      band: result.band,
      reasons: result.reasons,
      floodZone: floodRisk.zone,
      floodReason: floodRisk.reason,
    };

    if (result.band !== 'insufficient_data') scoredCount++;
    else insufficientCount++;
  }

  for (const { path, data } of files) {
    await writeFile(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }

  console.log(
    JSON.stringify(
      {
        totalRows: allRows.length,
        scored: scoredCount,
        insufficientData: insufficientCount,
        sample: allRows
          .filter((r) => r.valueAdd && (r.valueAdd as { band: string }).band !== 'insufficient_data')
          .sort((a, b) => (b.valueAdd as { score: number }).score - (a.valueAdd as { score: number }).score)
          .slice(0, 5)
          .map((r) => ({
            address: r.address,
            price: r.priceAmount,
            sizeSqft: r.sizeSqft,
            valueAddScore: (r.valueAdd as { score: number }).score,
            valueAddBand: (r.valueAdd as { band: string }).band,
            reasons: (r.valueAdd as { reasons: string[] }).reasons,
          })),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
