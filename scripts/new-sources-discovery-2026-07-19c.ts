/**
 * Third discovery batch (2026-07-19): widening the PropertyHive-pattern hunt
 * even further — a wider ring of UK cities/regions beyond the first two
 * widening passes (Harrogate/Skipton/Keighley, Blackpool/Burnley/Lancaster,
 * Altrincham/Trafford/Ashton, Crewe/Macclesfield/Northwich, St Helens/
 * Southport/Wirral, Solihull/Dudley/Walsall, Chesterfield/Mansfield,
 * Carlisle/Kendal/Cumbria, Hartlepool/Darlington, Scarborough/Selby/Goole,
 * Grimsby/Scunthorpe, Bury/Rochdale/Oldham). All URLs found via live web
 * search, none guessed.
 *
 * Same gate as every prior run: discovery_queue -> classify -> sources
 * (forced pending_review) -> site_audits, live robots.txt/ToS check on every
 * candidate. This round's wp-json/wp/v2/property probe (run separately, see
 * docs/propertyhive-widen-2026-07-19b.md) found no new genuine PropertyHive
 * matches — logging everything anyway per the standing "hit or miss" rule.
 *
 *   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
 *     node --import tsx scripts/new-sources-discovery-2026-07-19c.ts
 */

import { createPersistentHarness } from '../src/db/pglite.js';
import { classifyAndLogCandidate, type Candidate } from '../src/discovery/requirementDiscovery.js';

const CANDIDATES: (Candidate & { city: string })[] = [
  { name: 'Walker Foster', city: 'Harrogate/Skipton/Keighley', url: 'https://www.walkerfoster.com' },
  { name: 'FSS Property', city: 'Harrogate', url: 'https://www.fssproperty.co.uk' },
  { name: 'Duxburys Commercial', city: 'Preston/Blackpool/Manchester', url: 'https://duxburyscommercial.com' },
  { name: 'Petty Commercial', city: 'Burnley/Colne/Barrowford', url: 'https://pettycommercial.co.uk' },
  { name: 'Fisher Wrathall Commercial', city: 'Lancaster', url: 'https://www.fwcommercial.co.uk' },
  { name: 'Kays Estates', city: 'Blackpool', url: 'https://www.kaysestates.co.uk' },
  { name: 'Jameson and Partners', city: 'Altrincham', url: 'https://jamesonpartners.co.uk' },
  { name: 'Ian Macklin and Co', city: 'Altrincham', url: 'https://www.ianmacklin.com' },
  { name: 'Jinks Aston', city: 'Crewe', url: 'https://www.jinksaston.com' },
  { name: 'Sellers Chartered Surveyors', city: 'Dudley/West Bromwich', url: 'https://www.sellers-surveyors.co.uk' },
  { name: 'KWB', city: 'Birmingham/Solihull', url: 'https://kwboffice.com' },
  { name: 'AMT Commercial', city: 'Midlands', url: 'https://amtcommercial.co.uk' },
  { name: 'Stephens McBride (SMB)', city: 'Solihull', url: 'https://smbsurveyors.com' },
  { name: 'W.T. Parker', city: 'Chesterfield', url: 'https://wtparker.com' },
  { name: 'Bothams', city: 'Chesterfield', url: 'https://www.bothams.co.uk' },
  { name: 'Renshaw Chartered Surveyors', city: 'Chesterfield', url: 'https://rensurveyors.co.uk' },
  { name: 'Roy Peters Estates', city: 'Chesterfield', url: 'https://www.roypeters.com' },
  { name: 'Carigiet Cowen', city: 'Carlisle', url: 'https://www.carigietcowen.co.uk' },
  { name: 'Greig Cavey Commercial', city: 'Hartlepool', url: 'http://www.greigcavey.com' },
  { name: 'Collier Estates', city: 'Hartlepool', url: 'https://www.collierestates.co.uk' },
  { name: 'Hall Properties', city: 'Darlington', url: 'https://www.hallps.com' },
  { name: 'Townend Clegg & Co', city: 'Goole/Selby', url: 'https://www.townendclegg.co.uk' },
  { name: 'Scotts Property', city: 'Hull/Grimsby/Scunthorpe', url: 'https://scotts-property.co.uk' },
  { name: 'Hornsby Estate Agents', city: 'Scunthorpe', url: 'https://www.hornsbyestateagents.com' },
  { name: 'Nolan Real Estate', city: 'Bury/Oldham/Bolton', url: 'https://www.nolanrealestate.co.uk' },
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
