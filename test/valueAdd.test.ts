import { describe, it, expect } from 'vitest';
import { scoreValueAdd, type ValueAddInput } from '../src/scoring/valueAdd.js';

describe('scoreValueAdd', () => {
  const base: ValueAddInput = {
    priceAmount: 200_000,
    sizeSqft: 20_000, // £10/sqft
    floodRiskZone: 1,
    localVoaRatePerSqft: 10,
    voaSampleCount: 500,
    ratioPercentile: 0, // cheapest in the dataset
  };

  it('scores full points for the cheapest percentile with low flood risk', () => {
    const result = scoreValueAdd(base);
    expect(result.score).toBe(75 + 25); // bottom 20th percentile (75) + Zone 1 (25) = 100
    expect(result.band).toBe('strong');
  });

  it('scores zero price points for the most expensive percentile', () => {
    const result = scoreValueAdd({ ...base, ratioPercentile: 95 });
    expect(result.score).toBe(0 + 25); // top percentile (0) + Zone 1 (25) = 25
    expect(result.band).toBe('unlikely');
  });

  it('scores mid-range points for a middling percentile', () => {
    const result = scoreValueAdd({ ...base, ratioPercentile: 45, floodRiskZone: 2 });
    expect(result.score).toBe(45 + 10); // 35-50th percentile band (45) + Zone 2 (10) = 55
    expect(result.band).toBe('possible');
  });

  it('penalizes high flood risk (Zone 3) even at a cheap percentile', () => {
    const result = scoreValueAdd({ ...base, floodRiskZone: 3 });
    expect(result.score).toBe(75 + 0); // bottom percentile (75) + Zone 3 (0) = 75
    expect(result.band).toBe('strong');
  });

  it('returns insufficient_data when the VOA district has too few samples', () => {
    const result = scoreValueAdd({ ...base, voaSampleCount: 3 });
    expect(result.band).toBe('insufficient_data');
    expect(result.score).toBe(0);
  });

  it('returns insufficient_data when there is no VOA benchmark for the district', () => {
    const result = scoreValueAdd({ ...base, localVoaRatePerSqft: null, voaSampleCount: 0 });
    expect(result.band).toBe('insufficient_data');
    expect(result.score).toBe(0);
  });

  it('returns insufficient_data when price or size is missing', () => {
    expect(scoreValueAdd({ ...base, priceAmount: null }).band).toBe('insufficient_data');
    expect(scoreValueAdd({ ...base, sizeSqft: null }).band).toBe('insufficient_data');
  });

  it('returns insufficient_data when the row could not be percentile-ranked', () => {
    const result = scoreValueAdd({ ...base, ratioPercentile: null });
    expect(result.band).toBe('insufficient_data');
    expect(result.score).toBe(0);
  });

  it('clamps score to [0, 100]', () => {
    const result = scoreValueAdd({ ...base, ratioPercentile: 95, floodRiskZone: 3 });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('provides reason strings mentioning price/sqft, the VOA benchmark, and flood zone', () => {
    const result = scoreValueAdd(base);
    expect(result.reasons).toHaveLength(2);
    expect(result.reasons[0]).toContain('/sqft');
    expect(result.reasons[0]).toContain('percentile');
    expect(result.reasons[1]).toContain('Zone 1');
  });
});
