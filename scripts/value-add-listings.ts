/**
 * Value-Add scoring (2026-07-22) — read-only enrichment layer, same pattern
 * as data-centre-fit.ts and dedup-listings.ts: reads the 3 dashboard data files,
 * loads Land Registry comparables, looks up flood risk, computes Value-Add score
 * for each row, and writes each row's `valueAdd` field back in place.
 *
 * IMPORTANT ordering note: the 3 base report scripts fully regenerate their files,
 * which wipes this enrichment — run this (and the other enrichment scripts) again
 * after any fresh base pull.
 *
 *   node --import tsx scripts/value-add-listings.ts
 */

import { readFile, writeFile } from 'node:fs/promises';
import { scoreValueAdd, type ValueAddInput } from '../src/scoring/valueAdd.js';
import { estimateFloodRiskByPostcode } from '../src/geo/floodRisk.js';

interface ComparablesData {
  postcodes: Record<string, { medianPrice: number; sampleCount: number }>;
  [key: string]: unknown;
}

interface DashboardRow {
  url: string;
  source: string;
  address: string;
  postcode?: string;
  priceAmount?: number;
  sizeSqft?: number | null;
  powerStation?: { geocodePrecision?: string };
  dataCentreFit?: { score?: number };
  dedup?: { isDuplicate?: boolean };
  valueAdd?: unknown;
  [key: string]: unknown;
}

const FILES = ['dashboard/data/barnsdales.json', 'dashboard/data/rightmove.json', 'dashboard/data/discovered.json'];
const COMPARABLES_FILE = 'dashboard/data/land-registry-comparables.json';

async function loadComparables(): Promise<ComparablesData | null> {
  try {
    return JSON.parse(await readFile(COMPARABLES_FILE, 'utf8'));
  } catch {
    console.warn(`Comparables file not found (${COMPARABLES_FILE}), continuing with unknown prices...`);
    return null;
  }
}

async function main() {
  console.log('Loading Land Registry comparables...');
  const comparablesData = await loadComparables();
  const comparables = comparablesData?.postcodes ?? {};

  console.log(`Loaded comparables for ${Object.keys(comparables).length} postcodes`);

  const files: { path: string; data: { rows: DashboardRow[]; [k: string]: unknown } }[] = [];
  for (const path of FILES) {
    files.push({ path, data: JSON.parse(await readFile(path, 'utf8')) });
  }

  const allRows = files.flatMap((f) => f.data.rows);
  let scoredCount = 0;
  let skippedCount = 0;

  for (const row of allRows) {
    const postcode = row.postcode?.toUpperCase() ?? null;
    const comparableData = postcode ? comparables[postcode] : null;

    const floodRisk = postcode ? estimateFloodRiskByPostcode(postcode) : { zone: null, reason: 'postcode unknown' };

    const input: ValueAddInput = {
      priceAmount: row.priceAmount ?? null,
      postcode,
      floodRiskZone: floodRisk.zone,
      postcodeMedianPrice: comparableData?.medianPrice ?? null,
      comparableSampleCount: comparableData?.sampleCount ?? 0,
    };

    const result = scoreValueAdd(input);

    row.valueAdd = {
      score: result.score,
      band: result.band,
      reasons: result.reasons,
      floodZone: floodRisk.zone,
      floodReason: floodRisk.reason,
    };

    if (result.band !== 'insufficient_data') {
      scoredCount++;
    } else {
      skippedCount++;
    }
  }

  for (const { path, data } of files) {
    await writeFile(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }

  console.log(
    JSON.stringify(
      {
        totalRows: allRows.length,
        scored: scoredCount,
        insufficientData: skippedCount,
        sample: allRows
          .filter((r) => r.valueAdd && (r.valueAdd as { band: string }).band !== 'insufficient_data')
          .slice(0, 3)
          .map((r) => ({
            address: r.address,
            price: r.priceAmount,
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
