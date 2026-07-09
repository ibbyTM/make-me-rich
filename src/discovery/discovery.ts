/**
 * Discovery layer (spec §5, Day E).
 *
 * Separates "a URL was found" from "a URL was classified". URLs land in the
 * discovery_queue from three sources (manual paste, Excel import, scheduled
 * search). A worker then drains the queue through the onboarding pipeline and
 * promotes each item to a `sources` row.
 */

import { onboardUrl, type OnboardDeps } from '../pipeline/onboard.js';
import type { Repositories } from '../db/ports.js';
import type { DiscoveredVia, DiscoveryQueueItem } from '../types.js';

/** Enqueue a single URL (manual paste, or one row of an Excel import). */
export async function enqueueUrl(
  repos: Repositories,
  url: string,
  discoveredVia: DiscoveredVia,
): Promise<DiscoveryQueueItem> {
  return repos.discovery.enqueue({ url, discoveredVia });
}

/**
 * Bulk import — e.g. the ~20-agent Excel file (spec §5 / Day E). Each URL
 * becomes one discovery_queue row rather than a manual source creation.
 * De-duplicates within the batch.
 */
export async function bulkEnqueue(
  repos: Repositories,
  urls: string[],
  discoveredVia: DiscoveredVia = 'excel_import',
): Promise<DiscoveryQueueItem[]> {
  const seen = new Set<string>();
  const items: DiscoveryQueueItem[] = [];
  for (const raw of urls) {
    const url = raw.trim();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    items.push(await repos.discovery.enqueue({ url, discoveredVia }));
  }
  return items;
}

export interface DrainResult {
  processed: number;
  activated: number;
  queuedForReview: number;
  rejected: number;
}

/**
 * Drain all pending discovery_queue items through the classifier and promote
 * them to sources. Malformed URLs are marked `rejected` rather than throwing so
 * one bad row can't stall the batch.
 */
export async function drainQueue(deps: OnboardDeps): Promise<DrainResult> {
  const pending = await deps.repos.discovery.listByStatus('pending');
  const result: DrainResult = {
    processed: 0,
    activated: 0,
    queuedForReview: 0,
    rejected: 0,
  };

  for (const item of pending) {
    if (!isValidHttpUrl(item.url)) {
      await deps.repos.discovery.markStatus(item.id, 'rejected', null);
      result.rejected++;
      continue;
    }
    const onboarded = await onboardUrl(item.url, item.discoveredVia, deps);
    await deps.repos.discovery.markStatus(item.id, 'classified', onboarded.sourceId);
    result.processed++;
    if (onboarded.status === 'active') result.activated++;
    else result.queuedForReview++;
  }

  return result;
}

function isValidHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Search-based discovery (spec §5, second bullet) — basic version.
// ---------------------------------------------------------------------------

export interface SearchProvider {
  /** Return candidate agent/listing URLs for a set of keywords + geography. */
  search(query: string): Promise<string[]>;
}

/**
 * Scheduled search discovery: for each geography × property-type keyword, query
 * the provider and enqueue any new hits as `search_discovery`. Deliberately a
 * thin wrapper so the actual search backend (SERP API, portal search, etc.) is
 * pluggable and can be scoped separately.
 */
export async function runSearchDiscovery(
  repos: Repositories,
  provider: SearchProvider,
  geographies: string[],
  propertyTypeKeywords: string[],
): Promise<DiscoveryQueueItem[]> {
  const found = new Set<string>();
  for (const geo of geographies) {
    for (const kw of propertyTypeKeywords) {
      const hits = await provider.search(`${kw} ${geo}`);
      for (const hit of hits) found.add(hit);
    }
  }
  return bulkEnqueue(repos, [...found], 'search_discovery');
}
