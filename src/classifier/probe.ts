/**
 * Site probing — the I/O half of classification (spec §3 steps 1, 2, 7).
 *
 * Gathers a `SiteProbe` for a URL:
 *   - raw HTML via a plain HTTP GET (no JS)
 *   - rendered DOM + network log via a headless browser (Playwright, optional)
 *   - robots.txt and a best-effort terms-of-use page
 *
 * Playwright is an optional dependency. If it is not installed we degrade
 * gracefully: `renderedDom` falls back to the raw HTML and `networkLog` is
 * empty, so the classifier still produces a (lower-signal) result rather than
 * throwing. This keeps the pipeline runnable in minimal environments and the
 * pure classifier fully testable without a browser.
 */

import type { NetworkEntry, SiteProbe } from '../types.js';

const UA =
  'Mozilla/5.0 (compatible; CAIS-SourceOnboarding/0.1; +https://example.invalid/bot)';

async function httpGet(url: string, timeoutMs = 15000): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' },
      signal: controller.signal,
      redirect: 'follow',
    });
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchRobots(url: string): Promise<string | undefined> {
  try {
    const base = new URL(url);
    const robots = `${base.protocol}//${base.host}/robots.txt`;
    const res = await fetch(robots, { headers: { 'user-agent': UA } });
    if (!res.ok) return undefined;
    return await res.text();
  } catch {
    return undefined;
  }
}

/** Best-effort: try a couple of common terms-of-use paths. */
async function fetchTos(url: string): Promise<string | undefined> {
  const candidates = ['/terms', '/terms-of-use', '/terms-and-conditions', '/legal'];
  for (const path of candidates) {
    try {
      const base = new URL(url);
      const res = await fetch(`${base.protocol}//${base.host}${path}`, {
        headers: { 'user-agent': UA },
      });
      if (res.ok) {
        const text = await res.text();
        if (text.trim().length > 0) return text;
      }
    } catch {
      // try next candidate
    }
  }
  return undefined;
}

interface RenderResult {
  dom: string;
  networkLog: NetworkEntry[];
}

/**
 * Headless render via Playwright. Dynamically imported so the package stays an
 * optional dependency. Returns null if Playwright is unavailable.
 */
async function renderHeadless(url: string, timeoutMs = 30000): Promise<RenderResult | null> {
  let chromium: unknown;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ chromium } = (await import('playwright')) as any);
  } catch {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const browser = await (chromium as any).launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
  });
  try {
    const page = await browser.newPage({ userAgent: UA });
    const networkLog: NetworkEntry[] = [];

    page.on('response', async (response: any) => {
      try {
        const req = response.request();
        const type = req.resourceType();
        if (type !== 'xhr' && type !== 'fetch') return;
        const contentType = response.headers()['content-type'] ?? '';
        let responseBody: unknown;
        if (/json/i.test(contentType)) {
          responseBody = await response.json().catch(() => undefined);
        }
        networkLog.push({
          url: response.url(),
          method: req.method(),
          status: response.status(),
          contentType,
          responseBody,
        });
      } catch {
        // ignore individual response capture failures
      }
    });

    await page.goto(url, { waitUntil: 'networkidle', timeout: timeoutMs });
    const dom = await page.content();
    return { dom, networkLog };
  } finally {
    await browser.close();
  }
}

/** Gather a full `SiteProbe` for a URL (spec §3 steps 1, 2, 7). */
export async function probeSite(url: string): Promise<SiteProbe> {
  const [rawHtml, rendered, robotsTxt, tosText] = await Promise.all([
    httpGet(url),
    renderHeadless(url),
    fetchRobots(url),
    fetchTos(url),
  ]);

  return {
    url,
    rawHtml,
    renderedDom: rendered?.dom ?? rawHtml,
    networkLog: rendered?.networkLog ?? [],
    robotsTxt,
    tosText,
  };
}
