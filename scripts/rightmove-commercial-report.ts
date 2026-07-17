/**
 * Live Rightmove Commercial pull + Stage-0 filter report (read-only).
 *
 *   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
 *     npx tsx scripts/rightmove-commercial-report.ts
 *
 * Pulls commercial for-sale search results for the Citywide cities, runs the
 * existing Stage-0 filter against both seed requirements, and writes a
 * markdown report (same format as the Barnsdales one) including agent counts —
 * portal coverage across many agents at once being the point of a portal pull.
 *
 * Read-only: fetches public search pages only (robots-permitted path), capped
 * pages per city, delayed between requests. Nothing written to any external
 * system.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import {
  CITYWIDE_CITIES,
  fetchCityListings,
  isGoingConcern,
  type CityPull,
  type RightmoveListing,
} from '../src/scrapers/rightmoveCommercial.js';
import { stageZeroFilter } from '../src/filter/stageZero.js';
import { config } from '../src/config.js';
import { SEED_REQUIREMENTS, CITYWIDE, EDUCATING } from '../src/requirements/seeds.js';
import type { Listing } from '../src/types.js';

const REQ_NAME: Record<string, string> = {
  [CITYWIDE.id]: CITYWIDE.name,
  [EDUCATING.id]: EDUCATING.name,
};

function toStageListing(l: RightmoveListing): Listing {
  return {
    sourceId: 'rightmove_commercial',
    externalId: l.id,
    geography: `${l.city} ${l.region}`,
    size: l.sizeSqft ?? undefined,
    // POA/unspecified prices are 0 — leave undefined so budget isn't scored on garbage.
    price: l.priceAmount > 0 ? l.priceAmount : undefined,
    text: [l.address, l.subType, l.sizeLabel, l.text].join(' '),
  };
}

function gbp(n: number): string {
  return '£' + n.toLocaleString('en-GB');
}

async function main() {
  const pulls: CityPull[] = [];
  for (const target of CITYWIDE_CITIES) {
    process.stderr.write(`pulling ${target.city} (REGION^${target.locationId}) ...\n`);
    pulls.push(await fetchCityListings(target));
  }

  // Cross-city dedupe (regions overlap; featured listings recur).
  const byId = new Map<string, RightmoveListing>();
  for (const pull of pulls) {
    for (const l of pull.listings) if (!byId.has(l.id)) byId.set(l.id, l);
  }
  const listings = [...byId.values()];

  // Subtype filter: drop business-for-sale going concerns (cafés, salons,
  // licensed trade, ...) before scoring — they aren't commercial-investment
  // stock and their "freehold" marketing text distorts the keyword criterion.
  const goingConcerns = listings.filter(isGoingConcern);
  const investable = listings.filter((l) => !isGoingConcern(l));
  const excludedBySubtype = new Map<string, number>();
  for (const l of goingConcerns) {
    excludedBySubtype.set(l.subType, (excludedBySubtype.get(l.subType) ?? 0) + 1);
  }

  const bar = config.stageZeroMinimumBar;
  // geoPrescoped: the searches were geo-scoped at query time, so geography is
  // a precondition rather than a scored point (no free point toward the bar).
  const scored = investable.map((l) => ({
    l,
    result: stageZeroFilter(toStageListing(l), SEED_REQUIREMENTS, {
      minimumBar: bar,
      geoPrescoped: true,
    }),
  }));
  const passed = scored.filter((s) => s.result.pass);
  const failed = scored.filter((s) => !s.result.pass);

  // Agent coverage — the point of a portal source.
  const agentCounts = new Map<string, number>();
  for (const l of listings) agentCounts.set(l.agent, (agentCounts.get(l.agent) ?? 0) + 1);
  const agentsRanked = [...agentCounts.entries()].sort((a, b) => b[1] - a[1]);
  const passedAgents = new Set(passed.map((s) => s.l.agent));

  const now = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];
  lines.push('# Rightmove Commercial — live for-sale pull + Stage-0 filter');
  lines.push('');
  lines.push(`**Date:** ${now} · **Source:** rightmove.co.uk commercial-property-for-sale (search pages, \`__NEXT_DATA__\` plain JSON) · **Mode:** read-only live pull`);
  lines.push('');
  const totalAvailable = pulls.reduce((s, p) => s + p.resultCount, 0);
  const totalFetched = pulls.reduce((s, p) => s + p.listings.length, 0);
  lines.push(
    `Searched **${pulls.length} cities** (Citywide footprint: Yorkshire + Greater Manchester). ` +
      `Portal reports **${totalAvailable}** matching results across those searches; fetched a capped ` +
      `**${totalFetched}** (max 5 pages/city, 1.5 s between requests), **${listings.length}** after cross-city dedupe. ` +
      `**${goingConcerns.length}** business-for-sale going concerns excluded by subtype, leaving **${investable.length}** ` +
      `investable listings. Stage-0 (minimum bar **${bar}**, geography excluded from scoring — see below) passed **${passed.length}**.`,
  );
  lines.push('');
  lines.push('## Corrections applied in this run (vs the first 2026-07-14 pull)');
  lines.push('');
  lines.push(
    'The first pull passed **335 of 554 (60%)** — inflated, because the searches were already geo-scoped, ' +
      'so every listing collected the geography point for free and the effective bar collapsed to a single ' +
      'keyword hit (all 219 failures scored exactly 1, geography-only). Two fixes applied for this run:',
  );
  lines.push('');
  lines.push(
    '1. **Portal-aware Stage-0 (`geoPrescoped`)** — geography earns no point on a geo-scoped pull; it acts as a ' +
      "precondition instead (a listing outside a requirement's territory cannot match that requirement at all). " +
      `The ${bar}-point bar now applies to price/size/keywords only.`,
  );
  lines.push(
    '2. **Going-concern subtype filter** — business-for-sale listings (cafés, restaurants, takeaways, salons, ' +
      'convenience stores, guest houses/B&Bs, ...) are excluded before scoring. Premises and development stock ' +
      '(offices, industrial, retail property, mixed use, commercial/residential development, land) are kept — ' +
      '**as are pubs, bars/nightclubs and hotels** (decision 2026-07-14: at Citywide\'s price band a large freehold ' +
      'pub/hotel is genuine C2R conversion stock, and the price+keyword bar filters small trading businesses anyway).',
  );
  lines.push('');
  if (excludedBySubtype.size > 0) {
    lines.push('Excluded by subtype:');
    lines.push('');
    lines.push('| Subtype | Excluded |');
    lines.push('|---|---|');
    for (const [st, n] of [...excludedBySubtype.entries()].sort((a, b) => b[1] - a[1])) {
      lines.push(`| ${st || '(blank)'} | ${n} |`);
    }
    lines.push('');
  }
  lines.push('| City | Region | Portal results | Fetched (deduped) |');
  lines.push('|---|---|---|---|');
  for (const p of pulls) lines.push(`| ${p.city} | ${p.region} | ${p.resultCount} | ${p.listings.length} |`);
  lines.push('');
  lines.push('> robots.txt (checked at pull time) does **not** disallow the commercial `find.html` search path (only contact/map/photo/full-description paths). Portal ToS may still restrict automated collection — in the CAIS pipeline Rightmove remains a route-to-review portal source (spec §4/§5); this was an explicit low-volume read-only pull.');
  lines.push('');

  lines.push('## Agent coverage');
  lines.push('');
  lines.push(
    `**${agentCounts.size} distinct agents/branches** appear in the ${listings.length} fetched listings ` +
      `(counted before the subtype filter — coverage is a property of the portal, not of our filtering) — ` +
      `vs one agent per bespoke source. ${passedAgents.size} distinct agents appear in the Stage-0-passed set.`,
  );
  lines.push('');
  lines.push('Top agents by listing count:');
  lines.push('');
  lines.push('| Agent / branch | Listings |');
  lines.push('|---|---|');
  for (const [agent, n] of agentsRanked.slice(0, 15)) lines.push(`| ${agent} | ${n} |`);
  lines.push('');

  lines.push('## Passed the filter');
  lines.push('');
  if (passed.length === 0) {
    lines.push('_No listings passed Stage-0._');
  } else {
    for (const { l, result } of passed.sort((a, b) => b.result.score - a.result.score)) {
      const req = REQ_NAME[result.matchedRequirementId ?? ''] ?? '(unknown)';
      lines.push(`### ${l.address} — ${l.priceDisplay}`);
      lines.push('');
      lines.push(`- **Address:** ${l.address} (${l.city}, ${l.region})`);
      lines.push(`- **Price:** ${l.priceDisplay}${l.priceAmount > 0 ? ` _(${gbp(l.priceAmount)})_` : ''}${l.auction ? ' · auction' : ''}`);
      lines.push(`- **Size:** ${l.sizeLabel || 'n/a'}${l.sizeSqft ? ` (${l.sizeSqft.toLocaleString('en-GB')} sq ft)` : ''}`);
      lines.push(`- **Type:** ${l.subType || 'n/a'}${l.tenure ? ` · ${l.tenure}` : ''}`);
      lines.push(`- **Agent:** ${l.agent}`);
      lines.push(`- **Matched requirement:** ${req} (score ${result.score}/${bar}+)`);
      lines.push(`- **Why:** ${result.reasons.join('; ')}`);
      if (l.url) lines.push(`- **Listing:** ${l.url}`);
      lines.push('');
    }
  }

  lines.push('## Scraped but did not pass Stage-0');
  lines.push('');
  lines.push(
    `${failed.length} investable listings scored below the bar (geography not scored — ` +
      'these counts reflect price/size/keyword signals only).',
  );
  lines.push('');
  const scoreDist = new Map<number, number>();
  for (const s of failed) scoreDist.set(s.result.score, (scoreDist.get(s.result.score) ?? 0) + 1);
  lines.push('| Best score | Listings | Typical shortfall |');
  lines.push('|---|---|---|');
  const typical: Record<number, string> = {
    0: 'no non-geo signal at all (POA price, no size given, no keyword hit)',
    1: 'one signal only — e.g. keyword but price outside budget / size unknown',
  };
  for (const [score, n] of [...scoreDist.entries()].sort((a, b) => a[0] - b[0])) {
    lines.push(`| ${score}/${bar} | ${n} | ${typical[score] ?? ''} |`);
  }
  lines.push('');

  const md = lines.join('\n');
  const outPath = `docs/rightmove-commercial-pull-${now}.md`;
  await writeFile(outPath, md + '\n', 'utf8');

  // Structured output for the read-only dashboard (dashboard/index.html).
  await mkdir('dashboard/data', { recursive: true });
  await writeFile(
    'dashboard/data/rightmove.json',
    JSON.stringify(
      {
        source: 'Rightmove Commercial',
        generatedAt: new Date().toISOString(),
        rows: passed.map(({ l, result }) => ({
          address: `${l.address} (${l.city})`,
          priceDisplay: l.priceDisplay,
          priceAmount: l.priceAmount,
          sizeLabel: l.sizeLabel,
          sizeSqft: l.sizeSqft,
          source: 'Rightmove Commercial',
          requirement: REQ_NAME[result.matchedRequirementId ?? ''] ?? '(unknown)',
          score: result.score,
          reasons: result.reasons,
          url: l.url,
          agent: l.agent,
        })),
      },
      null,
      2,
    ) + '\n',
    'utf8',
  );

  process.stderr.write(
    JSON.stringify(
      {
        cities: pulls.map((p) => ({ city: p.city, portal: p.resultCount, fetched: p.listings.length })),
        deduped: listings.length,
        goingConcernsExcluded: goingConcerns.length,
        investable: investable.length,
        passedStageZero: passed.length,
        distinctAgents: agentCounts.size,
        agentsInPassedSet: passedAgents.size,
        outPath,
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
