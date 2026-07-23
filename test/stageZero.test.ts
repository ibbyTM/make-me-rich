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

describe('stageZeroFilter — tie-breaking on equal scores', () => {
  // Reproduces the real "Fulneck School" case (2026-07-22): a listing that
  // ties 2-2 between two requirements, where one requirement's point came
  // from a GLOBAL keyword ("freehold" — present in nearly every commercial
  // listing) and the other's came from its OWN, far more specific keyword
  // ("school"). The specific match should win the tie.
  const tieReqs: Requirement[] = [
    {
      id: 'generic',
      name: 'Generic (created later, evaluated first)',
      active: true,
      geographies: ['yorkshire'],
      minSize: 20000,
      keywords: ['industrial', 'warehouse'], // won't match this listing
    },
    {
      id: 'specific',
      name: 'Specific',
      active: true,
      geographies: ['yorkshire'],
      minSize: 2000,
      keywords: ['school', 'educational'],
    },
  ];
  const PRESCOPED = { minimumBar: 2, geoPrescoped: true };

  it('prefers the requirement matched on its own keyword over one matched only on a global keyword, on a tie', () => {
    const listing: Listing = {
      sourceId: 'portal',
      externalId: 'fulneck',
      geography: 'Leeds Yorkshire',
      size: 88670,
      text: 'Former school estate, substantial former educational accommodation. Offered freehold.',
    };
    const res = stageZeroFilter(listing, tieReqs, PRESCOPED);
    // Both requirements score 2 (geo prescoped=0, size>=min for both, one keyword each) —
    // 'generic' only via the global "freehold", 'specific' via its own "school"/"educational".
    expect(res.score).toBe(2);
    expect(res.matchedRequirementId).toBe('specific');
  });

  it('a genuine tie with no specific keyword on either side keeps the first-evaluated requirement (unchanged fallback behaviour)', () => {
    const listing: Listing = {
      sourceId: 'portal',
      externalId: 'neither-specific',
      geography: 'Leeds Yorkshire',
      size: 88670,
      text: 'Freehold premises, subject to planning.',
    };
    const res = stageZeroFilter(listing, tieReqs, PRESCOPED);
    expect(res.score).toBe(2); // both hit only global keywords (freehold/planning)
    expect(res.matchedRequirementId).toBe('generic'); // first in the array, neither has a specific hit
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
