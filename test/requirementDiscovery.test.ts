import { describe, it, expect, afterEach, vi } from 'vitest';
import { createHarness, type Harness } from '../src/db/pglite.js';
import { classifyAndLogCandidate } from '../src/discovery/requirementDiscovery.js';

let h: Harness | undefined;
afterEach(async () => {
  await h?.close();
  h = undefined;
  vi.unstubAllGlobals();
});

describe('classifyAndLogCandidate — bot-challenge handling', () => {
  it('logs a 403 candidate as blocked, still writing sources + site_audits', async () => {
    h = await createHarness();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<html><body>Forbidden</body></html>', { status: 403 })),
    );

    const result = await classifyAndLogCandidate(h, { name: 'LoopNet UK', url: 'https://www.loopnet.co.uk/' });
    expect(result.outcome).toBe('blocked');
    expect(result.detail).toContain('403');

    const src = await h.asAdminBypass<{ status: string; classification: string; tos_flag: boolean }>(
      `select status, classification, tos_flag from sources where url = $1`,
      ['https://www.loopnet.co.uk/'],
    );
    expect(src.rows[0]!.status).toBe('pending_review');
    expect(src.rows[0]!.classification).toBe('needs_review');

    const audits = await h.asAdminBypass<{ decision: string; detected_structure: string }>(
      `select decision, detected_structure from site_audits`,
    );
    expect(audits.rows).toHaveLength(1);
    expect(audits.rows[0]!.decision).toBe('queued_for_review');
    expect(audits.rows[0]!.detected_structure).toContain('BLOCKED');

    const dq = await h.asAdminBypass<{ status: string }>(`select status from discovery_queue`);
    expect(dq.rows[0]!.status).toBe('classified');
  }, 15000);

  it('logs a 200-status Cloudflare interstitial as blocked, not misclassified as a real page', async () => {
    h = await createHarness();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response('<html><title>Just a moment...</title><body>Checking your browser before accessing</body></html>', {
            status: 200,
          }),
      ),
    );

    const result = await classifyAndLogCandidate(h, { name: 'Zoopla Commercial', url: 'https://www.zoopla.co.uk/for-sale/commercial/' });
    expect(result.outcome).toBe('blocked');
    expect(result.detail).toMatch(/bot-challenge/i);
  }, 15000);

  it('a real page classifies normally (not blocked)', async () => {
    h = await createHarness();
    const html = `<html><body>${'<div>office to let, freehold</div>'.repeat(30)}</body></html>`;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        String(url).endsWith('/robots.txt')
          ? new Response('', { status: 404 })
          : new Response(html, { status: 200 }),
      ),
    );

    const result = await classifyAndLogCandidate(h, { name: 'Example Agent', url: 'https://agent.example.com/' });
    expect(result.outcome).toBe('classified');
    expect(result.classification).toBe('static_html');
  }, 15000);
});
