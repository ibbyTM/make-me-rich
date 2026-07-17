/**
 * Live pull + Stage-0 for scrapeable sources from the search-discovery batch
 * (read-only). Currently: SMC Brownill Vickers via the generic PropertyHive
 * REST scraper.
 *
 *   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
 *     npx tsx scripts/discovered-agents-report.ts
 *
 * Also re-classifies each scrapeable source with the API-response evidence in
 * the network log (the raw-HTML-only batch couldn't see XHR data), confirming
 * api_endpoint before scraping — the same classifier gate, now with the
 * evidence it lacked. Writes dashboard/data/discovered.json for the dashboard.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { classifySite } from '../src/classifier/classify.js';
import {
  PROPERTY_HIVE_SOURCES,
  fetchPropertyHiveListings,
  type PropertyHiveListing,
} from '../src/scrapers/propertyHive.js';
import { stageZeroFilter } from '../src/filter/stageZero.js';
import { config } from '../src/config.js';
import { SEED_REQUIREMENTS, CITYWIDE, EDUCATING } from '../src/requirements/seeds.js';
import type { Listing } from '../src/types.js';

const REQ_NAME: Record<string, string> = {
  [CITYWIDE.id]: CITYWIDE.name,
  [EDUCATING.id]: EDUCATING.name,
};

// Same postcode-area → region mapping as the Barnsdales report.
const YORKSHIRE = new Set(['BD', 'DN', 'HD', 'HG', 'HU', 'HX', 'LS', 'S', 'WF', 'YO']);
const GTR_MANCHESTER = new Set(['M', 'BL', 'OL', 'SK', 'WN']);
function region(pc: string): string {
  const area = (/^([A-Za-z]{1,2})/.exec(pc.trim())?.[1] ?? '').toUpperCase();
  if (YORKSHIRE.has(area)) return 'Yorkshire';
  if (GTR_MANCHESTER.has(area)) return 'Greater Manchester';
  return '';
}

function toStageListing(l: PropertyHiveListing, sourceName: string): Listing {
  return {
    sourceId: sourceName,
    externalId: String(l.id),
    geography: `${l.town} ${region(l.postcode)}`.trim(),
    size: l.sizeSqft ?? undefined,
    price: l.priceAmount > 0 ? l.priceAmount : undefined,
    text: [l.address, l.sizeLabel, l.text].join(' '),
  };
}

async function main() {
  const bar = config.stageZeroMinimumBar;
  const allRows: Record<string, unknown>[] = [];
  const summary: Record<string, unknown>[] = [];

  for (const source of PROPERTY_HIVE_SOURCES) {
    process.stderr.write(`pulling ${source.name} ...\n`);
    const pull = await fetchPropertyHiveListings(source);

    // Classifier gate with API evidence: real endpoint response in the network log.
    const apiUrl = `${source.baseUrl}/wp-json/wp/v2/${source.postType}?per_page=100`;
    const sample = pull.listings.slice(0, 5).map((l) => ({
      price: l.priceAmount,
      address: l.address,
      sqft: l.sizeSqft,
      tenure: '',
    }));
    const cls = classifySite(
      {
        url: `${source.baseUrl}/properties/`,
        rawHtml: '<html></html>',
        renderedDom: '<html></html>',
        networkLog: [
          { url: apiUrl, method: 'GET', status: 200, contentType: 'application/json', responseBody: sample },
        ],
      },
      { approvalThreshold: 0.8 },
    );

    const scored = pull.listings.map((l) => ({
      l,
      result: stageZeroFilter(toStageListing(l, source.name), SEED_REQUIREMENTS, { minimumBar: bar }),
    }));
    const passed = scored.filter((s) => s.result.pass);

    summary.push({
      source: source.name,
      apiClassification: cls.classification,
      apiConfidence: cls.confidence,
      totalOnApi: pull.totalOnApi,
      commercialForSale: pull.listings.length,
      passedStageZero: passed.length,
    });

    for (const { l, result } of passed) {
      allRows.push({
        address: `${l.address}${l.postcode ? ', ' + l.postcode : ''}`,
        priceDisplay: l.priceDisplay,
        priceAmount: l.priceAmount,
        sizeLabel: l.sizeLabel,
        sizeSqft: l.sizeSqft,
        source: source.name,
        requirement: REQ_NAME[result.matchedRequirementId ?? ''] ?? '(unknown)',
        score: result.score,
        reasons: result.reasons,
        url: l.url,
      });
    }
  }

  await mkdir('dashboard/data', { recursive: true });
  await writeFile(
    'dashboard/data/discovered.json',
    JSON.stringify(
      { source: 'Discovered agents', generatedAt: new Date().toISOString(), rows: allRows },
      null,
      2,
    ) + '\n',
    'utf8',
  );

  console.log(JSON.stringify({ summary, dashboardRows: allRows.length }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
