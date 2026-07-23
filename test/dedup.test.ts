import { describe, it, expect } from 'vitest';
import { addressTokens, tokenOverlap, findDuplicateGroups, type DedupCandidate } from '../src/dedup/listings.js';

describe('addressTokens / tokenOverlap', () => {
  it('normalises punctuation/case and drops filler words', () => {
    const a = addressTokens('Land Adjacent To 84, Longwood Gate, Huddersfield, HD3 4US');
    const b = addressTokens('Land adjacent to 84 Longwood Gate, Longwood, Huddersfield');
    expect(tokenOverlap(a, b)).toBeGreaterThan(0.5);
  });

  it('scores unrelated addresses low', () => {
    const a = addressTokens('50 Broadfield Road, Sheffield, S8 0XJ');
    const b = addressTokens('12 High Street, Manchester, M1 1AA');
    expect(tokenOverlap(a, b)).toBeLessThan(0.3);
  });
});

describe('findDuplicateGroups', () => {
  const base: Omit<DedupCandidate, 'key' | 'source' | 'address'> = {
    priceAmount: 160000,
    sizeSqft: 161172,
    geocodePrecision: 'exact',
  };

  it('groups the real Longwood Gate case (same price+size, overlapping address, different sources/precision)', () => {
    const candidates: DedupCandidate[] = [
      {
        ...base,
        key: 'a',
        source: 'Rightmove Commercial',
        address: 'Land Adjacent To 84, Longwood Gate, Longwood, Huddersfield, West Yorkshire, HD3 4US',
        geocodePrecision: 'exact',
      },
      {
        ...base,
        key: 'b',
        source: 'Rightmove Commercial',
        address: 'Land adjacent to 84 Longwood Gate, Longwood, Huddersfield',
        geocodePrecision: 'city-centroid',
      },
    ];
    const groups = findDuplicateGroups(candidates);
    expect(groups).toHaveLength(1);
    expect(groups[0]!.memberKeys.sort()).toEqual(['a', 'b']);
    // exact precision should win canonical over city-centroid
    expect(groups[0]!.canonicalKey).toBe('a');
  });

  it('picks a directly-scraped source over Rightmove when precision ties', () => {
    const candidates: DedupCandidate[] = [
      { ...base, key: 'direct', source: 'SMC Brownill Vickers', address: '1 Scotland Street, Sheffield, S3 7AT', geocodePrecision: 'postcode' },
      { ...base, key: 'rightmove', source: 'Rightmove Commercial', address: 'Unit 2 - Metis Building, 1 Scotland Street, Sheffield, S3 7AT', geocodePrecision: 'postcode' },
    ];
    const groups = findDuplicateGroups(candidates);
    expect(groups).toHaveLength(1);
    expect(groups[0]!.canonicalKey).toBe('direct');
  });

  it('does not merge two unrelated properties that coincidentally share a price and size', () => {
    const candidates: DedupCandidate[] = [
      { ...base, key: 'x', source: 'Rightmove Commercial', address: '50 Broadfield Road, Sheffield, S8 0XJ' },
      { ...base, key: 'y', source: 'Rightmove Commercial', address: '12 High Street, Manchester, M1 1AA' },
    ];
    expect(findDuplicateGroups(candidates)).toHaveLength(0);
  });

  it('ignores rows with no price or no size', () => {
    const candidates: DedupCandidate[] = [
      { key: 'a', source: 'X', address: 'Foo Street', priceAmount: 0, sizeSqft: 1000, geocodePrecision: 'exact' },
      { key: 'b', source: 'X', address: 'Foo Street', priceAmount: 100000, sizeSqft: null, geocodePrecision: 'exact' },
    ];
    expect(findDuplicateGroups(candidates)).toHaveLength(0);
  });

  it('handles a group of 3 (the Bramleys New North Road case)', () => {
    const candidates: DedupCandidate[] = [
      { key: 'a', source: 'Rightmove Commercial', address: 'Land to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE', priceAmount: 200000, sizeSqft: 11761, geocodePrecision: 'exact' },
      { key: 'b', source: 'Rightmove Commercial', address: 'Development Site to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE', priceAmount: 200000, sizeSqft: 11761, geocodePrecision: 'city-centroid' },
      { key: 'c', source: 'Rightmove Commercial', address: 'Land to Rear of 72 & 74 New North Road, Huddersfield', priceAmount: 200000, sizeSqft: 11761, geocodePrecision: 'city-centroid' },
    ];
    const groups = findDuplicateGroups(candidates);
    expect(groups).toHaveLength(1);
    expect(groups[0]!.memberKeys.sort()).toEqual(['a', 'b', 'c']);
    expect(groups[0]!.canonicalKey).toBe('a');
  });
});
