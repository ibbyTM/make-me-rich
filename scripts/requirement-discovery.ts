/**
 * Parameter-driven discovery: run discovery + classification for ONE
 * Requirements Register entry (seed or custom), instead of the fixed 21-site
 * batch in scripts/discovery-classify.ts.
 *
 *   npx tsx scripts/requirement-discovery.ts --requirement <id>
 *
 * Looks the requirement up in the persistent Requirements Register, builds
 * search queries from its geography + keywords, asks the configured search
 * provider (Bing if BING_SEARCH_API_KEY is set, otherwise the curated
 * directory — see src/discovery/searchProviders.ts for why), and classifies +
 * logs every candidate URL exactly like the original batch script: everything
 * lands in discovery_queue -> sources (pending_review) -> site_audits.
 * Nothing is auto-activated or auto-scraped by this step.
 *
 * This is what the dashboard's "Run discovery" button (per custom search)
 * invokes as a child process.
 */

import { createPersistentHarness } from '../src/db/pglite.js';
import { getRequirement, ensureSeeded } from '../src/db/requirementsRepo.js';
import { createSearchProvider } from '../src/discovery/searchProviders.js';
import { discoverForRequirement } from '../src/discovery/requirementDiscovery.js';

function getFlag(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

async function main() {
  const requirementId = getFlag('requirement');
  if (!requirementId) {
    throw new Error('usage: requirement-discovery.ts --requirement <id>');
  }

  const h = await createPersistentHarness();
  await ensureSeeded(h);

  const requirement = await getRequirement(h, requirementId);
  if (!requirement) {
    await h.close();
    throw new Error(`no requirement found with id ${requirementId}`);
  }

  const { provider, kind, note } = createSearchProvider();
  process.stderr.write(`[${kind}] ${note}\n`);
  process.stderr.write(`discovering for "${requirement.name}" (${requirement.geographies.join(', ')}) ...\n`);

  const result = await discoverForRequirement(h, requirement, provider, (msg) =>
    process.stderr.write(msg + '\n'),
  );

  await h.close();
  console.log(JSON.stringify({ providerKind: kind, providerNote: note, ...result }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
