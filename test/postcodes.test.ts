import { describe, it, expect } from 'vitest';
import {
  extractPostcode,
  extractTrailingParen,
  bulkGeocodePostcodes,
  outcodeCentroid,
} from '../src/geo/postcodes.js';

describe('extractPostcode', () => {
  it('extracts a trailing postcode from a Barnsdales-style address', () => {
    expect(extractPostcode('Castleford, WF10 5HX')).toBe('WF10 5HX');
  });

  it('extracts a trailing postcode from a PropertyHive-style address', () => {
    expect(extractPostcode('1 Scotland Street, Sheffield, S3 7AT')).toBe('S3 7AT');
  });

  it('handles a postcode with no space and normalises it to one', () => {
    expect(extractPostcode('Somewhere, WF105HX')).toBe('WF10 5HX');
  });

  it('returns null when there is no postcode', () => {
    expect(extractPostcode('1-2 Deanhurst Park, Gelderd Road, Leeds')).toBeNull();
  });
});

describe('extractTrailingParen', () => {
  it('extracts the city from a Rightmove-style address', () => {
    expect(extractTrailingParen('1-2 Deanhurst Park, Gelderd Road, Leeds (Leeds)')).toBe('Leeds');
  });

  it('returns null with no trailing paren group', () => {
    expect(extractTrailingParen('Castleford, WF10 5HX')).toBeNull();
  });
});

describe('bulkGeocodePostcodes', () => {
  it('maps found postcodes to lat/lon and omits unresolved ones', async () => {
    const fetchImpl = (async () =>
      new Response(
        JSON.stringify({
          result: [
            { query: 'WF10 5HX', result: { latitude: 53.7, longitude: -1.35 } },
            { query: 'BOGUS', result: null },
          ],
        }),
        { status: 200 },
      )) as typeof fetch;
    const map = await bulkGeocodePostcodes(['WF10 5HX', 'BOGUS'], fetchImpl);
    expect(map.get('WF10 5HX')).toEqual({ lat: 53.7, lon: -1.35 });
    expect(map.has('BOGUS')).toBe(false);
  });

  it('chunks requests at 100 postcodes', async () => {
    const bodies: string[] = [];
    const fetchImpl = (async (_url: string, init?: RequestInit) => {
      bodies.push(String(init?.body));
      const postcodes = JSON.parse(String(init?.body)).postcodes as string[];
      return new Response(
        JSON.stringify({ result: postcodes.map((q) => ({ query: q, result: { latitude: 1, longitude: 1 } })) }),
        { status: 200 },
      );
    }) as typeof fetch;
    const postcodes = Array.from({ length: 150 }, (_, i) => `PC${i}`);
    await bulkGeocodePostcodes(postcodes, fetchImpl);
    expect(bodies).toHaveLength(2);
  });
});

describe('outcodeCentroid', () => {
  it('returns the centroid for a known outcode', async () => {
    const fetchImpl = (async () =>
      new Response(JSON.stringify({ result: { latitude: 53.79, longitude: -1.55 } }), { status: 200 })) as typeof fetch;
    expect(await outcodeCentroid('LS1', fetchImpl)).toEqual({ lat: 53.79, lon: -1.55 });
  });

  it('returns null for a 404', async () => {
    const fetchImpl = (async () => new Response('', { status: 404 })) as typeof fetch;
    expect(await outcodeCentroid('ZZ99', fetchImpl)).toBeNull();
  });
});
