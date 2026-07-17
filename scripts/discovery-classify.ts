/**
 * Search-based discovery batch (read-only): classify ~20 independent/regional
 * commercial agents found via web search across Citywide's core cities.
 *
 *   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
 *     npx tsx scripts/discovery-classify.ts
 *
 * Per site: fetch the homepage, locate the most listings-like page (per the
 * 2026-07-12 trial finding that homepages under-signal), classify THAT page
 * with the real classifier, and log every result to discovery_queue +
 * sources + site_audits (real migrations via the PGlite harness — same
 * pattern as scripts/trial.ts). All sources stored `pending_review`: nothing
 * is auto-scraped without going through the review gate.
 *
 * Emits JSON results to stdout for the follow-up scraper-building step.
 */

import { classifySite } from '../src/classifier/classify.js';
import type { SiteProbe } from '../src/types.js';
import { createHarness } from '../test/helpers/pgHarness.js';

const UA = 'CAIS-SourceOnboarding/0.1 (discovery batch; read-only)';

interface Candidate {
  name: string;
  city: string;
  url: string;
}

/** Discovered via web search 2026-07-17 (independent/regional; nationals excluded). */
const CANDIDATES: Candidate[] = [
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

async function get(url: string, timeoutMs = 20000): Promise<{ status: number; body: string; err?: string }> {
  try {
    const r = await fetch(url, {
      headers: { 'user-agent': UA, accept: 'text/html' },
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
    });
    return { status: r.status, body: await r.text() };
  } catch (e) {
    return { status: 0, body: '', err: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * Pick the most listings-like link on a homepage. Scored patterns, strongest
 * first; only same-host links qualify.
 */
function findListingsUrl(homeUrl: string, html: string): string | null {
  const host = new URL(homeUrl).host;
  const anchors = [...html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["']/gi)].map((m) => m[1]!);
  const patterns: RegExp[] = [
    /commercial[^"']*(for-?sale|sale|search|propert)/i,
    /propert[^"']*(search|for-?sale|to-?let|commercial|available)/i,
    /(available|current)[^"']*propert/i,
    /\/(properties|property-search|search-results|listings)\/?$/i,
    /\/(commercial|properties)\b/i,
  ];
  for (const re of patterns) {
    for (const href of anchors) {
      if (!re.test(href)) continue;
      try {
        const abs = new URL(href, homeUrl);
        if (abs.host !== host) continue;
        if (/\.(pdf|jpg|png|docx?)$/i.test(abs.pathname)) continue;
        return abs.toString();
      } catch {
        /* skip bad hrefs */
      }
    }
  }
  return null;
}

async function fetchRobots(url: string): Promise<string | undefined> {
  const o = new URL(url);
  const r = await get(`${o.protocol}//${o.host}/robots.txt`, 8000);
  return r.status === 200 && r.body.trim() ? r.body : undefined;
}

async function main() {
  const h = await createHarness();
  const results: Record<string, unknown>[] = [];

  for (const c of CANDIDATES) {
    process.stderr.write(`discovering ${c.name} (${c.url}) ...\n`);

    // Real discovery flow: the URL lands in discovery_queue first.
    const dq = await h.asAdminBypass<{ id: string }>(
      `insert into discovery_queue (url, discovered_via, status) values ($1, 'search_discovery', 'pending') returning id`,
      [c.url],
    );

    const home = await get(c.url);
    if (home.status < 200 || home.status >= 400 || home.body.length < 500) {
      await h.asAdminBypass(`update discovery_queue set status = 'rejected' where id = $1`, [dq.rows[0]!.id]);
      results.push({ ...c, outcome: 'fetch_failed', detail: home.err ?? `HTTP ${home.status}` });
      continue;
    }

    const listingsUrl = findListingsUrl(c.url, home.body);
    let pageUrl = c.url;
    let pageHtml = home.body;
    if (listingsUrl && listingsUrl !== c.url) {
      const lp = await get(listingsUrl);
      if (lp.status >= 200 && lp.status < 400 && lp.body.length > 500) {
        pageUrl = listingsUrl;
        pageHtml = lp.body;
      }
    }

    const robotsTxt = await fetchRobots(c.url);
    const probe: SiteProbe = {
      url: pageUrl,
      rawHtml: pageHtml,
      renderedDom: pageHtml, // headless unavailable in this sandbox (known issue)
      networkLog: [],
      robotsTxt,
    };
    const res = classifySite(probe, { approvalThreshold: 0.8 });

    // sources row: FORCED pending_review (review gate), audit row logged as-is.
    const src = await h.asAdminBypass<{ id: string }>(
      `insert into sources (url, name, status, classification, classification_confidence,
                            scraper_strategy, discovered_via, tos_flag, last_classified_at)
       values ($1,$2,'pending_review',$3,$4,$5,'search_discovery',$6,$7)
       on conflict (url) do update set classification = excluded.classification
       returning id`,
      [c.url, c.name, res.classification, res.confidence, res.scraperStrategy, res.tosFlag, res.classifiedAt],
    );
    await h.asAdminBypass(
      `insert into site_audits (source_id, run_at, detected_structure, confidence, decision)
       values ($1,$2,$3,$4,$5)`,
      [src.rows[0]!.id, res.classifiedAt, `[classified ${pageUrl}] ` + res.detectedStructure, res.confidence, res.decision],
    );
    await h.asAdminBypass(
      `update discovery_queue set status = 'classified', source_id = $2 where id = $1`,
      [dq.rows[0]!.id, src.rows[0]!.id],
    );

    results.push({
      ...c,
      outcome: 'classified',
      classifiedUrl: pageUrl,
      classification: res.classification,
      confidence: res.confidence,
      tosFlag: res.tosFlag,
      decision: res.decision,
      detected: res.detectedStructure,
    });
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
