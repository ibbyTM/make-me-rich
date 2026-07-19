/**
 * Second discovery batch (2026-07-19): widening the PropertyHive-pattern hunt
 * beyond the original 21-agent curated directory. Every candidate here was
 * found via live web search (independent commercial agents in cities beyond
 * the original batch — more Yorkshire/Greater Manchester towns plus adjacent
 * North/Midlands regions) or via the official Property Hive plugin showcase
 * page (wp-property-hive.com/estate-agent-wordpress-website-showcase — a
 * developer-maintained list of real sites built on the plugin). None of these
 * URLs were guessed.
 *
 * Same gate as every prior run: discovery_queue -> classify -> sources
 * (forced pending_review) -> site_audits. classifyAndLogCandidate runs the
 * live robots.txt/ToS check on every candidate regardless of what the
 * wp-json probe (run separately, see docs/new-sources-discovery-2026-07-19.md)
 * already found.
 *
 *   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
 *     node --import tsx scripts/new-sources-discovery-2026-07-19b.ts
 */

import { createPersistentHarness } from '../src/db/pglite.js';
import { classifyAndLogCandidate, type Candidate } from '../src/discovery/requirementDiscovery.js';

const CANDIDATES: (Candidate & { city: string })[] = [
  { name: 'Stephensons Estate Agents', city: 'York', url: 'https://www.stephensons4property.co.uk' },
  { name: 'McBeath Property Consultancy', city: 'York', url: 'https://www.mcbeathproperty.co.uk' },
  { name: 'Garness Jones', city: 'Hull/York', url: 'https://www.garnessjones.co.uk' },
  { name: 'Walker Singleton', city: 'Halifax/Huddersfield', url: 'https://www.walkersingleton.co.uk' },
  { name: 'FSL Estate Agents', city: 'Wakefield', url: 'https://www.fslestateagents.com' },
  { name: 'Holroyd Miller', city: 'Wakefield', url: 'https://holroydmiller.co.uk' },
  { name: 'Vickers Carnley', city: 'Wakefield', url: 'https://www.vickerscarnley.co.uk' },
  { name: 'Merryweathers', city: 'Rotherham', url: 'https://merryweathers.co.uk' },
  { name: 'Flint Real Estate', city: 'South Yorkshire', url: 'https://flintrealestate.co.uk' },
  { name: 'Trigglets Estates', city: 'South Yorkshire', url: 'https://www.trigglets.co.uk' },
  { name: 'PropertyONE', city: 'Stockport', url: 'https://www.property-one.co.uk' },
  { name: 'Miller Metcalfe', city: 'Stockport/Rochdale/Wigan', url: 'https://millermetcalfe.co.uk' },
  { name: 'Borron Shaw', city: 'Wigan', url: 'https://www.borronshaw.co.uk' },
  { name: 'Healy Simpson', city: 'Wigan', url: 'https://www.healysimpson.co.uk' },
  { name: 'Eckersley', city: 'Preston/Lancaster', url: 'https://www.eckersleyproperty.co.uk' },
  { name: 'Robert Pinkus & Co', city: 'Preston', url: 'https://www.pinkus.co.uk' },
  { name: 'Morgan Martin', city: 'Preston', url: 'https://www.morganmartin.co.uk' },
  { name: 'HDAK', city: 'Preston', url: 'https://www.hdak.co.uk' },
  { name: 'Hazelwells', city: 'Preston', url: 'https://www.hazelwells.com' },
  { name: 'Taylors Estates', city: 'Preston', url: 'https://taylors-estates.com' },
  { name: 'butters john bee Commercial', city: 'Stoke-on-Trent', url: 'https://buttersjohnbee.com' },
  { name: 'Michael Tromans & Co', city: 'Wolverhampton', url: 'https://www.michaeltromans.co.uk' },
  { name: 'Bromwich Hardy', city: 'Coventry', url: 'https://www.bromwichhardy.com' },
  { name: 'Robert Ellis', city: 'Nottingham', url: 'https://www.robertellis.co.uk' },
  { name: 'Wood Moore & Co', city: 'Nottinghamshire/Lincolnshire', url: 'https://www.woodmoore.co.uk' },
  { name: 'Richard Watkinson & Partners', city: 'Nottinghamshire/Lincolnshire', url: 'https://www.richardwatkinson.co.uk' },
  { name: 'Tanners', city: 'Nottingham', url: 'https://www.tanners-properties.co.uk' },
  { name: 'NG Chartered Surveyors', city: 'Nottingham', url: 'https://ng-cs.com' },
  { name: 'FHP', city: 'Nottingham/Derby/Birmingham', url: 'https://www.fhp.co.uk' },
  { name: 'BA Commercial', city: 'Chester/Merseyside', url: 'https://bacommercial.com' },
  { name: 'KenneyMoore', city: 'Chester', url: 'https://kenneymoore.co.uk' },
  { name: 'Morgan Williams', city: 'Warrington', url: 'https://morganwilliams.com' },
  { name: 'Ashtons', city: 'Warrington/Cheshire', url: 'https://www.ashtons.net' },
  { name: 'Connect Property North East', city: 'Teesside/North East', url: 'https://cpne.co.uk' },
  { name: 'Lofthouse and Partners', city: 'Teesside/North East', url: 'https://lofthouseandpartners.co.uk' },
  { name: 'Bramleys', city: 'Halifax/Huddersfield', url: 'https://www.bramleys.com' },
];

async function main() {
  const h = await createPersistentHarness();
  const results: Record<string, unknown>[] = [];

  for (const c of CANDIDATES) {
    process.stderr.write(`discovering ${c.name} (${c.url}) ...\n`);
    const classified = await classifyAndLogCandidate(h, c, 'search_discovery');
    results.push({ ...c, ...classified });
    process.stderr.write(`  -> ${classified.outcome}${classified.classification ? ' / ' + classified.classification : ''}${classified.detail ? ' / ' + classified.detail : ''}\n`);
    await new Promise((r) => setTimeout(r, 800));
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
