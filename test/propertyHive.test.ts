import { describe, it, expect } from 'vitest';
import { normalizePH, fetchPropertyHiveListings } from '../src/scrapers/propertyHive.js';

// Mirrors the live PropertyHive REST shape verified on SMC Brownill Vickers.
const commercialForSale = {
  id: 380030,
  title: { rendered: '1 Scotland Street, Sheffield' },
  link: 'https://smcbrownillvickers.com/properties/380030-1-scotland-street-sheffield/',
  department: 'commercial',
  availability: 'For Sale',
  on_market: 'yes',
  address_street: '1 Scotland Street',
  address_three: 'Sheffield',
  address_postcode: 'S3 7AT',
  price_from: '335000',
  price_qualifier: '',
  floor_area_from: '2342.65',
  floor_area_units: 'sqft',
  features: ['Freehold city centre office'],
  excerpt: { rendered: '<p>Prominent corner office building.</p>' },
  property_type: 'Office',
  images: [
    {
      url: 'https://smcbrownillvickers.com/wp-content/uploads/2026/07/photo-scaled.jpg',
      large: 'https://smcbrownillvickers.com/wp-content/uploads/2026/07/photo-1024x768.jpg',
      medium: 'https://smcbrownillvickers.com/wp-content/uploads/2026/07/photo-300x225.jpg',
      thumbnail: 'https://smcbrownillvickers.com/wp-content/uploads/2026/07/photo-150x150.jpg',
    },
  ],
};

const toLet = { ...commercialForSale, id: 2, availability: 'To Let' };
const residential = { ...commercialForSale, id: 3, department: 'residential-sales' };
const offMarket = { ...commercialForSale, id: 4, on_market: 'no' };
const sqmListing = {
  ...commercialForSale,
  id: 5,
  floor_area_from: '92',
  floor_area_units: 'sqm',
};
const noPhotoListing = { ...commercialForSale, id: 6, images: [] };
const thumbnailOnlyListing = {
  ...commercialForSale,
  id: 7,
  images: [{ thumbnail: 'https://smcbrownillvickers.com/wp-content/uploads/2026/07/only-150x150.jpg' }],
};

describe('propertyHive scraper', () => {
  it('keeps only on-market commercial For Sale rows', () => {
    const out = normalizePH([commercialForSale, toLet, residential, offMarket] as never[]);
    expect(out.map((l) => l.id)).toEqual([380030]);
  });

  it('normalises address, price and sqft; strips excerpt HTML', () => {
    const [l] = normalizePH([commercialForSale] as never[]);
    expect(l).toMatchObject({
      address: '1 Scotland Street, Sheffield',
      postcode: 'S3 7AT',
      priceAmount: 335000,
      priceDisplay: '£335,000',
      sizeSqft: 2343,
      url: 'https://smcbrownillvickers.com/properties/380030-1-scotland-street-sheffield/',
      propertyType: 'Office',
      imageUrl: 'https://smcbrownillvickers.com/wp-content/uploads/2026/07/photo-300x225.jpg',
    });
    expect(l!.text).toContain('Prominent corner office building');
    expect(l!.text).not.toContain('<p>');
  });

  it('imageUrl falls back to thumbnail when medium is absent, and is null with no photos', () => {
    const [withThumbOnly] = normalizePH([thumbnailOnlyListing] as never[]);
    expect(withThumbOnly!.imageUrl).toBe('https://smcbrownillvickers.com/wp-content/uploads/2026/07/only-150x150.jpg');
    const [noPhoto] = normalizePH([noPhotoListing] as never[]);
    expect(noPhoto!.imageUrl).toBeNull();
  });

  it('converts square-metre floor areas to sq ft', () => {
    const [l] = normalizePH([sqmListing] as never[]);
    expect(l!.sizeSqft).toBe(990); // 92 sqm ≈ 990 sq ft
  });

  it('paginates using X-WP-TotalPages', async () => {
    const urls: string[] = [];
    const fetchImpl = (async (url: string) => {
      urls.push(String(url));
      const page = Number(/[?&]page=(\d+)/.exec(String(url))![1]);
      const body = JSON.stringify(page === 1 ? [commercialForSale] : [{ ...commercialForSale, id: 999 }]);
      return new Response(body, { status: 200, headers: { 'x-wp-totalpages': '2' } });
    }) as typeof fetch;
    const pull = await fetchPropertyHiveListings(
      { name: 'Test', baseUrl: 'https://x.example', postType: 'property' },
      { fetchImpl, delayMs: 1 },
    );
    expect(urls).toHaveLength(2);
    expect(pull.totalOnApi).toBe(2);
    expect(pull.listings.map((l) => l.id).sort()).toEqual([380030, 999]);
  });
});
