/**
 * Discovery batch for 11 candidate sources (2026-07-19), run through the
 * standard pipeline: discovery_queue -> classify -> sources (forced
 * pending_review) -> site_audits. Same safety invariant as every other
 * discovery run (src/discovery/requirementDiscovery.ts, classifyAndLogCandidate):
 * nothing is ever auto-activated from a discovery run — the `sources` insert
 * hardcodes status='pending_review' regardless of what the classifier decides.
 *
 *   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
 *     node --import tsx scripts/new-sources-discovery-2026-07-19.ts
 *
 * URLs verified live via web search 2026-07-19 (not guessed). Priority 1
 * (aggregator portals) and Priority 2 (CBRE/Savills/Knight Frank) get
 * additional policy handling in the classifier itself:
 *   - LoopNet UK / Zoopla Commercial / NovaLoca / Realla are registered
 *     portals (src/classifier/portals.ts) — always routed to review, and as
 *     of this batch the portal path now genuinely runs the live robots/ToS
 *     gate too (previously hardcoded tosFlag: false for portals).
 *   - CBRE / Savills / Knight Frank Commercial get a scale-based policy
 *     override (src/classifier/bigCorporates.ts) forcing mandatory review
 *     regardless of technical classification.
 *   - Any 403/429 or bot-challenge interstitial is logged as outcome
 *     'blocked' (src/classifier/detectors.ts detectBotChallenge), not
 *     misclassified as ordinary low-signal content.
 */

import { createPersistentHarness } from '../src/db/pglite.js';
import { classifyAndLogCandidate, type Candidate } from '../src/discovery/requirementDiscovery.js';

const CANDIDATES: (Candidate & { priority: 1 | 2 | 3; category: string })[] = [
  // Priority 1 — aggregator portals
  { priority: 1, category: 'aggregator portal', name: 'LoopNet UK', url: 'https://www.loopnet.co.uk/' },
  { priority: 1, category: 'aggregator portal', name: 'Zoopla Commercial', url: 'https://www.zoopla.co.uk/for-sale/commercial/' },
  { priority: 1, category: 'aggregator portal', name: 'NovaLoca', url: 'https://www.novaloca.com/' },
  // Priority 2 — peer regional/national agents
  { priority: 2, category: 'national agent', name: 'Knight Frank Commercial', url: 'https://www.knightfrank.co.uk/commercial' },
  { priority: 2, category: 'national agent', name: 'CBRE UK', url: 'https://www.cbre.co.uk/property-search' },
  { priority: 2, category: 'national agent', name: 'Savills UK', url: 'https://www.savills.co.uk/find-commercial-property/' },
  { priority: 2, category: 'national agent', name: 'Lambert Smith Hampton', url: 'https://www.lsh.co.uk/property-search' },
  { priority: 2, category: 'national agent', name: 'Avison Young', url: 'https://www.avisonyoung.co.uk/properties-for-sale' },
  { priority: 2, category: 'national agent', name: 'Eddisons', url: 'https://www.eddisons.com/property-search' },
  // Priority 3 — small/independent listing sites
  { priority: 3, category: 'independent listing site', name: 'Boxpod', url: 'https://www.boxpodcommercialproperty.co.uk/' },
  { priority: 3, category: 'independent listing site', name: 'Realla', url: 'https://www.realla.co.uk/sale/commercial-property' },
];

async function main() {
  const h = await createPersistentHarness();
  const results: Record<string, unknown>[] = [];

  for (const c of CANDIDATES) {
    process.stderr.write(`discovering [P${c.priority}] ${c.name} (${c.url}) ...\n`);
    const classified = await classifyAndLogCandidate(h, c, 'search_discovery');
    results.push({ ...c, ...classified });
    process.stderr.write(`  -> ${classified.outcome}${classified.classification ? ' / ' + classified.classification : ''}${classified.detail ? ' / ' + classified.detail : ''}\n`);
    await new Promise((r) => setTimeout(r, 1000));
  }

  const audits = await h.asAdminBypass<{ n: number }>(`select count(*)::int n from site_audits`);
  const active = await h.asAdminBypass<{ n: number }>(`select count(*)::int n from sources where status='active'`);
  console.log(JSON.stringify({ results, auditRowsLogged: audits.rows[0]!.n, sourcesSetActive: active.rows[0]!.n }, null, 2));
  await h.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
