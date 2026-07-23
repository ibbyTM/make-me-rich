/**
 * Fetch + precompute VOA (Valuation Office Agency) business rates comparables
 * (free, no auth, national bulk CSV) — replaces land-registry-fetch.ts, which
 * turned out to compare commercial listings against *residential* sold
 * prices (Land Registry Price Paid Data is residential-sales-only per
 * gov.uk's own guidance — confirmed 2026-07-22, see docs/value-add-2026-07-22.md).
 *
 * Downloads the national "summary valuations" file (~730MB uncompressed —
 * every non-domestic rateable property in England & Wales), streams it
 * line-by-line (never loaded fully into memory), filters down to only the
 * postcode districts actually present in the current dashboard data, and
 * writes a small per-district median-£/sqft reference table. The 730MB
 * national file is cached under .cache/voa/ (gitignored) and re-downloaded
 * only if missing — never committed.
 *
 *   node --import tsx scripts/voa-rates-fetch.ts
 *
 * Output: dashboard/data/voa-rates-comparables.json
 * Format: { district -> { medianRatePerSqft, sampleCount } }
 */

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { extractPostcode } from '../src/geo/postcodes.js';
import { parseVoaSummaryLine, ratePerSqft, median } from '../src/geo/voaRates.js';

const CACHE_DIR = '.cache/voa';
const CSV_PATH = `${CACHE_DIR}/summary-valuations.csv`;
const DOWNLOAD_URL =
  'https://voaratinglists.blob.core.windows.net/downloads/uk-englandwales-ndr-2026-summaryvaluations-compiled-epoch-0002-baseline-csv.zip';

const DASHBOARD_FILES = ['dashboard/data/barnsdales.json', 'dashboard/data/rightmove.json', 'dashboard/data/discovered.json'];
const OUTPUT_PATH = 'dashboard/data/voa-rates-comparables.json';

const MIN_SAMPLES_PER_DISTRICT = 10;

async function districtsInDashboard(): Promise<Set<string>> {
  const districts = new Set<string>();
  for (const filePath of DASHBOARD_FILES) {
    try {
      const data = JSON.parse(await readFile(filePath, 'utf8'));
      for (const row of data.rows ?? []) {
        const postcode = extractPostcode(row.address ?? '');
        if (postcode) districts.add(postcode.split(/\s+/)[0]!);
      }
    } catch {
      // file missing/unparseable — skip, same tolerance as the other enrichment scripts
    }
  }
  return districts;
}

async function ensureCsvDownloaded(): Promise<void> {
  try {
    const s = await stat(CSV_PATH);
    if (s.size > 0) {
      console.log(`Using cached ${CSV_PATH} (${(s.size / 1e6).toFixed(0)}MB) — delete it to force a re-download.`);
      return;
    }
  } catch {
    // not cached, fall through to download
  }

  await mkdir(CACHE_DIR, { recursive: true });
  console.log('Downloading VOA summary valuations (national file, ~90MB compressed)...');
  const res = await fetch(DOWNLOAD_URL);
  if (!res.ok || !res.body) throw new Error(`VOA download failed: HTTP ${res.status}`);

  // The download is a zip containing one large CSV. We only have a raw fetch
  // stream here, so shell out to `unzip -p` piped from a temp zip file rather
  // than pull in a zip-parsing dependency for a one-off script.
  const zipPath = `${CACHE_DIR}/summary-valuations.zip`;
  const fileStream = createWriteStream(zipPath);
  await finished(Readable.fromWeb(res.body as any).pipe(fileStream));

  const { execFileSync } = await import('node:child_process');
  console.log('Extracting...');
  execFileSync('unzip', ['-o', zipPath, '-d', CACHE_DIR]);

  // The zip contains one file matching this pattern; find and rename it.
  const { readdir, rename, rm } = await import('node:fs/promises');
  const entries = await readdir(CACHE_DIR);
  const extracted = entries.find((f) => f.endsWith('.csv') && f.includes('summaryvaluations'));
  if (!extracted) throw new Error('Extracted VOA zip did not contain the expected summary valuations CSV');
  await rename(`${CACHE_DIR}/${extracted}`, CSV_PATH);
  await rm(zipPath);
}

async function main() {
  const districts = await districtsInDashboard();
  console.log(`Found ${districts.size} postcode districts in current dashboard data: ${[...districts].sort().join(', ')}`);

  if (districts.size === 0) {
    console.warn('No postcode districts found in dashboard data — nothing to compute comparables for.');
    await writeFile(OUTPUT_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), dataSource: 'VOA business rates (free, no auth)', districts: {} }, null, 2) + '\n', 'utf8');
    return;
  }

  await ensureCsvDownloaded();

  console.log('Streaming and filtering national VOA file...');
  const ratesByDistrict = new Map<string, number[]>();
  let scanned = 0;
  let matched = 0;

  const rl = createInterface({ input: createReadStream(CSV_PATH), crlfDelay: Infinity });
  for await (const line of rl) {
    const entry = parseVoaSummaryLine(line);
    if (!entry) continue;
    scanned++;
    const district = entry.postcode.split(/\s+/)[0]!;
    if (!districts.has(district)) continue;
    const rate = ratePerSqft(entry);
    if (rate === null) continue;
    matched++;
    if (!ratesByDistrict.has(district)) ratesByDistrict.set(district, []);
    ratesByDistrict.get(district)!.push(rate);
  }

  const output: Record<string, { medianRatePerSqft: number; sampleCount: number }> = {};
  for (const [district, rates] of ratesByDistrict) {
    if (rates.length < MIN_SAMPLES_PER_DISTRICT) continue;
    output[district] = { medianRatePerSqft: Number(median(rates).toFixed(2)), sampleCount: rates.length };
  }

  await writeFile(
    OUTPUT_PATH,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), dataSource: 'VOA business rates compiled list (free, no auth)', districts: output },
      null,
      2,
    ) + '\n',
    'utf8',
  );

  console.log(
    JSON.stringify(
      {
        status: 'success',
        recordsScanned: scanned,
        recordsMatchedToOurDistricts: matched,
        districtsWithEnoughSamples: Object.keys(output).length,
        outputPath: OUTPUT_PATH,
        sample: output,
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
