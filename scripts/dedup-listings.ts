/**
 * Cross-source/within-source duplicate detection (2026-07-21) — read-only
 * enrichment, same pattern as data-centre-fit.ts: reads the 3 existing
 * dashboard/data/*.json files, finds duplicate groups via
 * src/dedup/listings.ts, and writes each row's `dedup` field back in place —
 * nothing is deleted, every row stays in the file, the dashboard decides
 * whether to hide non-canonical duplicates by default.
 *
 * IMPORTANT ordering note, same as data-centre-fit.ts/rightmove-detail-
 * geocode.ts: the 3 base report scripts fully regenerate their files, which
 * wipes this enrichment too — run this (and the other two enrichment
 * scripts) again after any fresh base pull.
 *
 *   node --import tsx scripts/dedup-listings.ts
 */

import { readFile, writeFile } from 'node:fs/promises';
import { findDuplicateGroups, type DedupCandidate } from '../src/dedup/listings.js';

interface DashboardRow {
  url: string;
  source: string;
  address: string;
  priceAmount?: number;
  sizeSqft?: number | null;
  powerStation?: { geocodePrecision?: string };
  dedup?: unknown;
  [key: string]: unknown;
}

const FILES = ['dashboard/data/barnsdales.json', 'dashboard/data/rightmove.json', 'dashboard/data/discovered.json'];

async function main() {
  const files: { path: string; data: { rows: DashboardRow[]; [k: string]: unknown } }[] = [];
  for (const path of FILES) {
    files.push({ path, data: JSON.parse(await readFile(path, 'utf8')) });
  }

  const allRows = files.flatMap((f) => f.data.rows);
  const byUrl = new Map(allRows.map((r) => [r.url, r]));

  const candidates: DedupCandidate[] = allRows.map((r) => ({
    key: r.url,
    source: r.source,
    address: r.address,
    priceAmount: r.priceAmount ?? 0,
    sizeSqft: r.sizeSqft ?? null,
    geocodePrecision: r.powerStation?.geocodePrecision ?? null,
  }));

  const groups = findDuplicateGroups(candidates);

  // Reset every row first (idempotent re-runs), then apply groups.
  for (const row of allRows) row.dedup = { isDuplicate: false, duplicateCount: 0, groupId: null };
  for (const group of groups) {
    for (const key of group.memberKeys) {
      const row = byUrl.get(key)!;
      row.dedup = {
        isDuplicate: key !== group.canonicalKey,
        canonicalUrl: group.canonicalKey,
        duplicateCount: group.memberKeys.length - 1,
        groupId: group.groupId,
        reason: group.reason,
      };
    }
  }

  for (const { path, data } of files) {
    await writeFile(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }

  console.log(
    JSON.stringify(
      {
        totalRows: allRows.length,
        duplicateGroups: groups.length,
        rowsMarkedDuplicate: allRows.filter((r) => (r.dedup as { isDuplicate: boolean }).isDuplicate).length,
        groups: groups.map((g) => ({
          canonical: byUrl.get(g.canonicalKey)!.address,
          memberCount: g.memberKeys.length,
          sources: g.memberKeys.map((k) => byUrl.get(k)!.source),
          reason: g.reason,
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
