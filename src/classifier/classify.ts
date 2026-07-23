/**
 * `classifySite` — the site classifier core (spec §3).
 *
 * Pure function: takes the evidence gathered about a site (a `SiteProbe`) and
 * returns a `ClassificationResult`. All I/O (HTTP, headless browser, robots/ToS
 * fetching) lives in `probe.ts`; keeping this pure is what makes the decision
 * logic exhaustively unit-testable (see test/classify.test.ts).
 *
 * Ordering follows the spec exactly, because the steps override one another:
 * embedded_json / api_endpoint (high-confidence structural wins) are found
 * first, then manual_entry_only, then the robots/ToS gate which *overrides* any
 * technical result and forces review (spec §3 step 7 / §4 first bullet).
 */

import {
  DEFAULT_SCRAPER_STRATEGY,
  type Classification,
  type ClassificationResult,
  type SiteProbe,
} from '../types.js';
import {
  checkRobotsAndTos,
  detectManualOnly,
  domDiffRatio,
  findEmbeddedJson,
  findListingApi,
} from './detectors.js';
import { classifyPortal, isPortal } from './portals.js';
import { isBigCorporate, matchBigCorporate } from './bigCorporates.js';

export interface ClassifyOptions {
  approvalThreshold: number;
  /** Injectable clock for deterministic tests. */
  now?: () => Date;
}

/** Below this diff ratio a site is treated as static rather than JS-rendered (spec §3 step 3). */
const STATIC_DIFF_MAX = 0.25;

/**
 * When JSON is present but NOT listing-shaped (SEO schema, config, incidental
 * blobs), we keep the DOM-diff baseline classification but cap confidence here —
 * below the auto-approve threshold — so the source is routed to human review
 * rather than confidently auto-registered on a JSON-extract strategy that would
 * not actually capture listings (trial report finding).
 */
const GENERIC_JSON_CONFIDENCE = 0.6;

export function classifySite(
  probe: SiteProbe,
  opts: ClassifyOptions,
): ClassificationResult {
  const now = opts.now ?? (() => new Date());

  // Portals get bespoke handling and are always routed to review (spec §5).
  if (isPortal(probe.url)) {
    return classifyPortal(probe.url, now, probe.robotsTxt, probe.tosText);
  }

  const notes: string[] = [];

  // Step 3 — static vs js_rendered baseline from the raw/rendered DOM diff.
  // This always resolves to a concrete classification, which subsumes the
  // spec's step-8 "unclassified" fallback (there is no path that leaves the
  // classification unresolved); the robots/ToS gate below can still override it
  // to needs_review.
  const diff = domDiffRatio(probe.rawHtml, probe.renderedDom);
  const baseline: Classification = diff <= STATIC_DIFF_MAX ? 'static_html' : 'js_rendered';
  notes.push(`dom diff ratio ${diff.toFixed(2)} → baseline ${baseline}`);
  let classification: Classification = baseline;
  let confidence = baseline === 'static_html' ? 0.8 : 0.6;

  // Step 4 — embedded JSON. Only a *listing-shaped* payload is a high-confidence
  // win over the baseline. Generic/SEO JSON (present on nearly every site) must
  // not masquerade as extractable listings, so it leaves the classification on
  // the baseline and caps confidence below the auto-approve bar (→ review).
  const embedded = findEmbeddedJson(probe.rawHtml);
  if (embedded.listingShaped) {
    classification = 'embedded_json';
    confidence = 0.9;
    notes.push(embedded.notes);
  } else if (embedded.found) {
    confidence = Math.min(confidence, GENERIC_JSON_CONFIDENCE);
    notes.push('generic JSON only — ' + embedded.notes);
  }

  // Step 5 — a listings JSON endpoint beats embedded JSON (cleanest to scrape).
  const api = findListingApi(probe.networkLog);
  if (api.found) {
    classification = 'api_endpoint';
    confidence = 0.92;
    notes.push(api.notes);
  }

  // Step 6 — manual-entry-only sites (no addressable URLs, POST-only search).
  // Only applies when we haven't found a machine-readable structure above.
  if (classification === 'static_html' || classification === 'js_rendered') {
    const manual = detectManualOnly(probe.rawHtml, probe.renderedDom);
    if (manual.found) {
      classification = 'manual_entry_only';
      confidence = 0.85;
      notes.push(manual.notes);
    }
  }

  // Step 7 — robots.txt / ToS gate. Overrides the technical result and forces
  // review regardless of confidence (spec §4 first bullet).
  const gate = checkRobotsAndTos(probe.robotsTxt, probe.tosText);
  let tosFlag = false;
  if (gate.found) {
    tosFlag = true;
    notes.push('TOS GATE: ' + gate.notes);
    classification = 'needs_review';
    // Preserve the technically-detected confidence for the audit trail, but the
    // decision below will force review because tosFlag is set.
  }

  // Step 7.5 — large-corporate-agent policy override (2026-07-19 decision).
  // CBRE / Savills / Knight Frank Commercial are ordinary agent sites, not
  // portals, so they run the full heuristics above like any other agent. But
  // given their scale a technically-scrapeable verdict alone isn't a green
  // light: force mandatory review regardless of confidence, without
  // overwriting the genuine technical classification (unlike the ToS-text gate
  // above, which does overwrite it — this is a policy flag, not a detected
  // restriction).
  if (!tosFlag && isBigCorporate(probe.url)) {
    tosFlag = true;
    notes.push(
      `POLICY: ${matchBigCorporate(probe.url)!.name} is a large corporate agent — mandatory human review regardless of technical classification or confidence (manual ToS review required).`,
    );
  }

  return finalize({
    url: probe.url,
    classification,
    confidence,
    tosFlag,
    notes,
    approvalThreshold: opts.approvalThreshold,
    now,
  });
}

function finalize(args: {
  url: string;
  classification: Classification;
  confidence: number;
  tosFlag: boolean;
  notes: string[];
  approvalThreshold: number;
  now: () => Date;
}): ClassificationResult {
  const { url, classification, confidence, tosFlag, notes, approvalThreshold, now } = args;

  // Spec §3 step 10 + §4: auto-approve only if confident AND no ToS flag AND the
  // classification is actually machine-actionable. manual_entry_only sources are
  // created but never auto-scraped (spec §4 third bullet).
  const autoApprovable =
    classification !== 'needs_review' && classification !== 'manual_entry_only';
  const autoApprove = autoApprovable && confidence >= approvalThreshold && !tosFlag;

  return {
    url,
    classification,
    confidence,
    scraperStrategy: DEFAULT_SCRAPER_STRATEGY[classification],
    tosFlag,
    detectedStructure: notes.join('; '),
    decision: autoApprove ? 'auto_approved' : 'queued_for_review',
    resultingStatus: autoApprove ? 'active' : 'pending_review',
    classifiedAt: now().toISOString(),
  };
}
