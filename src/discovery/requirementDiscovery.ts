/**
 * Shared "classify one candidate URL and log it" core, extracted from the
 * original fixed-batch discovery script (scripts/discovery-classify.ts) so it
 * can be reused by the new parameter-driven entry point
 * (scripts/requirement-discovery.ts) without duplicating the fetch/classify/
 * log logic. Same safety invariant everywhere it's used: every candidate lands
 * in discovery_queue, gets classified, and is written to sources with status
 * FORCED to pending_review + a site_audits row — nothing is ever auto-activated
 * from a discovery run (spec §4; the review gate is the point).
 */

import { classifySite } from '../classifier/classify.js';
import { detectBotChallenge } from '../classifier/detectors.js';
import type { SiteProbe, Classification, AuditDecision, DiscoveredVia, Requirement } from '../types.js';
import type { Harness } from '../db/pglite.js';
import type { SearchProvider } from './discovery.js';

const UA = 'CAIS-SourceOnboarding/0.1 (discovery; read-only)';

export interface Candidate {
  name: string;
  url: string;
}

export interface ClassifiedCandidate extends Candidate {
  outcome: 'classified' | 'fetch_failed' | 'blocked';
  classifiedUrl?: string;
  classification?: Classification;
  confidence?: number;
  tosFlag?: boolean;
  decision?: AuditDecision;
  detected?: string;
  detail?: string;
}

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
 * first; only same-host links qualify. (2026-07-12 trial finding: classifying
 * the homepage under-signals versus the actual listings page.)
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

/**
 * Fetch, locate the listings page, classify, and log a single candidate to
 * discovery_queue + sources (pending_review) + site_audits. Never throws for
 * ordinary fetch failures — those are reported as `outcome: 'fetch_failed'` so
 * one bad candidate can't stall a batch.
 */
/**
 * Log a candidate that could not be classified because it's bot-blocked
 * (anti-bot interstitial or 403/429) — still writes a full sources +
 * site_audits trail (spec: "everything logs to site_audits"), just with a
 * classification of `needs_review` and no scraper strategy, rather than
 * silently dropping it or misclassifying interstitial markup as a real page.
 */
async function logBlocked(
  h: Harness,
  dqId: string,
  candidate: Candidate,
  pageUrl: string,
  discoveredVia: DiscoveredVia,
  detail: string,
): Promise<ClassifiedCandidate> {
  const classifiedAt = new Date().toISOString();
  const src = await h.asAdminBypass<{ id: string }>(
    `insert into sources (url, name, status, classification, classification_confidence,
                          scraper_strategy, discovered_via, tos_flag, last_classified_at)
     values ($1,$2,'pending_review','needs_review',0,null,$3,false,$4)
     on conflict (url) do update set classification = excluded.classification,
       classification_confidence = excluded.classification_confidence,
       last_classified_at = excluded.last_classified_at
     returning id`,
    [candidate.url, candidate.name, discoveredVia, classifiedAt],
  );
  await h.asAdminBypass(
    `insert into site_audits (source_id, run_at, detected_structure, confidence, decision)
     values ($1,$2,$3,$4,'queued_for_review')`,
    [src.rows[0]!.id, classifiedAt, `[blocked ${pageUrl}] BLOCKED: ${detail}`, 0],
  );
  await h.asAdminBypass(`update discovery_queue set status = 'classified', source_id = $2 where id = $1`, [
    dqId,
    src.rows[0]!.id,
  ]);
  return { ...candidate, outcome: 'blocked', classifiedUrl: pageUrl, detail };
}

export async function classifyAndLogCandidate(
  h: Harness,
  candidate: Candidate,
  discoveredVia: DiscoveredVia = 'search_discovery',
): Promise<ClassifiedCandidate> {
  const dq = await h.asAdminBypass<{ id: string }>(
    `insert into discovery_queue (url, discovered_via, status) values ($1, $2, 'pending') returning id`,
    [candidate.url, discoveredVia],
  );

  const home = await get(candidate.url);
  const homeChallenge = detectBotChallenge(home.status, home.body);
  if (homeChallenge.found) {
    return logBlocked(h, dq.rows[0]!.id, candidate, candidate.url, discoveredVia, homeChallenge.notes);
  }
  if (home.status < 200 || home.status >= 400 || home.body.length < 500) {
    await h.asAdminBypass(`update discovery_queue set status = 'rejected' where id = $1`, [dq.rows[0]!.id]);
    return { ...candidate, outcome: 'fetch_failed', detail: home.err ?? `HTTP ${home.status}` };
  }

  const listingsUrl = findListingsUrl(candidate.url, home.body);
  let pageUrl = candidate.url;
  let pageHtml = home.body;
  if (listingsUrl && listingsUrl !== candidate.url) {
    const lp = await get(listingsUrl);
    const lpChallenge = detectBotChallenge(lp.status, lp.body);
    if (lpChallenge.found) {
      return logBlocked(h, dq.rows[0]!.id, candidate, listingsUrl, discoveredVia, lpChallenge.notes);
    }
    if (lp.status >= 200 && lp.status < 400 && lp.body.length > 500) {
      pageUrl = listingsUrl;
      pageHtml = lp.body;
    }
  }

  const robotsTxt = await fetchRobots(candidate.url);
  const probe: SiteProbe = {
    url: pageUrl,
    rawHtml: pageHtml,
    renderedDom: pageHtml, // headless unavailable in this sandbox (known issue)
    networkLog: [],
    robotsTxt,
  };
  const res = classifySite(probe, { approvalThreshold: 0.8 });

  const src = await h.asAdminBypass<{ id: string }>(
    `insert into sources (url, name, status, classification, classification_confidence,
                          scraper_strategy, discovered_via, tos_flag, last_classified_at)
     values ($1,$2,'pending_review',$3,$4,$5,$6,$7,$8)
     on conflict (url) do update set classification = excluded.classification,
       classification_confidence = excluded.classification_confidence,
       last_classified_at = excluded.last_classified_at
     returning id`,
    [
      candidate.url,
      candidate.name,
      res.classification,
      res.confidence,
      res.scraperStrategy,
      discoveredVia,
      res.tosFlag,
      res.classifiedAt,
    ],
  );
  await h.asAdminBypass(
    `insert into site_audits (source_id, run_at, detected_structure, confidence, decision)
     values ($1,$2,$3,$4,$5)`,
    [src.rows[0]!.id, res.classifiedAt, `[classified ${pageUrl}] ` + res.detectedStructure, res.confidence, res.decision],
  );
  await h.asAdminBypass(`update discovery_queue set status = 'classified', source_id = $2 where id = $1`, [
    dq.rows[0]!.id,
    src.rows[0]!.id,
  ]);

  return {
    ...candidate,
    outcome: 'classified',
    classifiedUrl: pageUrl,
    classification: res.classification,
    confidence: res.confidence,
    tosFlag: res.tosFlag,
    decision: res.decision,
    detected: res.detectedStructure,
  };
}

/** Cap on queries per discovery run — bounds work for a requirement with many geographies. */
const MAX_QUERIES = 8;

/**
 * Build search queries from a requirement's geography + keywords. One query
 * per geography (paired with its first keyword, if any) rather than a full
 * cross-product, capped at MAX_QUERIES.
 */
export function buildQueries(requirement: Pick<Requirement, 'geographies' | 'keywords'>): string[] {
  const kw = requirement.keywords?.[0];
  return requirement.geographies
    .slice(0, MAX_QUERIES)
    .map((geo) => [kw, 'commercial property agent', geo].filter(Boolean).join(' '));
}

function nameFromUrl(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export interface DiscoverForRequirementResult {
  requirementId: string;
  requirementName: string;
  queries: string[];
  candidatesFound: number;
  results: ClassifiedCandidate[];
}

/**
 * Full pipeline for a single requirement: build queries from its geography +
 * keywords, ask the search provider, classify + log every unique candidate URL
 * it returns. Safe to call with a provider that returns [] (e.g. the directory
 * provider on an uncovered geography) — just yields zero candidates, not an
 * error.
 */
export async function discoverForRequirement(
  h: Harness,
  requirement: Requirement,
  provider: SearchProvider,
  onProgress?: (msg: string) => void,
): Promise<DiscoverForRequirementResult> {
  const queries = buildQueries(requirement);
  const found = new Map<string, string>(); // url -> name

  for (const query of queries) {
    onProgress?.(`searching: ${query}`);
    const urls = await provider.search(query);
    for (const url of urls) if (!found.has(url)) found.set(url, nameFromUrl(url));
  }

  const results: ClassifiedCandidate[] = [];
  for (const [url, name] of found) {
    onProgress?.(`classifying: ${name} (${url})`);
    results.push(await classifyAndLogCandidate(h, { name, url }, 'search_discovery'));
    await new Promise((r) => setTimeout(r, 500));
  }

  return {
    requirementId: requirement.id,
    requirementName: requirement.name,
    queries,
    candidatesFound: found.size,
    results,
  };
}
