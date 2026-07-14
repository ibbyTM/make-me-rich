import { describe, it, expect } from 'vitest';
import { stageZeroFilter } from '../src/filter/stageZero.js';
import type { Listing, Requirement } from '../src/types.js';

const requirements: Requirement[] = [
  {
    id: 'citywide',
    name: 'Citywide Investors',
    active: true,
    geographies: ['london', 'manchester'],
    minSize: 1000,
    budgetRange: [250000, 2000000],
    keywords: ['office'],
  },
  {
    id: 'educating',
    name: 'Educating Excellence',
    active: true,
    geographies: ['leeds'],
    keywords: ['former place of worship', 'school'],
  },
  {
    id: 'inactive',
    name: 'Dormant',
    active: false,
    geographies: ['london'],
  },
];

const OPTS = { minimumBar: 2 };

describe('stageZeroFilter', () => {
  it('passes a listing that clears the bar on multiple criteria', () => {
    const listing: Listing = {
      sourceId: 's1',
      externalId: 'l1',
      geography: 'London',
      size: 5000,
      price: 900000,
      text: 'Freehold office building',
    };
    const res = stageZeroFilter(listing, requirements, OPTS);
    expect(res.pass).toBe(true);
    expect(res.score).toBeGreaterThanOrEqual(2);
    expect(res.matchedRequirementId).toBe('citywide');
  });

  it('discards an obviously-irrelevant listing (no API call would be made)', () => {
    const listing: Listing = {
      sourceId: 's1',
      externalId: 'l2',
      geography: 'Cardiff',
      size: 200,
      price: 50,
      text: 'small retail unit',
    };
    const res = stageZeroFilter(listing, requirements, OPTS);
    expect(res.pass).toBe(false);
    expect(res.score).toBeLessThan(2);
  });

  it('ignores inactive requirements', () => {
    const listing: Listing = {
      sourceId: 's1',
      externalId: 'l3',
      geography: 'London',
      text: 'nothing relevant',
    };
    // Only the inactive requirement targets London with no other signal; the
    // active Citywide also targets London so it should score 1 (geo only) → fail.
    const res = stageZeroFilter(listing, requirements, OPTS);
    expect(res.pass).toBe(false);
  });

  it('matches global keyword triggers even without a per-requirement keyword', () => {
    const listing: Listing = {
      sourceId: 's1',
      externalId: 'l4',
      geography: 'Leeds',
      text: 'A former place of worship with planning potential',
    };
    const res = stageZeroFilter(listing, requirements, OPTS);
    // geography (leeds) + keyword (former place of worship / planning) => >= 2
    expect(res.pass).toBe(true);
    expect(res.matchedRequirementId).toBe('educating');
  });
});

describe('stageZeroFilter — geoPrescoped (portal pulls)', () => {
  const PRESCOPED = { minimumBar: 2, geoPrescoped: true };

  it('geography earns no point: geo + one keyword no longer passes', () => {
    const listing: Listing = {
      sourceId: 'portal',
      externalId: 'p1',
      geography: 'London',
      text: 'Freehold premises', // keyword only
    };
    const res = stageZeroFilter(listing, requirements, PRESCOPED);
    expect(res.pass).toBe(false);
    expect(res.score).toBe(1);
    // geography still recorded as a precondition, not a scored point
    expect(res.reasons.join(' ')).toMatch(/prescoped — not scored/);
  });

  it('still passes on two non-geo signals (price + keyword)', () => {
    const listing: Listing = {
      sourceId: 'portal',
      externalId: 'p2',
      geography: 'Manchester',
      price: 900000,
      text: 'Vacant freehold office building',
    };
    const res = stageZeroFilter(listing, requirements, PRESCOPED);
    expect(res.pass).toBe(true);
    expect(res.score).toBeGreaterThanOrEqual(2);
    expect(res.matchedRequirementId).toBe('citywide');
  });

  it("geo mismatch disqualifies the requirement: a Leeds listing can't match Educating on size+keyword", () => {
    const listing: Listing = {
      sourceId: 'portal',
      externalId: 'p3',
      geography: 'Leeds', // not an Educating town; leeds not in citywide list either
      size: 5000,
      text: 'office building', // educating keyword + size would be 2 points
    };
    const res = stageZeroFilter(listing, requirements, PRESCOPED);
    expect(res.matchedRequirementId).not.toBe('educating');
    expect(res.pass).toBe(false);
  });
});
