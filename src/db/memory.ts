/**
 * In-memory implementation of the repository ports. Used by tests and the
 * `--dry-run` CLI mode. Deterministic ids when an id generator is injected.
 */

import type { DiscoveredVia, DiscoveryQueueItem, DiscoveryStatus } from '../types.js';
import type {
  DiscoveryQueueRepo,
  Repositories,
  SiteAuditRecord,
  SiteAuditsRepo,
  SourceRecord,
  SourcesRepo,
} from './ports.js';
import type { ClassificationResult } from '../types.js';

export interface MemoryOptions {
  idGen?: () => string;
  now?: () => Date;
}

const DEFAULT_SCHEDULE = 'weekly:friday'; // spec §4

export class MemoryRepositories implements Repositories {
  sources: SourcesRepo;
  audits: SiteAuditsRepo;
  discovery: DiscoveryQueueRepo;

  private sourcesByUrl = new Map<string, SourceRecord>();
  private auditList: SiteAuditRecord[] = [];
  private queue: DiscoveryQueueItem[] = [];
  private counter = 0;
  private idGen: () => string;
  private now: () => Date;

  constructor(opts: MemoryOptions = {}) {
    this.now = opts.now ?? (() => new Date());
    this.idGen = opts.idGen ?? (() => `id_${++this.counter}`);

    const self = this;

    this.sources = {
      async upsertByUrl({ url, discoveredVia, result }): Promise<SourceRecord> {
        const existing = self.sourcesByUrl.get(url);
        const record: SourceRecord = {
          id: existing?.id ?? self.idGen(),
          url,
          name: existing?.name ?? null,
          classification: result.classification,
          classificationConfidence: result.confidence,
          scraperStrategy: result.scraperStrategy,
          discoveredVia,
          tosFlag: result.tosFlag,
          status: result.resultingStatus,
          lastClassifiedAt: result.classifiedAt,
          schedule: existing?.schedule ?? DEFAULT_SCHEDULE,
        };
        self.sourcesByUrl.set(url, record);
        return record;
      },
      async getByUrl(url): Promise<SourceRecord | null> {
        return self.sourcesByUrl.get(url) ?? null;
      },
    };

    this.audits = {
      async log(input): Promise<SiteAuditRecord> {
        const record: SiteAuditRecord = { id: self.idGen(), ...input };
        self.auditList.push(record);
        return record;
      },
      async listBySource(sourceId): Promise<SiteAuditRecord[]> {
        return self.auditList.filter((a) => a.sourceId === sourceId);
      },
    };

    this.discovery = {
      async enqueue({ url, discoveredVia }): Promise<DiscoveryQueueItem> {
        const item: DiscoveryQueueItem = {
          id: self.idGen(),
          url,
          discoveredVia,
          discoveredAt: self.now().toISOString(),
          status: 'pending',
          sourceId: null,
        };
        self.queue.push(item);
        return item;
      },
      async listByStatus(status): Promise<DiscoveryQueueItem[]> {
        return self.queue.filter((q) => q.status === status);
      },
      async markStatus(id, status, sourceId): Promise<void> {
        const item = self.queue.find((q) => q.id === id);
        if (item) {
          item.status = status;
          if (sourceId !== undefined) item.sourceId = sourceId;
        }
      },
    };
  }
}

export type { DiscoveredVia, DiscoveryStatus, ClassificationResult };
