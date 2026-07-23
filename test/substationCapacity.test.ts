import { describe, it, expect } from 'vitest';
import { nearestCapacitySubstation, type SubstationCapacity } from '../src/geo/substationCapacity.js';

const LEEDS: SubstationCapacity = {
  name: 'Leeds Primary',
  lat: 53.8008,
  lon: -1.5491,
  firmCapacityMva: 24,
  siteLevel: 'Primary',
  primaryVoltageKv: 33,
  dnoArea: 'Yorkshire',
  postcode: 'LS1 1AA',
};

const FAR_AWAY: SubstationCapacity = {
  name: 'Somewhere Distant',
  lat: 51.5074,
  lon: -0.1278, // London — nowhere near Leeds
  firmCapacityMva: 100,
  siteLevel: 'GSP',
  primaryVoltageKv: 132,
  dnoArea: 'London',
  postcode: 'EC1A 1AA',
};

describe('nearestCapacitySubstation', () => {
  it('finds a real-capacity substation within range', () => {
    const point = { lat: 53.801, lon: -1.5495 };
    const result = nearestCapacitySubstation(point, [LEEDS, FAR_AWAY]);
    expect(result).not.toBeNull();
    expect(result!.substation.name).toBe('Leeds Primary');
    expect(result!.substation.firmCapacityMva).toBe(24);
    expect(result!.distanceKm).toBeLessThan(1);
  });

  it('returns null when nothing is within maxKm — no fabricated match outside NPG coverage', () => {
    const point = { lat: 52.4862, lon: -1.8904 }; // Birmingham — West Midlands, not NPG territory
    const result = nearestCapacitySubstation(point, [LEEDS, FAR_AWAY]);
    expect(result).toBeNull();
  });

  it('picks the closer of two in-range substations', () => {
    const near: SubstationCapacity = { ...LEEDS, name: 'Near One', lat: 53.801, lon: -1.5495 };
    const far: SubstationCapacity = { ...LEEDS, name: 'Far One', lat: 53.81, lon: -1.56 };
    const point = { lat: 53.8008, lon: -1.5491 };
    const result = nearestCapacitySubstation(point, [far, near]);
    expect(result!.substation.name).toBe('Near One');
  });

  it('respects a custom maxKm', () => {
    const point = { lat: 53.801, lon: -1.5495 };
    expect(nearestCapacitySubstation(point, [LEEDS], 0.001)).toBeNull();
  });
});
