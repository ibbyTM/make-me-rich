/**
 * Live Barnsdales pull + Stage-0 filter report (read-only).
 *
 *   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
 *     npx tsx scripts/barnsdales-report.ts
 *
 * 1. Scrapes the live Barnsdales listings page (commercial freehold set).
 * 2. Runs the existing Stage-0 fixed-criteria filter against the two seed
 *    requirements.
 * 3. Writes a markdown report of every property that passed.
 *
 * Nothing is written back to Barnsdales or any external system.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import {
  fetchBarnsdalesListings,
  type BarnsdalesListing,
} from '../src/scrapers/barnsdales.js';
import { stageZeroFilter } from '../src/filter/stageZero.js';
import { config } from '../src/config.js';
import { createPersistentHarness } from '../src/db/pglite.js';
import { ensureSeeded, listActiveRequirements } from '../src/db/requirementsRepo.js';
import type { Listing } from '../src/types.js';

// --- Requirements Register (spec §6) ---------------------------------------
// Read live from the persistent store (src/db/pglite.ts) rather than a
// hardcoded list: any requirement created via the dashboard's "New search"
// panel — not just the two seeds — participates in this scoring run with no
// code change. Citywide's geographies are whole regions; the listings carry
// town + postcode, so we resolve each listing's postcode area to a region
// (below) and match on that. Custom requirements can use either style —
// region resolution below covers Yorkshire/Greater Manchester specifically,
// everything else matches on town/geography text directly (same as
// Educating's named-town geographies always have).

// --- Region resolution (town/postcode → the regions the requirements name) --
const YORKSHIRE_AREAS = new Set(['BD', 'DN', 'HD', 'HG', 'HU', 'HX', 'LS', 'S', 'WF', 'YO']);
const GTR_MANCHESTER_AREAS = new Set(['M', 'BL', 'OL', 'SK', 'WN']);

function postcodeArea(pc: string): string {
  const m = /^([A-Za-z]{1,2})/.exec(pc.trim());
  return m ? m[1]!.toUpperCase() : '';
}
function region(pc: string): string {
  const a = postcodeArea(pc);
  if (YORKSHIRE_AREAS.has(a)) return 'Yorkshire';
  if (GTR_MANCHESTER_AREAS.has(a)) return 'Greater Manchester';
  return '';
}

/** Map a Barnsdales listing into the Stage-0 filter's Listing shape. */
function toStageListing(l: BarnsdalesListing): Listing {
  return {
    sourceId: 'barnsdales',
    externalId: String(l.id),
    geography: `${l.location} ${region(l.postcode)}`.trim(),
    size: l.sizeSqft ?? undefined,
    price: l.priceFrom,
    text: [l.sizeLabel, ...l.categories, l.priceDisplay].join(' '),
  };
}

function gbp(n: number): string {
  return '£' + n.toLocaleString('en-GB');
}

async function main() {
  const h = await createPersistentHarness();
  await ensureSeeded(h);
  const requirements = await listActiveRequirements(h);
  await h.close();
  const reqById = Object.fromEntries(requirements.map((r) => [r.id, r]));

  const pull = await fetchBarnsdalesListings();
  const bar = config.stageZeroMinimumBar;

  const scored = pull.listings.map((l) => ({
    l,
    result: stageZeroFilter(toStageListing(l), requirements, { minimumBar: bar }),
  }));
  const passed = scored.filter((s) => s.result.pass);
  const failed = scored.filter((s) => !s.result.pass);

  const now = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];
  lines.push('# Barnsdales — live commercial-freehold pull + Stage-0 filter');
  lines.push('');
  lines.push(`**Date:** ${now} · **Source:** ${'https://www.barnsdales.co.uk/properties'} · **Mode:** read-only live pull`);
  lines.push('');
  lines.push(
    `Scraped **${pull.totalOnPage}** properties from the embedded \`var properties\` array; ` +
      `**${pull.listings.length}** passed the documented commercial-freehold filter ` +
      `(\`freehold_from\` not null, \`residential === false\`, status Available / Coming Soon). ` +
      `Stage-0 (minimum bar **${bar}** of 4) then passed **${passed.length}**.`,
  );
  lines.push('');
  lines.push('> Region matching: Citywide\'s requirement is written as regions (Yorkshire / Greater Manchester), so each listing\'s postcode area is resolved to a region before matching (e.g. `DN`, `WF` → Yorkshire). Educating\'s named towns are matched by town name.');
  lines.push('');

  lines.push('## Passed the filter');
  lines.push('');
  if (passed.length === 0) {
    lines.push('_No listings passed Stage-0._');
  } else {
    for (const { l, result } of passed) {
      const req = reqById[result.matchedRequirementId ?? '']?.name ?? '(unknown)';
      lines.push(`### ${l.location}, ${l.postcode} — ${l.priceDisplay}`);
      lines.push('');
      lines.push(`- **Address:** ${l.location} (${l.postcode})`);
      lines.push(`- **Price:** ${l.priceDisplay} _(guide ${gbp(l.priceFrom)})_`);
      lines.push(`- **Size:** ${l.sizeLabel || 'n/a'}${l.sizeSqft ? ` (${l.sizeSqft.toLocaleString('en-GB')} sq ft)` : ''}`);
      lines.push(`- **Categories:** ${l.categories.join(', ') || 'n/a'}`);
      lines.push(`- **Matched requirement:** ${req} (score ${result.score}/${bar}+)`);
      lines.push(`- **Why:** ${result.reasons.join('; ')}`);
      lines.push('');
    }
  }

  lines.push('## Scraped but did not pass Stage-0');
  lines.push('');
  if (failed.length === 0) {
    lines.push('_All scraped listings passed._');
  } else {
    lines.push('| Address | Price (guide) | Size | Best score | Why not |');
    lines.push('|---|---|---|---|---|');
    for (const { l, result } of failed) {
      const why = result.reasons.join('; ') || 'no criteria matched';
      lines.push(
        `| ${l.location}, ${l.postcode} | ${gbp(l.priceFrom)} | ${l.sizeLabel || 'n/a'} | ${result.score}/${bar} | ${why} |`,
      );
    }
  }
  lines.push('');

  const md = lines.join('\n');
  const outPath = `docs/barnsdales-pull-${now}.md`;
  await writeFile(outPath, md + '\n', 'utf8');

  // Structured output for the read-only dashboard (dashboard/index.html):
  // the same passed rows the markdown lists, in their native shape.
  await mkdir('dashboard/data', { recursive: true });
  await writeFile(
    'dashboard/data/barnsdales.json',
    JSON.stringify(
      {
        source: 'Barnsdales',
        generatedAt: new Date().toISOString(),
        rows: passed.map(({ l, result }) => ({
          address: `${l.location}, ${l.postcode}`,
          priceDisplay: l.priceDisplay,
          priceAmount: l.priceFrom,
          sizeLabel: l.sizeLabel,
          sizeSqft: l.sizeSqft,
          source: 'Barnsdales',
          requirement: reqById[result.matchedRequirementId ?? '']?.name ?? '(unknown)',
          score: result.score,
          reasons: result.reasons,
          url: l.url,
        })),
      },
      null,
      2,
    ) + '\n',
    'utf8',
  );

  // machine-readable summary to stderr for verification
  process.stderr.write(
    JSON.stringify(
      {
        totalOnPage: pull.totalOnPage,
        commercialFreehold: pull.listings.length,
        passedStageZero: passed.length,
        outPath,
        passed: passed.map((p) => ({
          id: p.l.id,
          loc: p.l.location,
          price: p.l.priceFrom,
          matched: p.result.matchedRequirementId,
          score: p.result.score,
        })),
      },
      null,
      2,
    ) + '\n',
  );

  process.stdout.write(md + '\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
