import { describe, it, expect } from 'vitest';
import { scoreSchoolReadiness } from '../src/scoring/schoolReadiness.js';

describe('scoreSchoolReadiness', () => {
  it('returns unknown when there is no marketing text at all', () => {
    expect(scoreSchoolReadiness(null)).toMatchObject({ band: 'unknown', score: 0 });
    expect(scoreSchoolReadiness('')).toMatchObject({ band: 'unknown', score: 0 });
    expect(scoreSchoolReadiness('   ')).toMatchObject({ band: 'unknown', score: 0 });
  });

  it('returns unknown when text exists but has no condition language', () => {
    const result = scoreSchoolReadiness('Freehold former church for sale in central Leeds, 5,200 sq ft.');
    expect(result.band).toBe('unknown');
    expect(result.score).toBe(0);
  });

  it('scores ready for clear positive condition language', () => {
    const result = scoreSchoolReadiness('Recently renovated former chapel, turnkey and ready for occupation.');
    expect(result.band).toBe('ready');
    expect(result.score).toBeGreaterThan(65);
  });

  it('scores major_work for clear negative condition language', () => {
    const result = scoreSchoolReadiness('Development opportunity — property requires significant investment and is in disrepair.');
    expect(result.band).toBe('major_work');
    expect(result.score).toBeLessThan(35);
  });

  it('nets positive and negative phrases when both are present', () => {
    const result = scoreSchoolReadiness('Well maintained externally but requires modernisation internally.');
    expect(result.score).toBe(50 + 20 - 25); // one ready phrase, one work-needed phrase
  });

  it('is case-insensitive', () => {
    const result = scoreSchoolReadiness('RECENTLY RENOVATED and TURNKEY.');
    expect(result.band).toBe('ready');
  });

  it('clamps score to [0, 100]', () => {
    const veryReady = scoreSchoolReadiness('Recently renovated, newly refurbished, turnkey, good condition, excellent condition, immaculate condition, ready for occupation.');
    expect(veryReady.score).toBeLessThanOrEqual(100);

    const veryBad = scoreSchoolReadiness('Requires refurbishment, requires renovation, needs modernisation, derelict, disrepair, shell condition.');
    expect(veryBad.score).toBeGreaterThanOrEqual(0);
  });

  it('reasons list the matched phrases', () => {
    const result = scoreSchoolReadiness('Turnkey property, requires refurbishment to rear extension.');
    expect(result.reasons.some((r) => r.includes('turnkey'))).toBe(true);
    expect(result.reasons.some((r) => r.includes('requires refurbishment'))).toBe(true);
  });
});
