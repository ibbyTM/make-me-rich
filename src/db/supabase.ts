/**
 * Supabase-backed implementation of the repository ports.
 *
 * Column names map to the migrations in `supabase/migrations`. This adapter is
 * intentionally thin: all decision logic lives in the pure modules, this just
 * translates between the domain shapes and the `sources` / `site_audits` /
 * `discovery_queue` tables.
 *
 * Uses the service-role key — these onboarding jobs run server-side, outside
 * the RLS-governed request path. RLS still protects the same tables when read
 * through the app's analyst/va/admin roles (migration 0002).
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { DiscoveryQueueItem, DiscoveryStatus } from '../types.js';
import type {
  DiscoveryQueueRepo,
  Repositories,
  SiteAuditRecord,
  SiteAuditsRepo,
  SourceRecord,
  SourcesRepo,
} from './ports.js';

const DEFAULT_SCHEDULE = 'weekly:friday';

export function createSupabaseRepositories(
  url: string,
  serviceRoleKey: string,
): Repositories {
  const client: SupabaseClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const sources: SourcesRepo = {
    async upsertByUrl({ url: sourceUrl, discoveredVia, result }): Promise<SourceRecord> {
      const { data, error } = await client
        .from('sources')
        .upsert(
          {
            url: sourceUrl,
            discovered_via: discoveredVia,
            classification: result.classification,
            classification_confidence: result.confidence,
            scraper_strategy: result.scraperStrategy,
            tos_flag: result.tosFlag,
            status: result.resultingStatus,
            last_classified_at: result.classifiedAt,
            schedule: DEFAULT_SCHEDULE,
          },
          { onConflict: 'url' },
        )
        .select()
        .single();
      if (error) throw error;
      return rowToSource(data);
    },
    async getByUrl(sourceUrl): Promise<SourceRecord | null> {
      const { data, error } = await client
        .from('sources')
        .select()
        .eq('url', sourceUrl)
        .maybeSingle();
      if (error) throw error;
      return data ? rowToSource(data) : null;
    },
  };

  const audits: SiteAuditsRepo = {
    async log(input): Promise<SiteAuditRecord> {
      const { data, error } = await client
        .from('site_audits')
        .insert({
          source_id: input.sourceId,
          run_at: input.runAt,
          detected_structure: input.detectedStructure,
          confidence: input.confidence,
          decision: input.decision,
          reviewed_by: input.reviewedBy,
          review_decision: input.reviewDecision,
        })
        .select()
        .single();
      if (error) throw error;
      return rowToAudit(data);
    },
    async listBySource(sourceId): Promise<SiteAuditRecord[]> {
      const { data, error } = await client
        .from('site_audits')
        .select()
        .eq('source_id', sourceId)
        .order('run_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(rowToAudit);
    },
  };

  const discovery: DiscoveryQueueRepo = {
    async enqueue({ url: itemUrl, discoveredVia }): Promise<DiscoveryQueueItem> {
      const { data, error } = await client
        .from('discovery_queue')
        .insert({ url: itemUrl, discovered_via: discoveredVia, status: 'pending' })
        .select()
        .single();
      if (error) throw error;
      return rowToQueueItem(data);
    },
    async listByStatus(status: DiscoveryStatus): Promise<DiscoveryQueueItem[]> {
      const { data, error } = await client
        .from('discovery_queue')
        .select()
        .eq('status', status);
      if (error) throw error;
      return (data ?? []).map(rowToQueueItem);
    },
    async markStatus(id, status, sourceId): Promise<void> {
      const patch: Record<string, unknown> = { status };
      if (sourceId !== undefined) patch.source_id = sourceId;
      const { error } = await client.from('discovery_queue').update(patch).eq('id', id);
      if (error) throw error;
    },
  };

  return { sources, audits, discovery };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToSource(row: any): SourceRecord {
  return {
    id: row.id,
    url: row.url,
    name: row.name ?? null,
    classification: row.classification,
    classificationConfidence: row.classification_confidence,
    scraperStrategy: row.scraper_strategy,
    discoveredVia: row.discovered_via,
    tosFlag: row.tos_flag,
    status: row.status,
    lastClassifiedAt: row.last_classified_at,
    schedule: row.schedule ?? DEFAULT_SCHEDULE,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToAudit(row: any): SiteAuditRecord {
  return {
    id: row.id,
    sourceId: row.source_id,
    runAt: row.run_at,
    detectedStructure: row.detected_structure,
    confidence: row.confidence,
    decision: row.decision,
    reviewedBy: row.reviewed_by ?? null,
    reviewDecision: row.review_decision ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToQueueItem(row: any): DiscoveryQueueItem {
  return {
    id: row.id,
    url: row.url,
    discoveredVia: row.discovered_via,
    discoveredAt: row.discovered_at,
    status: row.status,
    sourceId: row.source_id ?? null,
  };
}
