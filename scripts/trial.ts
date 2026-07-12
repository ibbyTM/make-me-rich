/**
 * Dry-run classifier trial against real UK commercial-agent sites.
 *
 * - Fetches raw HTML + robots.txt + best-effort ToS through the (proxy-aware)
 *   fetch. NO headless render is available in this sandbox, so renderedDom ==
 *   rawHtml and networkLog is empty. See the report for what that costs.
 * - Runs the real classifySite() at the production threshold (0.8) to get the
 *   classifier's *natural* verdict.
 * - Logs every run to a real site_audits table (PGlite + the real migrations).
 * - SAFETY: every source row is stored with status = 'pending_review'
 *   regardless of the classifier verdict, so nothing is auto-activated for live
 *   scheduled scraping. This is a shakeout, not a go-live.
 */

import { classifySite } from '../src/classifier/classify.js';
import type { SiteProbe } from '../src/types.js';
import { createHarness } from '../test/helpers/pgHarness.js';

const UA = 'CAIS-SourceOnboarding/0.1 (dry-run trial; +https://example.invalid/bot)';

const SITES = [
  { url: 'https://search.savills.com/list/commercial/property-for-sale/uk', label: 'Savills (commercial search)', geo: 'National' },
  { url: 'https://www.barnsdales.co.uk', label: 'Barnsdales', geo: 'National / Doncaster' },
  { url: 'https://www.michaelsteel.co.uk', label: 'Michael Steel & Co', geo: 'National (POST-form test)' },
  { url: 'https://www.cartertowler.co.uk', label: 'Carter Towler', geo: 'Leeds' },
  { url: 'https://www.canningoneill.co.uk', label: "Canning O'Neill", geo: 'Manchester' },
  { url: 'https://www.naylorsgavinblack.co.uk', label: 'Naylors Gavin Black', geo: 'Newcastle' },
];

async function get(url: string, timeoutMs = 12000): Promise<{ status: number; body: string; err?: string }> {
  try {
    const r = await fetch(url, {
      headers: { 'user-agent': UA },
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
    });
    return { status: r.status, body: await r.text() };
  } catch (e) {
    return { status: 0, body: '', err: e instanceof Error ? e.message : String(e) };
  }
}

async function fetchRobots(url: string): Promise<string | undefined> {
  const o = new URL(url);
  const r = await get(`${o.protocol}//${o.host}/robots.txt`);
  return r.status === 200 && r.body.trim() ? r.body : undefined;
}

async function fetchTos(url: string): Promise<string | undefined> {
  const o = new URL(url);
  for (const p of ['/terms', '/terms-and-conditions']) {
    const r = await get(`${o.protocol}//${o.host}${p}`, 8000);
    if (r.status === 200 && r.body.trim().length > 200) return r.body;
  }
  return undefined;
}

async function main() {
  const h = await createHarness();
  const results: Record<string, unknown>[] = [];

  for (const site of SITES) {
    process.stderr.write(`probing ${site.url} ...\n`);
    const raw = await get(site.url);

    if (raw.status < 200 || raw.status >= 400 || raw.body.length < 200) {
      results.push({
        label: site.label, geo: site.geo, url: site.url,
        fetchStatus: raw.status, htmlLen: raw.body.length,
        note: `FETCH FAILED/BLOCKED (${raw.err ?? 'status ' + raw.status}) — not classified`,
      });
      continue;
    }

    const [robotsTxt, tosText] = await Promise.all([fetchRobots(site.url), fetchTos(site.url)]);

    const probe: SiteProbe = {
      url: site.url,
      rawHtml: raw.body,
      renderedDom: raw.body, // no render available — degraded (see report)
      networkLog: [],
      robotsTxt,
      tosText,
    };

    const res = classifySite(probe, { approvalThreshold: 0.8 });

    // Persist source (status FORCED to pending_review) + audit row.
    const src = await h.asAdminBypass<{ id: string }>(
      `insert into sources (url, name, status, classification, classification_confidence,
                            scraper_strategy, discovered_via, tos_flag, last_classified_at)
       values ($1,$2,'pending_review',$3,$4,$5,'manual',$6,$7)
       on conflict (url) do update set classification = excluded.classification
       returning id`,
      [site.url, site.label, res.classification, res.confidence, res.scraperStrategy, res.tosFlag, res.classifiedAt],
    );
    await h.asAdminBypass(
      `insert into site_audits (source_id, run_at, detected_structure, confidence, decision)
       values ($1,$2,$3,$4,$5)`,
      [src.rows[0]!.id, res.classifiedAt, res.detectedStructure, res.confidence, res.decision],
    );

    results.push({
      label: site.label, geo: site.geo, url: site.url,
      fetchStatus: raw.status, htmlLen: raw.body.length,
      robotsFound: Boolean(robotsTxt), tosFound: Boolean(tosText),
      classification: res.classification,
      confidence: res.confidence,
      classifierVerdict: res.decision,           // natural decision at threshold 0.8
      wouldBeStatus: res.resultingStatus,        // what it WOULD do live
      storedStatus: 'pending_review',            // what we actually stored (dry-run safety)
      tosFlag: res.tosFlag,
      detected: res.detectedStructure,
    });
  }

  // Prove the audit rows were logged.
  const audits = await h.asAdminBypass<{ n: number }>(`select count(*)::int n from site_audits`);
  const activeCount = await h.asAdminBypass<{ n: number }>(
    `select count(*)::int n from sources where status = 'active'`,
  );

  console.log(JSON.stringify({
    results,
    auditRowsLogged: audits.rows[0]!.n,
    sourcesSetActive: activeCount.rows[0]!.n, // must be 0
  }, null, 2));

  await h.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
