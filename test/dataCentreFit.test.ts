import { describe, it, expect } from 'vitest';
import { scoreDataCentreFit, sizeSqftEquivalent } from '../src/scoring/dataCentreFit.js';

describe('sizeSqftEquivalent', () => {
  it('uses sizeSqft directly when present', () => {
    expect(sizeSqftEquivalent('2,343 sqft', 2343)).toBe(2343);
  });

  it('falls back to parsing acres from the label when sizeSqft is null', () => {
    expect(sizeSqftEquivalent('1.1 acres', null)).toBe(Math.round(1.1 * 43560));
  });

  it('returns null when neither is available', () => {
    expect(sizeSqftEquivalent('', null)).toBeNull();
    expect(sizeSqftEquivalent('POA', null)).toBeNull();
  });
});

describe('scoreDataCentreFit', () => {
  it('scores a close-to-a-transmission-substation, large, industrial site as a strong fit', () => {
    const res = scoreDataCentreFit({
      substationPoints: 60,
      substationReason: '1.2km to Thorpe Marsh Substation (400kV)',
      sizeSqftEquivalent: 150_000,
      propertyType: 'Industrial / Warehouse',
    });
    expect(res.score).toBe(60 + 25 + 15);
    expect(res.band).toBe('strong');
  });

  it('scores a far-from-any-substation, small, retail unit as unlikely', () => {
    const res = scoreDataCentreFit({
      substationPoints: 0,
      substationReason: 'no substation with a usable voltage found within range',
      sizeSqftEquivalent: 800,
      propertyType: 'Retail',
    });
    expect(res.score).toBe(0 + 0 + 0);
    expect(res.band).toBe('unlikely');
  });

  it('scores a moderate substation match, modestly sized plot as possible', () => {
    const res = scoreDataCentreFit({
      substationPoints: 35,
      substationReason: '3km to a 66kV substation',
      sizeSqftEquivalent: 3_000,
      propertyType: 'Land',
    });
    expect(res.score).toBe(35 + 5 + 15);
    expect(res.band).toBe('possible');
  });

  it('treats missing location/size/subtype data as low/neutral rather than throwing', () => {
    const res = scoreDataCentreFit({
      substationPoints: null,
      substationReason: 'no location data — distance to substation unknown',
      sizeSqftEquivalent: null,
      propertyType: '',
    });
    expect(res.score).toBe(0 + 0 + 5);
    expect(res.reasons).toHaveLength(3);
  });

  it('clamps substationPoints to [0, 60] defensively', () => {
    const over = scoreDataCentreFit({ substationPoints: 999, substationReason: 'x', sizeSqftEquivalent: null, propertyType: '' });
    const under = scoreDataCentreFit({ substationPoints: -10, substationReason: 'x', sizeSqftEquivalent: null, propertyType: '' });
    expect(over.score).toBe(60 + 0 + 5);
    expect(under.score).toBe(0 + 0 + 5);
  });

  it('office and mixed-use land between retail and industrial/land in weight', () => {
    const office = scoreDataCentreFit({ substationPoints: 60, substationReason: 'x', sizeSqftEquivalent: 100_000, propertyType: 'Office' });
    const mixed = scoreDataCentreFit({ substationPoints: 60, substationReason: 'x', sizeSqftEquivalent: 100_000, propertyType: 'Mixed Use' });
    const industrial = scoreDataCentreFit({ substationPoints: 60, substationReason: 'x', sizeSqftEquivalent: 100_000, propertyType: 'Industrial' });
    expect(office.score).toBeLessThan(mixed.score);
    expect(mixed.score).toBeLessThan(industrial.score);
  });
});
