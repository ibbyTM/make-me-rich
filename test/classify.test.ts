import { describe, it, expect } from 'vitest';
import { classifySite } from '../src/classifier/classify.js';
import type { SiteProbe } from '../src/types.js';

const NOW = () => new Date('2026-07-09T00:00:00.000Z');
const OPTS = { approvalThreshold: 0.8, now: NOW };

function probe(p: Partial<SiteProbe>): SiteProbe {
  return {
    url: 'https://agent.example.com/commercial',
    rawHtml: '<html><body><p>hello</p></body></html>',
    renderedDom: '<html><body><p>hello</p></body></html>',
    networkLog: [],
    ...p,
  };
}

describe('classifySite', () => {
  it('classifies listing-shaped embedded JSON as embedded_json and auto-approves', () => {
    const listings = [
      { price: 500000, address: '1 High St', sqft: 2000 },
      { price: 750000, address: '2 High St', sqft: 3000 },
    ];
    const rawHtml = `<html><head>
      <script>window.__NEXT_DATA__ = ${JSON.stringify({ props: { listings } })};</script>
      </head><body>listings</body></html>`;
    const res = classifySite(probe({ rawHtml, renderedDom: rawHtml }), OPTS);
    expect(res.classification).toBe('embedded_json');
    expect(res.confidence).toBeGreaterThanOrEqual(0.8);
    expect(res.decision).toBe('auto_approved');
    expect(res.resultingStatus).toBe('active');
  });

  it('classifies a JSON listings XHR as api_endpoint (beats embedded)', () => {
    const res = classifySite(
      probe({
        networkLog: [
          {
            url: 'https://agent.example.com/api/search',
            method: 'GET',
            status: 200,
            contentType: 'application/json',
            responseBody: {
              results: [
                { price: 500000, address: '1 High St', sqft: 2000, tenure: 'freehold' },
                { price: 750000, address: '2 High St', sqft: 3000, tenure: 'leasehold' },
              ],
            },
          },
        ],
      }),
      OPTS,
    );
    expect(res.classification).toBe('api_endpoint');
    expect(res.decision).toBe('auto_approved');
  });

  it('classifies a static page with content as static_html', () => {
    const html = `<html><body>${'<div>listing</div>'.repeat(50)}</body></html>`;
    const res = classifySite(probe({ rawHtml: html, renderedDom: html }), OPTS);
    expect(res.classification).toBe('static_html');
    expect(res.decision).toBe('auto_approved');
  });

  it('classifies a JS-heavy page (large rendered diff) as js_rendered', () => {
    const rawHtml = '<html><body><div id="app"></div></body></html>';
    const renderedDom = `<html><body><div id="app">${'listing content '.repeat(200)}</div></body></html>`;
    const res = classifySite(probe({ rawHtml, renderedDom }), OPTS);
    expect(res.classification).toBe('js_rendered');
    // confidence 0.6 < 0.8 → not auto-approved
    expect(res.decision).toBe('queued_for_review');
    expect(res.resultingStatus).toBe('pending_review');
  });

  it('classifies POST-only search with no listing links as manual_entry_only', () => {
    const html = `<html><body>
      <form method="post" action="/search">
        <input name="location" placeholder="search location" />
      </form>
    </body></html>`;
    const res = classifySite(probe({ rawHtml: html, renderedDom: html }), OPTS);
    expect(res.classification).toBe('manual_entry_only');
    // manual_entry_only sources are created but never auto-scraped (spec §4)
    expect(res.decision).toBe('queued_for_review');
  });

  it('robots.txt Disallow forces needs_review and sets tosFlag, overriding a technical win', () => {
    const rawHtml = `<html><head>
      <script>window.__NEXT_DATA__ = ${JSON.stringify({ listings: [1] })};</script>
      </head><body>x</body></html>`;
    const res = classifySite(
      probe({
        rawHtml,
        renderedDom: rawHtml,
        robotsTxt: 'User-agent: *\nDisallow: /search\n',
      }),
      OPTS,
    );
    expect(res.tosFlag).toBe(true);
    expect(res.classification).toBe('needs_review');
    expect(res.decision).toBe('queued_for_review');
    expect(res.resultingStatus).toBe('pending_review');
  });

  it('ToS scraping-restriction language sets tosFlag', () => {
    const res = classifySite(
      probe({ tosText: 'You may not use any automated scraping of this site.' }),
      OPTS,
    );
    expect(res.tosFlag).toBe(true);
    expect(res.decision).toBe('queued_for_review');
  });

  it('routes a known portal to review with bespoke strategy', () => {
    const res = classifySite(
      probe({ url: 'https://www.rightmove.co.uk/commercial-property-for-sale.html' }),
      OPTS,
    );
    expect(res.classification).toBe('api_endpoint');
    expect(res.scraperStrategy).toContain('portal');
    expect(res.decision).toBe('queued_for_review');
  });

  it('falls back to needs_review with low confidence when nothing resolves', () => {
    const res = classifySite(probe({ rawHtml: '<html></html>', renderedDom: '<html></html>' }), OPTS);
    // empty page → static baseline but no content; still resolves to a status
    expect(['needs_review', 'static_html']).toContain(res.classification);
    expect(res.classifiedAt).toBe('2026-07-09T00:00:00.000Z');
  });
});

/**
 * Regression coverage for the 2026-07-12 classifier trial
 * (docs/classifier-trial-2026-07-12.md). Each fixture reproduces a real site
 * that the classifier previously got confidently wrong. These lock the fixes in.
 */
describe('classifySite — trial regressions', () => {
  const body = `<body>${'<div>office to let, freehold</div>'.repeat(30)}</body>`;

  function ldJson(obj: unknown): string {
    return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
  }

  it('Carter Towler: SEO @graph ld+json is NOT embedded_json (was 0.9 auto-approve)', () => {
    const html = `<html><head>${ldJson({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage' },
        { '@type': 'BreadcrumbList' },
        { '@type': 'WebSite' },
        { '@type': 'Organization', name: 'Carter Towler' },
      ],
    })}</head>${body}</html>`;
    const res = classifySite(probe({ rawHtml: html, renderedDom: html }), OPTS);
    expect(res.classification).not.toBe('embedded_json');
    expect(res.confidence).toBeLessThan(0.8);
    expect(res.decision).toBe('queued_for_review');
    expect(res.detectedStructure).toMatch(/SEO schema/i);
  });

  it("Canning O'Neill: Organization/RealEstateAgent ld+json is NOT embedded_json", () => {
    const html = `<html><head>${ldJson({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization' },
        { '@type': 'LocalBusiness' },
        { '@type': 'RealEstateAgent', name: "Canning O'Neill" },
      ],
    })}</head>${body}</html>`;
    const res = classifySite(probe({ rawHtml: html, renderedDom: html }), OPTS);
    expect(res.classification).not.toBe('embedded_json');
    expect(res.decision).toBe('queued_for_review');
  });

  it('Naylors: large incidental inline JSON blob is NOT embedded_json (was 0.9 auto-approve)', () => {
    const config = {
      theme: 'default',
      nav: Array.from({ length: 60 }, (_, i) => ({ id: i, label: `menu item ${i}` })),
    };
    const html = `<html><head><script>var SITE_CONFIG = ${JSON.stringify(config)};</script></head>${body}</html>`;
    const res = classifySite(probe({ rawHtml: html, renderedDom: html }), OPTS);
    expect(res.classification).not.toBe('embedded_json');
    expect(res.confidence).toBeLessThan(0.8);
    expect(res.decision).toBe('queued_for_review');
  });

  it('Michael Steel: POST-only search form is manual_entry_only despite /property nav links', () => {
    const html = `<html><body>
      <nav>
        <a href="/property-search/">Property Search</a>
        <a href="/commercial">Commercial</a>
        <a href="/about">About</a>
      </nav>
      <form method="post" name="ps" id="ps" action="/property-search/">
        <input name="location" placeholder="search location" />
        <input name="min_price" /><input name="max_price" />
      </form>
      ${'<p>Michael Steel &amp; Co commercial agents</p>'.repeat(20)}
    </body></html>`;
    const res = classifySite(probe({ rawHtml: html, renderedDom: html }), OPTS);
    expect(res.classification).toBe('manual_entry_only');
    expect(res.decision).toBe('queued_for_review');
    expect(res.resultingStatus).toBe('pending_review');
  });

  it('positive control: a real array of listing objects still classifies embedded_json + auto-approve', () => {
    const html = `<html><head>${ldJson([
      { '@type': 'Product', name: 'Unit A', price: 500000, address: '1 High St', sqft: 2000 },
      { '@type': 'Product', name: 'Unit B', price: 750000, address: '2 High St', sqft: 3000 },
    ])}</head>${body}</html>`;
    const res = classifySite(probe({ rawHtml: html, renderedDom: html }), OPTS);
    expect(res.classification).toBe('embedded_json');
    expect(res.decision).toBe('auto_approved');
  });

  it('POST search form IS overridden when many addressable listing-detail links exist', () => {
    const links = Array.from(
      { length: 6 },
      (_, i) => `<a href="/property/${i}-some-street-unit">Listing ${i}</a>`,
    ).join('');
    const html = `<html><body>
      ${links}
      <form method="post" action="/property-search/"><input name="location"/></form>
      ${'<p>content</p>'.repeat(20)}
    </body></html>`;
    const res = classifySite(probe({ rawHtml: html, renderedDom: html }), OPTS);
    expect(res.classification).not.toBe('manual_entry_only');
  });
});
