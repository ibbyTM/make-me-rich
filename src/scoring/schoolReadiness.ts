/**
 * School-readiness score (2026-07-22) — read-only analysis layer for the
 * School Conversion requirement: "properties ready to be turned into a
 * school with little work". There's no free UK building-condition/survey
 * dataset, so the only honest signal available is the listing's own
 * marketing text (Rightmove's summary+keyFeatures, PropertyHive's excerpt —
 * see `marketingText` on dashboard rows). This is a real but imperfect
 * proxy: agents don't always describe condition, and marketing language is
 * naturally biased upbeat. Scored, not guessed — a listing with no
 * condition language either way is `unknown`, not assumed good or bad.
 *
 * Pure function, same discipline as dataCentreFit.ts / valueAdd.ts: inputs
 * in, a score + human-readable reasons out.
 */

export interface SchoolReadinessResult {
  score: number;
  band: 'ready' | 'some_work' | 'major_work' | 'unknown';
  reasons: string[];
}

/** Phrases suggesting the building is already in a fit state — "little work needed". */
const READY_PHRASES = [
  'recently renovated',
  'newly renovated',
  'recently refurbished',
  'newly refurbished',
  'turnkey',
  'turn-key',
  'turn key',
  'good condition',
  'excellent condition',
  'immaculate condition',
  'ready for occupation',
  'ready to occupy',
  'move-in ready',
  'well maintained',
  'well-maintained',
  'fully modernised',
  'fully modernized',
];

/** Phrases suggesting meaningful work is needed before the building could serve as a school. */
const WORK_NEEDED_PHRASES = [
  'requires refurbishment',
  'requires renovation',
  'requires modernisation',
  'requires modernization',
  'needs refurbishment',
  'needs renovation',
  'needs modernisation',
  'needs modernization',
  'in need of refurbishment',
  'in need of renovation',
  'development opportunity',
  'redevelopment opportunity',
  'shell condition',
  'shell and core',
  'stripped out',
  'derelict',
  'disrepair',
  'requires significant investment',
  'requires substantial work',
];

function countMatches(text: string, phrases: string[]): string[] {
  const lower = text.toLowerCase();
  return phrases.filter((p) => lower.includes(p));
}

const POINTS_PER_READY_PHRASE = 20;
const POINTS_PER_WORK_PHRASE = 25;

function bandOf(score: number, hasSignal: boolean): SchoolReadinessResult['band'] {
  if (!hasSignal) return 'unknown';
  if (score >= 65) return 'ready';
  if (score >= 35) return 'some_work';
  return 'major_work';
}

/**
 * `marketingText` is the listing's own summary/key-features prose (null for
 * sources that don't carry one, e.g. Barnsdales — see scripts/barnsdales-
 * report.ts). Score starts neutral (50) and moves up/down per matched
 * phrase; with no marketing text at all, or no condition language in what
 * text there is, the result is `unknown` rather than a guessed mid score.
 */
export function scoreSchoolReadiness(marketingText: string | null): SchoolReadinessResult {
  if (!marketingText || !marketingText.trim()) {
    return { score: 0, band: 'unknown', reasons: ['no marketing text available to assess condition'] };
  }

  const readyMatches = countMatches(marketingText, READY_PHRASES);
  const workMatches = countMatches(marketingText, WORK_NEEDED_PHRASES);

  if (readyMatches.length === 0 && workMatches.length === 0) {
    return { score: 0, band: 'unknown', reasons: ['no condition language found in listing text'] };
  }

  const rawScore = 50 + readyMatches.length * POINTS_PER_READY_PHRASE - workMatches.length * POINTS_PER_WORK_PHRASE;
  const score = Math.max(0, Math.min(100, rawScore));

  const reasons: string[] = [];
  if (readyMatches.length) reasons.push(`ready-condition language: "${readyMatches.join('", "')}"`);
  if (workMatches.length) reasons.push(`work-needed language: "${workMatches.join('", "')}"`);

  return { score, band: bandOf(score, true), reasons };
}
