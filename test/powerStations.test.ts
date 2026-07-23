import { describe, it, expect } from 'vitest';
import { parseGbPowerStationsCsv, haversineKm, nearestStation } from '../src/geo/powerStations.js';

const CSV = `name,capacity_mw,latitude,longitude,primary_fuel
Drax,2180.0,53.7370,-0.9916,Biomass
Small Solar Farm,4.9,53.7000,-1.0000,Solar
Eggborough,53.0,53.7358,-1.1361,Gas
`;

describe('parseGbPowerStationsCsv', () => {
  it('parses rows into PowerStation records', () => {
    const stations = parseGbPowerStationsCsv(CSV);
    expect(stations).toHaveLength(3);
    expect(stations[0]).toEqual({ name: 'Drax', capacityMw: 2180, lat: 53.737, lon: -0.9916, fuel: 'Biomass' });
  });
});

describe('haversineKm', () => {
  it('is ~0 for the same point', () => {
    expect(haversineKm({ lat: 53.7, lon: -1.0 }, { lat: 53.7, lon: -1.0 })).toBeCloseTo(0, 5);
  });

  it('matches a known London-Paris-ish distance ballpark', () => {
    // London to Paris is ~344km great-circle.
    const london = { lat: 51.5074, lon: -0.1278 };
    const paris = { lat: 48.8566, lon: 2.3522 };
    const d = haversineKm(london, paris);
    expect(d).toBeGreaterThan(330);
    expect(d).toBeLessThan(360);
  });
});

describe('nearestStation', () => {
  const stations = parseGbPowerStationsCsv(CSV);
  const point = { lat: 53.7368, lon: -0.99 }; // very close to Drax

  it('finds the nearest station with no capacity filter (the tiny solar farm nearby wins)', () => {
    const near = { lat: 53.7005, lon: -1.0005 }; // right next to the small solar farm
    const result = nearestStation(near, stations);
    expect(result?.station.name).toBe('Small Solar Farm');
  });

  it('restricts to major stations only when minCapacityMw is set', () => {
    const near = { lat: 53.7005, lon: -1.0005 };
    const result = nearestStation(near, stations, { minCapacityMw: 50 });
    // Small Solar Farm (4.9MW) excluded — Eggborough (53MW) or Drax should win instead.
    expect(result?.station.name).not.toBe('Small Solar Farm');
    expect(result?.station.capacityMw).toBeGreaterThanOrEqual(50);
  });

  it('returns the closest overall when unrestricted, favouring Drax right next to it', () => {
    const result = nearestStation(point, stations);
    expect(result?.station.name).toBe('Drax');
    expect(result?.distanceKm).toBeLessThan(1);
  });

  it('returns null when no station meets the capacity filter', () => {
    const result = nearestStation(point, stations, { minCapacityMw: 100_000 });
    expect(result).toBeNull();
  });
});
