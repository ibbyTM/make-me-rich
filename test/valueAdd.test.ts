import { describe, it, expect } from 'vitest';
import { scoreValueAdd, type ValueAddInput } from '../src/scoring/valueAdd.js';

describe('scoreValueAdd', () => {
  const base: ValueAddInput = {
    priceAmount: 200_000,
    sizeSqft: 20_000, // £10/sqft
    localVoaRatePerSqft: 10,
    voaSampleCount: 500,
    ratioPercentile: 0, // cheapest in the dataset
  };

  it('scores full points for the cheapest percentile', () => {
    const result = scoreValueAdd(base);
    expect(result.score).toBe(100); // bottom 20th percentile
    expect(result.band).toBe('strong');
  });

  it('scores zero for the most expensive percentile', () => {
    const result = scoreValueAdd({ ...base, ratioPercentile: 95 });
    expect(result.score).toBe(0);
    expect(result.band).toBe('unlikely');
  });

  it('scores mid-range points for a middling percentile', () => {
    const result = scoreValueAdd({ ...base, ratioPercentile: 45 });
    expect(result.score).toBe(60); // 35-50th percentile band
    expect(result.band).toBe('possible');
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
    const result = scoreValueAdd({ ...base, ratioPercentile: 95 });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('provides a reason string mentioning price/sqft, the VOA benchmark, and the percentile', () => {
    const result = scoreValueAdd(base);
    expect(result.reasons).toHaveLength(1);
    expect(result.reasons[0]).toContain('/sqft');
    expect(result.reasons[0]).toContain('percentile');
  });
});
