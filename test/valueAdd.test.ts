import { describe, it, expect } from 'vitest';
import { scoreValueAdd, type ValueAddInput } from '../src/scoring/valueAdd.js';

describe('scoreValueAdd', () => {
  it('scores full points for 20%+ discount with sufficient comparables', () => {
    const input: ValueAddInput = {
      priceAmount: 160_000,
      postcode: 'M1 1AA',
      floodRiskZone: 1,
      postcodeMedianPrice: 200_000,
      comparableSampleCount: 10,
    };
    const result = scoreValueAdd(input);
    expect(result.score).toBe(75 + 25); // 20% discount (75 pts) + Zone 1 flood (25 pts) = 100
    expect(result.band).toBe('strong');
  });

  it('scores zero when price is at or above median', () => {
    const input: ValueAddInput = {
      priceAmount: 200_000,
      postcode: 'M1 1AA',
      floodRiskZone: 1,
      postcodeMedianPrice: 200_000,
      comparableSampleCount: 10,
    };
    const result = scoreValueAdd(input);
    expect(result.score).toBe(0 + 25); // No discount (0 pts) + Zone 1 (25 pts) = 25
    expect(result.band).toBe('unlikely');
  });

  it('scores lower for moderate discounts (5-15%)', () => {
    const input: ValueAddInput = {
      priceAmount: 190_000,
      postcode: 'M1 1AA',
      floodRiskZone: 2,
      postcodeMedianPrice: 200_000,
      comparableSampleCount: 5,
    };
    const result = scoreValueAdd(input);
    expect(result.score).toBe(25 + 10); // 5% discount (25 pts) + Zone 2 (10 pts) = 35
    expect(result.band).toBe('possible');
  });

  it('penalizes high flood risk (Zone 3)', () => {
    const input: ValueAddInput = {
      priceAmount: 160_000,
      postcode: 'M1 1AA',
      floodRiskZone: 3,
      postcodeMedianPrice: 200_000,
      comparableSampleCount: 10,
    };
    const result = scoreValueAdd(input);
    expect(result.score).toBe(75 + 0); // 20% discount (75 pts) + Zone 3 (0 pts) = 75
    expect(result.band).toBe('strong'); // Still strong due to price, but flood risk is noted
  });

  it('returns insufficient_data when comparables < 3 samples', () => {
    const input: ValueAddInput = {
      priceAmount: 160_000,
      postcode: 'M1 1AA',
      floodRiskZone: 1,
      postcodeMedianPrice: 200_000,
      comparableSampleCount: 2, // Too few samples
    };
    const result = scoreValueAdd(input);
    expect(result.band).toBe('insufficient_data');
    expect(result.score).toBe(0); // Can't score with insufficient data
  });

  it('handles missing price data', () => {
    const input: ValueAddInput = {
      priceAmount: null,
      postcode: 'M1 1AA',
      floodRiskZone: 1,
      postcodeMedianPrice: 200_000,
      comparableSampleCount: 10,
    };
    const result = scoreValueAdd(input);
    expect(result.band).toBe('insufficient_data');
    expect(result.score).toBe(0);
  });

  it('handles missing postcode/comparables', () => {
    const input: ValueAddInput = {
      priceAmount: 160_000,
      postcode: null,
      floodRiskZone: 1,
      postcodeMedianPrice: null,
      comparableSampleCount: 0,
    };
    const result = scoreValueAdd(input);
    expect(result.band).toBe('insufficient_data');
    expect(result.score).toBe(0);
  });

  it('clamps score to [0, 100]', () => {
    // Negative score should be clamped to 0
    const input: ValueAddInput = {
      priceAmount: 220_000, // 10% premium over median
      postcode: 'M1 1AA',
      floodRiskZone: 3, // High risk
      postcodeMedianPrice: 200_000,
      comparableSampleCount: 10,
    };
    const result = scoreValueAdd(input);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('provides reason strings for each score component', () => {
    const input: ValueAddInput = {
      priceAmount: 160_000,
      postcode: 'M1 1AA',
      floodRiskZone: 2,
      postcodeMedianPrice: 200_000,
      comparableSampleCount: 10,
    };
    const result = scoreValueAdd(input);
    expect(result.reasons).toHaveLength(2);
    expect(result.reasons[0]).toContain('20%');
    expect(result.reasons[1]).toContain('Zone 2');
  });
});
