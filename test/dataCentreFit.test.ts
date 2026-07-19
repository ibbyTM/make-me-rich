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
  it('scores a close, large, industrial site as a strong fit', () => {
    const res = scoreDataCentreFit({
      nearestMajorStationKm: 1.2,
      sizeSqftEquivalent: 150_000,
      propertyType: 'Industrial / Warehouse',
    });
    expect(res.score).toBe(60 + 25 + 15);
    expect(res.band).toBe('strong');
  });

  it('scores a far, small, retail unit as unlikely', () => {
    const res = scoreDataCentreFit({
      nearestMajorStationKm: 60,
      sizeSqftEquivalent: 800,
      propertyType: 'Retail',
    });
    expect(res.score).toBe(0 + 0 + 0);
    expect(res.band).toBe('unlikely');
  });

  it('scores a moderate-distance, modestly sized plot as possible', () => {
    const res = scoreDataCentreFit({
      nearestMajorStationKm: 8,
      sizeSqftEquivalent: 3_000,
      propertyType: 'Land',
    });
    expect(res.score).toBe(35 + 5 + 15);
    expect(res.band).toBe('possible');
  });

  it('treats missing location/size/subtype data as low/neutral rather than throwing', () => {
    const res = scoreDataCentreFit({
      nearestMajorStationKm: null,
      sizeSqftEquivalent: null,
      propertyType: '',
    });
    expect(res.score).toBe(0 + 0 + 5);
    expect(res.reasons).toHaveLength(3);
  });

  it('office and mixed-use land between retail and industrial/land in weight', () => {
    const office = scoreDataCentreFit({ nearestMajorStationKm: 1, sizeSqftEquivalent: 100_000, propertyType: 'Office' });
    const mixed = scoreDataCentreFit({ nearestMajorStationKm: 1, sizeSqftEquivalent: 100_000, propertyType: 'Mixed Use' });
    const industrial = scoreDataCentreFit({ nearestMajorStationKm: 1, sizeSqftEquivalent: 100_000, propertyType: 'Industrial' });
    expect(office.score).toBeLessThan(mixed.score);
    expect(mixed.score).toBeLessThan(industrial.score);
  });
});
