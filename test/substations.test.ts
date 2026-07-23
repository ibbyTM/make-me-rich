import { describe, it, expect } from 'vitest';
import { classifyVoltage, parseVoltageTag, bestSubstationScore, type Substation } from '../src/geo/substations.js';

describe('classifyVoltage', () => {
  it('classifies transmission-tier (>=275kV)', () => {
    expect(classifyVoltage(400_000)).toEqual({ tier: 'transmission', basePoints: 60 });
    expect(classifyVoltage(275_000)).toEqual({ tier: 'transmission', basePoints: 60 });
  });

  it('classifies grid-supply tier (132kV)', () => {
    expect(classifyVoltage(132_000)).toEqual({ tier: 'grid-supply', basePoints: 50 });
  });

  it('classifies primary tier (66kV)', () => {
    expect(classifyVoltage(66_000)).toEqual({ tier: 'primary', basePoints: 35 });
  });

  it('classifies local-primary tier (33kV)', () => {
    expect(classifyVoltage(33_000)).toEqual({ tier: 'local-primary', basePoints: 20 });
  });

  it('returns null below 33kV — not a meaningful grid-capacity signal', () => {
    expect(classifyVoltage(11_000)).toBeNull();
    expect(classifyVoltage(400)).toBeNull();
  });
});

describe('parseVoltageTag', () => {
  it('parses a single voltage value', () => {
    expect(parseVoltageTag('132000')).toBe(132_000);
  });

  it('takes the max of a semicolon-separated list', () => {
    expect(parseVoltageTag('132000;33000;11000')).toBe(132_000);
  });

  it('ignores non-numeric junk and still finds the max', () => {
    expect(parseVoltageTag('11000;400;garbage')).toBe(11_000);
  });

  it('returns null when nothing parses', () => {
    expect(parseVoltageTag('')).toBeNull();
    expect(parseVoltageTag('unknown')).toBeNull();
  });
});

describe('bestSubstationScore', () => {
  const point = { lat: 53.5, lon: -1.13 }; // near Doncaster

  it('picks the substation yielding the highest points, not necessarily the nearest', () => {
    const substations: Substation[] = [
      { name: 'Close but low voltage', lat: 53.501, lon: -1.131, voltageV: 33_000 }, // ~0.1km, tier local-primary (20 base)
      { name: 'Farther but transmission', lat: 53.55, lon: -1.13, voltageV: 400_000 }, // ~5.5km, tier transmission (60 base)
    ];
    const result = bestSubstationScore(point, substations);
    expect(result?.substation.name).toBe('Farther but transmission');
    expect(result?.tier).toBe('transmission');
  });

  it('excludes substations below the 33kV floor', () => {
    const substations: Substation[] = [{ name: 'Local transformer', lat: 53.501, lon: -1.131, voltageV: 11_000 }];
    expect(bestSubstationScore(point, substations)).toBeNull();
  });

  it('returns null for an empty substation list', () => {
    expect(bestSubstationScore(point, [])).toBeNull();
  });

  it('applies distance decay — a very close substation scores near its base points, a far one scores near zero', () => {
    const close: Substation[] = [{ name: 'Close', lat: 53.501, lon: -1.131, voltageV: 132_000 }];
    const far: Substation[] = [{ name: 'Far', lat: 54.5, lon: -1.13, voltageV: 132_000 }]; // >100km away
    const closeResult = bestSubstationScore(point, close);
    const farResult = bestSubstationScore(point, far);
    expect(closeResult!.points).toBeGreaterThan(farResult!.points);
    expect(farResult!.points).toBe(0);
  });
});
