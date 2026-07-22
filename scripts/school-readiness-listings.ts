/**
 * School-readiness scoring (2026-07-22) — read-only enrichment layer, same
 * pattern as dedup-listings.ts/data-centre-fit.ts/value-add-listings.ts:
 * reads the 3 dashboard data files, scores each row's `marketingText`
 * against src/scoring/schoolReadiness.ts, and writes the `schoolReadiness`
 * field back onto each row in place — nothing deleted.
 *
 * IMPORTANT ordering note, same as the others: the 3 base report scripts
 * fully regenerate their files (and are what actually populate
 * `marketingText` in the first place — this script only reads it), which
 * wipes this enrichment too — run this again after any fresh base pull.
 *
 *   node --import tsx scripts/school-readiness-listings.ts
 */

import { readFile, writeFile } from 'node:fs/promises';
import { scoreSchoolReadiness } from '../src/scoring/schoolReadiness.js';

interface DashboardRow {
  address: string;
  marketingText?: string | null;
  schoolReadiness?: unknown;
  [key: string]: unknown;
}

const FILES = ['dashboard/data/barnsdales.json', 'dashboard/data/rightmove.json', 'dashboard/data/discovered.json'];

async function main() {
  const files: { path: string; data: { rows: DashboardRow[]; [k: string]: unknown } }[] = [];
  for (const path of FILES) {
    files.push({ path, data: JSON.parse(await readFile(path, 'utf8')) });
  }
  const allRows = files.flatMap((f) => f.data.rows);

  const bandCounts: Record<string, number> = {};
  for (const row of allRows) {
    const result = scoreSchoolReadiness(row.marketingText ?? null);
    row.schoolReadiness = { score: result.score, band: result.band, reasons: result.reasons };
    bandCounts[result.band] = (bandCounts[result.band] ?? 0) + 1;
  }

  for (const { path, data } of files) {
    await writeFile(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }

  console.log(
    JSON.stringify(
      {
        totalRows: allRows.length,
        bandCounts,
        sample: allRows
          .filter((r) => (r.schoolReadiness as { band: string }).band === 'ready')
          .slice(0, 5)
          .map((r) => ({ address: r.address, ...(r.schoolReadiness as object) })),
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
