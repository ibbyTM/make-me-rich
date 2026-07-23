import { describe, it, expect } from 'vitest';
import {
  extractProperties,
  filterCommercialFreehold,
} from '../src/scrapers/barnsdales.js';

// Mirrors the real page: `var properties = [ … ]`, including a string value that
// contains a `]` to exercise the string-aware bracket scan.
const props = [
  {
    id: 1,
    location: 'Doncaster',
    postcode: 'DN1 3EA',
    name: '2776 sqft',
    min_size: 2776,
    max_size: 2776,
    residential: false,
    status: 'Available',
    freehold: true,
    freehold_from: 425000,
    freehold_to: 425000,
    freehold_price: 'Offers in the region of £425,000 [8% yield]',
    categories: ['Investment - Mixed use'],
    media: [
      { base: 'https://s3.eu-west-2.amazonaws.com/altcms/barnsdales/media/1/conversions/photo-' },
    ],
  },
  {
    id: 2,
    location: 'Leeds',
    postcode: 'LS1 1AA',
    name: '900 sqft',
    min_size: 900,
    max_size: 900,
    residential: true, // residential — excluded
    status: 'Available',
    freehold: true,
    freehold_from: 200000,
    freehold_to: 200000,
    freehold_price: '£200,000',
    categories: ['Residential'],
  },
  {
    id: 3,
    location: 'Sheffield',
    postcode: 'S1 2AA',
    name: '5000 sqft',
    min_size: 5000,
    max_size: 5000,
    residential: false,
    status: 'Under Offer', // wrong status — excluded
    freehold: true,
    freehold_from: 800000,
    freehold_to: 800000,
    freehold_price: '£800,000',
    categories: ['Office'],
  },
  {
    id: 4,
    location: 'Bradford',
    postcode: 'BD1 1AA',
    name: '3000 sqft',
    min_size: 3000,
    max_size: 3000,
    residential: false,
    status: 'Coming Soon',
    freehold: false,
    freehold_from: null, // leasehold only — excluded
    freehold_to: null,
    freehold_price: null,
    leasehold_from: 24000,
    categories: ['Office'],
  },
  {
    id: 5,
    location: 'Castleford',
    postcode: 'WF10 5HX',
    name: '1.1 acres',
    min_size: 1,
    max_size: 1,
    residential: false,
    status: 'Coming Soon',
    freehold: true,
    freehold_from: 600000,
    freehold_to: 600000,
    freehold_price: '£600,000',
    categories: ['Land', 'Mixed Use'],
  },
];

const html = `<html><body><script>
  window.dataLayer = [];
  var properties = ${JSON.stringify(props)};
  console.log('loaded');
</script></body></html>`;

describe('barnsdales scraper', () => {
  it('extracts the full properties array despite brackets inside strings', () => {
    const all = extractProperties(html);
    expect(all).toHaveLength(5);
    expect(all[0]!.freehold_price).toContain('[8% yield]');
  });

  it('keeps only commercial freehold Available/Coming Soon listings', () => {
    const listings = filterCommercialFreehold(extractProperties(html));
    // id 1 (Doncaster, freehold, Available) and id 5 (Castleford, freehold, Coming Soon)
    expect(listings.map((l) => l.id).sort()).toEqual([1, 5]);
  });

  it('reports sqft numerically but leaves acreage size as null', () => {
    const listings = filterCommercialFreehold(extractProperties(html));
    const doncaster = listings.find((l) => l.id === 1)!;
    const castleford = listings.find((l) => l.id === 5)!;
    expect(doncaster.sizeSqft).toBe(2776);
    expect(doncaster.sizeLabel).toBe('2776 sqft');
    expect(doncaster.url).toBe('https://www.barnsdales.co.uk/properties/1');
    expect(castleford.sizeSqft).toBeNull(); // "1.1 acres" is not sq ft
    expect(castleford.sizeLabel).toBe('1.1 acres');
  });

  it('builds the image URL from media[0].base, and returns null when there is no media', () => {
    const listings = filterCommercialFreehold(extractProperties(html));
    const doncaster = listings.find((l) => l.id === 1)!;
    const castleford = listings.find((l) => l.id === 5)!;
    expect(doncaster.imageUrl).toBe(
      'https://s3.eu-west-2.amazonaws.com/altcms/barnsdales/media/1/conversions/photo-show.jpg',
    );
    expect(castleford.imageUrl).toBeNull();
  });

  it('throws a clear error if the embedded array is missing', () => {
    expect(() => extractProperties('<html>no data here</html>')).toThrow(/var properties/);
  });
});
