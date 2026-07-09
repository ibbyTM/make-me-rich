/**
 * Repository ports (interfaces) for the onboarding pipeline.
 *
 * Orchestration (registration, discovery promotion) depends only on these
 * interfaces, so it can run against the in-memory implementation in tests and
 * the Supabase implementation in production without changing a line.
 */

import type {
  Classification,
  ClassificationResult,
  DiscoveredVia,
  DiscoveryQueueItem,
  DiscoveryStatus,
  SourceStatus,
} from '../types.js';

export interface SourceRecord {
  id: string;
  url: string;
  name: string | null;
  classification: Classification;
  classificationConfidence: number | null;
  scraperStrategy: string | null;
  discoveredVia: DiscoveredVia;
  tosFlag: boolean;
  status: SourceStatus;
  lastClassifiedAt: string | null;
  /** Default schedule (spec §4): weekly, Fridays. */
  schedule: string;
}

export interface SiteAuditRecord {
  id: string;
  sourceId: string;
  runAt: string;
  detectedStructure: string;
  confidence: number;
  decision: ClassificationResult['decision'];
  reviewedBy: string | null;
  reviewDecision: string | null;
}

export interface SourcesRepo {
  /** Upsert by URL. Returns the resulting source id. */
  upsertByUrl(input: {
    url: string;
    discoveredVia: DiscoveredVia;
    result: ClassificationResult;
  }): Promise<SourceRecord>;
  getByUrl(url: string): Promise<SourceRecord | null>;
}

export interface SiteAuditsRepo {
  log(input: Omit<SiteAuditRecord, 'id'>): Promise<SiteAuditRecord>;
  listBySource(sourceId: string): Promise<SiteAuditRecord[]>;
}

export interface DiscoveryQueueRepo {
  enqueue(input: { url: string; discoveredVia: DiscoveredVia }): Promise<DiscoveryQueueItem>;
  listByStatus(status: DiscoveryStatus): Promise<DiscoveryQueueItem[]>;
  markStatus(id: string, status: DiscoveryStatus, sourceId?: string | null): Promise<void>;
}

export interface Repositories {
  sources: SourcesRepo;
  audits: SiteAuditsRepo;
  discovery: DiscoveryQueueRepo;
}
