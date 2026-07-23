import { describe, it, expect } from 'vitest';
import { MemoryRepositories } from '../src/db/memory.js';
import { onboardUrl } from '../src/pipeline/onboard.js';
import { bulkEnqueue, drainQueue, runSearchDiscovery } from '../src/discovery/discovery.js';
import type { SiteProbe } from '../src/types.js';

const NOW = () => new Date('2026-07-09T00:00:00.000Z');

function fixtureProbe(url: string): Promise<SiteProbe> {
  // Barnsdales-style known-good baseline (spec §7 Day B): embedded JSON.
  if (url.includes('barnsdales')) {
    const rawHtml = `<html><head><script>window.properties = ${JSON.stringify({
      items: [
        { price: 500000, address: '1 High St', size: 2000 },
        { price: 750000, address: '2 High St', size: 3000 },
      ],
    })};</script></head><body>x</body></html>`;
    return Promise.resolve({ url, rawHtml, renderedDom: rawHtml, networkLog: [] });
  }
  if (url.includes('restricted')) {
    return Promise.resolve({
      url,
      rawHtml: '<html><body>x</body></html>',
      renderedDom: '<html><body>x</body></html>',
      networkLog: [],
      robotsTxt: 'User-agent: *\nDisallow: /\n',
    });
  }
  const html = `<html><body>${'<div>content</div>'.repeat(50)}</body></html>`;
  return Promise.resolve({ url, rawHtml: html, renderedDom: html, networkLog: [] });
}

function deps(repos: MemoryRepositories) {
  return { repos, approvalThreshold: 0.8, now: NOW, probe: fixtureProbe };
}

describe('onboarding pipeline', () => {
  it('onboards a known-good source to active and logs an audit', async () => {
    const repos = new MemoryRepositories();
    const out = await onboardUrl('https://barnsdales.co.uk/', 'manual', deps(repos));
    expect(out.classification.classification).toBe('embedded_json');
    expect(out.status).toBe('active');
    const audits = await repos.audits.listBySource(out.sourceId);
    expect(audits).toHaveLength(1);
    expect(audits[0]!.decision).toBe('auto_approved');
  });

  it('routes a robots-restricted source to pending_review', async () => {
    const repos = new MemoryRepositories();
    const out = await onboardUrl('https://restricted.example.com/', 'manual', deps(repos));
    expect(out.classification.tosFlag).toBe(true);
    expect(out.status).toBe('pending_review');
  });

  it('re-onboarding the same URL updates in place (upsert by url)', async () => {
    const repos = new MemoryRepositories();
    const first = await onboardUrl('https://barnsdales.co.uk/', 'manual', deps(repos));
    const second = await onboardUrl('https://barnsdales.co.uk/', 'manual', deps(repos));
    expect(second.sourceId).toBe(first.sourceId);
  });
});

describe('discovery bulk import + drain', () => {
  it('imports URLs into the queue and drains them through the classifier', async () => {
    const repos = new MemoryRepositories();
    const urls = [
      'https://barnsdales.co.uk/',
      'https://restricted.example.com/',
      'https://normal-agent.example.com/',
      'not-a-url',
      'https://barnsdales.co.uk/', // duplicate, deduped
    ];
    const queued = await bulkEnqueue(repos, urls);
    expect(queued).toHaveLength(4); // duplicate removed

    const result = await drainQueue(deps(repos));
    expect(result.processed).toBe(3); // one rejected as invalid url
    expect(result.rejected).toBe(1);
    expect(result.activated).toBeGreaterThanOrEqual(1); // barnsdales
    expect(result.queuedForReview).toBeGreaterThanOrEqual(1); // restricted
  });
});

describe('search discovery', () => {
  it('enqueues hits from a search provider as search_discovery', async () => {
    const repos = new MemoryRepositories();
    const provider = {
      search: async (q: string) => [`https://found.example.com/?q=${encodeURIComponent(q)}`],
    };
    const items = await runSearchDiscovery(repos, provider, ['Leeds'], ['office']);
    expect(items).toHaveLength(1);
    expect(items[0]!.discoveredVia).toBe('search_discovery');
    const pending = await repos.discovery.listByStatus('pending');
    expect(pending).toHaveLength(1);
  });
});
