/**
 * Onboarding orchestration (spec §3 step 9/10, §4, Day B/C).
 *
 * Ties the pure classifier to the repositories:
 *   probe (or supplied) → classifySite → log site_audit → upsert source.
 *
 * The auto-registration rules live in `classifySite.finalize` (confidence +
 * tos_flag gating); this module just persists the decision and always writes an
 * audit row so every run is inspectable (spec §2.2).
 */

import { classifySite, type ClassifyOptions } from '../classifier/classify.js';
import { probeSite } from '../classifier/probe.js';
import type { Repositories } from '../db/ports.js';
import type {
  ClassificationResult,
  DiscoveredVia,
  SiteProbe,
  SourceStatus,
} from '../types.js';

export interface OnboardResult {
  sourceId: string;
  url: string;
  classification: ClassificationResult;
  status: SourceStatus;
  auditId: string;
}

export interface OnboardDeps {
  repos: Repositories;
  approvalThreshold: number;
  now?: () => Date;
  /** Override the probe step (tests inject a fixture instead of hitting the network). */
  probe?: (url: string) => Promise<SiteProbe>;
}

export async function onboardUrl(
  url: string,
  discoveredVia: DiscoveredVia,
  deps: OnboardDeps,
): Promise<OnboardResult> {
  const now = deps.now ?? (() => new Date());
  const probe = deps.probe ?? probeSite;

  const siteProbe = await probe(url);

  const classifyOpts: ClassifyOptions = {
    approvalThreshold: deps.approvalThreshold,
    now,
  };
  const result = classifySite(siteProbe, classifyOpts);

  // Persist the source first so the audit can FK to it (spec §3 step 9/10).
  const source = await deps.repos.sources.upsertByUrl({
    url,
    discoveredVia,
    result,
  });

  const audit = await deps.repos.audits.log({
    sourceId: source.id,
    runAt: result.classifiedAt,
    detectedStructure: result.detectedStructure,
    confidence: result.confidence,
    decision: result.decision,
    reviewedBy: null,
    reviewDecision: null,
  });

  return {
    sourceId: source.id,
    url,
    classification: result,
    status: source.status,
    auditId: audit.id,
  };
}
