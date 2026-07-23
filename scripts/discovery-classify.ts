/**
 * Search-based discovery batch (read-only): classify ~20 independent/regional
 * commercial agents found via web search across Citywide's core cities.
 *
 *   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
 *     npx tsx scripts/discovery-classify.ts
 *
 * This is the original fixed-batch discovery run (2026-07-17): a hand-curated
 * list of real agents, kept as-is for reproducibility. For discovery driven by
 * an arbitrary Requirements Register entry's geography + keywords instead of
 * this hardcoded list, see scripts/requirement-discovery.ts, which shares the
 * same classify-and-log core (src/discovery/requirementDiscovery.ts).
 *
 * Uses the persistent store (src/db/pglite.ts) so this batch's discovery_queue
 * / sources / site_audits rows are visible alongside every other discovery run
 * — same one Requirements/Sources Register throughout the app. Re-running is
 * still safe: the sources upsert is keyed on url (on conflict do update).
 *
 * Emits JSON results to stdout for the follow-up scraper-building step.
 */

import { createPersistentHarness } from '../src/db/pglite.js';
import { classifyAndLogCandidate, type Candidate } from '../src/discovery/requirementDiscovery.js';

/** Discovered via web search 2026-07-17 (independent/regional; nationals excluded). */
const CANDIDATES: (Candidate & { city: string })[] = [
  { name: 'PPH Commercial', city: 'Hull', url: 'https://pph-commercial.co.uk' },
  { name: 'Barker Property', city: 'Hull/Leeds', url: 'https://www.barkerproperty.uk' },
  { name: 'Leonards', city: 'Hull', url: 'https://www.leonards-property.co.uk' },
  { name: 'Dacres Commercial', city: 'Leeds', url: 'https://www.dacres.co.uk' },
  { name: 'WSB Property Consultants', city: 'Leeds', url: 'https://www.wsbproperty.co.uk' },
  { name: 'Carter Towler', city: 'Leeds', url: 'https://www.cartertowler.co.uk' },
  { name: 'Naylors Gavin Black', city: 'Newcastle', url: 'https://www.naylorsgavinblack.co.uk' },
  { name: 'Bradley Hall', city: 'Newcastle', url: 'https://www.bradleyhall.co.uk' },
  { name: 'Roy Backhouse', city: 'Liverpool', url: 'https://roybackhouse.com' },
  { name: 'Frobishers', city: 'Liverpool', url: 'https://www.frobishersuk.com' },
  { name: 'Gifford Dixon', city: 'Manchester', url: 'https://gifforddixoncommercialproperty.co.uk' },
  { name: 'Roberts & Roberts', city: 'Manchester', url: 'https://robertsandroberts.co.uk' },
  { name: "Canning O'Neill", city: 'Manchester', url: 'https://www.canningoneill.co.uk' },
  { name: 'Roger Hannah', city: 'Manchester', url: 'https://www.roger-hannah.co.uk' },
  { name: 'Innes England', city: 'Derby/Leicester/Birmingham', url: 'https://innes-england.com' },
  { name: 'Raybould & Sons', city: 'Derby', url: 'https://www.raybouldandsons.co.uk' },
  { name: 'Taylor Weaver', city: 'Blackburn', url: 'https://www.taylorweaver.co.uk' },
  { name: 'Cardwells', city: 'Blackburn/Bolton', url: 'https://www.cardwells.co.uk' },
  { name: 'Shepherd Commercial', city: 'Birmingham', url: 'https://shepcom.com' },
  { name: 'Harris Lamb', city: 'Birmingham', url: 'https://www.harrislamb.com' },
  { name: 'SMC Brownill Vickers', city: 'Sheffield', url: 'https://smcbrownillvickers.com' },
];

async function main() {
  const h = await createPersistentHarness();
  const results: Record<string, unknown>[] = [];

  for (const c of CANDIDATES) {
    process.stderr.write(`discovering ${c.name} (${c.url}) ...\n`);
    const classified = await classifyAndLogCandidate(h, c, 'search_discovery');
    results.push({ ...c, ...classified });
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
