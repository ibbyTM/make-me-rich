import { describe, it, expect } from 'vitest';
import {
  extractSearchResults,
  normalizeProperties,
  parseSqft,
  fetchCityListings,
  isGoingConcern,
} from '../src/scrapers/rightmoveCommercial.js';

// Mirrors the live structure confirmed 2026-07-14:
// props.pageProps.searchResults.{resultCount, pagination.total, properties[]}
function pageHtml(properties: unknown[], resultCount = properties.length, pages = 1): string {
  const next = {
    props: { pageProps: { searchResults: { resultCount, pagination: { total: pages }, properties } } },
  };
  return `<html><body><div>cards</div><script id="__NEXT_DATA__" type="application/json">${JSON.stringify(next)}</script></body></html>`;
}

const office = {
  id: 747152224116992,
  displayAddress: '1-2 Deanhurst Park, Gelderd Road, Leeds',
  price: { amount: 725000, displayPrices: [{ displayPrice: '£725,000', displayPriceQualifier: '' }] },
  displaySize: '5,242 sq. ft.',
  propertySubType: 'Office',
  propertyTypeFullDescription: 'Office for sale',
  summary: 'Modern office building with 4 suites.',
  keyFeatures: ['Freehold', 'Near J27 of the M62'],
  tenure: 'FREEHOLD',
  customer: { branchId: 281750, branchDisplayName: 'Crans Property, Leeds' },
  commercial: true,
  residential: false,
  transactionType: 'buy',
  auction: false,
  displayStatus: '',
  propertyUrl: '/properties/747152224116992',
};

const landAcres = {
  ...office,
  id: 111,
  displayAddress: 'Development land, Sheffield',
  displaySize: '2.5 acres',
  propertySubType: 'Land',
  customer: { branchDisplayName: 'Another Agent, Sheffield' },
};

const residentialRow = { ...office, id: 222, commercial: false, residential: true };

describe('rightmove commercial scraper', () => {
  it('extracts searchResults from __NEXT_DATA__ and errors clearly when shape moves', () => {
    const sr = extractSearchResults(pageHtml([office], 222, 10));
    expect(sr.resultCount).toBe(222);
    expect(sr.pageCount).toBe(10);
    expect(sr.properties).toHaveLength(1);
    expect(() => extractSearchResults('<html>no data</html>')).toThrow(/__NEXT_DATA__/);
    expect(() =>
      extractSearchResults('<script id="__NEXT_DATA__" type="application/json">{"props":{}}</script>'),
    ).toThrow(/searchResults/);
  });

  it('normalises listings: price, sqft, agent, absolute url', () => {
    const [l] = normalizeProperties([office as never], 'Leeds', 'Yorkshire');
    expect(l).toMatchObject({
      id: '747152224116992',
      priceAmount: 725000,
      priceDisplay: '£725,000',
      sizeSqft: 5242,
      subType: 'Office',
      agent: 'Crans Property, Leeds',
      city: 'Leeds',
      region: 'Yorkshire',
      url: 'https://www.rightmove.co.uk/properties/747152224116992',
    });
    expect(l!.text).toContain('FREEHOLD');
  });

  it('parses sq ft but leaves acres as null', () => {
    expect(parseSqft('5,242 sq. ft.')).toBe(5242);
    expect(parseSqft('900 sqft')).toBe(900);
    expect(parseSqft('2.5 acres')).toBeNull();
    expect(parseSqft(undefined)).toBeNull();
    const [land] = normalizeProperties([landAcres as never], 'Sheffield', 'Yorkshire');
    expect(land!.sizeSqft).toBeNull();
    expect(land!.sizeLabel).toBe('2.5 acres');
  });

  it('drops residential rows', () => {
    const out = normalizeProperties([office, residentialRow] as never[], 'Leeds', 'Yorkshire');
    expect(out.map((l) => l.id)).toEqual(['747152224116992']);
  });

  it('flags business-for-sale going concerns but keeps premises/development stock', () => {
    // observed live subtypes (2026-07-14)
    for (const st of ['Cafe', 'Restaurant', 'Convenience Store', 'Guest House', 'Takeaway', 'Hairdresser / Barber Shop']) {
      expect(isGoingConcern({ subType: st }), st).toBe(true);
    }
    // pubs/bars/hotels are conversion-scale assets — kept in (decision 2026-07-14)
    for (const st of [
      'Pub',
      'Hotel',
      'Bar / Nightclub',
      'Office',
      'Light Industrial',
      'Retail Property (high street)',
      'Commercial Development',
      'Residential Development',
      'Mixed Use',
      'Land',
      'Warehouse',
      'Childcare Facility',
      'Commercial Property',
      'Shop',
    ]) {
      expect(isGoingConcern({ subType: st }), st).toBe(false);
    }
  });

  it('paginates by index and dedupes featured repeats across pages', async () => {
    const page2Only = { ...office, id: 333, displayAddress: 'Second page office, Leeds' };
    const urls: string[] = [];
    const fetchImpl = (async (url: string) => {
      urls.push(String(url));
      const idx = /index=(\d+)/.exec(String(url))![1];
      // the featured `office` repeats on both pages; 333 appears only on page 2
      const props = idx === '0' ? [office] : [office, page2Only];
      return new Response(pageHtml(props, 40, 2), { status: 200 });
    }) as typeof fetch;

    const pull = await fetchCityListings(
      { city: 'Leeds', region: 'Yorkshire', locationId: '787' },
      { fetchImpl, delayMs: 1, maxPagesPerCity: 5 },
    );
    expect(urls).toHaveLength(2); // pageCount 2 < maxPages 5
    expect(urls[1]).toContain('index=24');
    expect(pull.listings.map((l) => l.id).sort()).toEqual(['333', '747152224116992']);
    expect(pull.resultCount).toBe(40);
  });
});
