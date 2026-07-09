/**
 * Stage-0 fixed-criteria filter (spec §6).
 *
 * Sits between scraping and the Claude API scorer. Rule-based, free, and runs
 * against fields already extractable without AI, matched against the active
 * Requirements Register entries. Its only job is to stop obviously-irrelevant
 * listings from ever reaching the paid API — it does NOT replace the Day-5
 * rule-based Requirements matching that scores real candidates (spec §6, last
 * paragraph).
 *
 * Pure function: listing + requirements in, decision + reasons out. The reasons
 * are logged so the funnel is inspectable, not a black box (spec §7 Day D).
 */

import type { Listing, Requirement } from '../types.js';

/** Global keyword triggers (spec §6). Extendable per-requirement via `keywords`. */
export const GLOBAL_KEYWORDS = [
  'freehold',
  'vacant',
  'planning',
  'former place of worship',
  'development opportunity',
  'change of use',
];

export interface StageZeroResult {
  pass: boolean;
  score: number;
  minimumBar: number;
  /** Which requirement produced the best score (for the audit trail). */
  matchedRequirementId: string | null;
  reasons: string[];
}

export interface StageZeroOptions {
  minimumBar: number;
}

export function stageZeroFilter(
  listing: Listing,
  requirements: Requirement[],
  opts: StageZeroOptions,
): StageZeroResult {
  const active = requirements.filter((r) => r.active);

  let best: StageZeroResult = {
    pass: false,
    score: 0,
    minimumBar: opts.minimumBar,
    matchedRequirementId: null,
    reasons: ['no active requirements matched'],
  };

  for (const req of active) {
    const { score, reasons } = scoreAgainst(listing, req);
    if (score > best.score) {
      best = {
        pass: score >= opts.minimumBar,
        score,
        minimumBar: opts.minimumBar,
        matchedRequirementId: req.id,
        reasons,
      };
    }
  }

  return best;
}

function scoreAgainst(
  listing: Listing,
  req: Requirement,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // geography
  if (listing.geography) {
    const geo = listing.geography.toLowerCase();
    if (req.geographies.some((g) => geo.includes(g) || g.includes(geo))) {
      score += 1;
      reasons.push(`geography "${listing.geography}" matches ${req.name}`);
    }
  }

  // size (where applicable)
  if (req.minSize !== undefined && listing.size !== undefined) {
    if (listing.size >= req.minSize) {
      score += 1;
      reasons.push(`size ${listing.size} >= min ${req.minSize}`);
    }
  }

  // price within budget
  if (req.budgetRange && listing.price !== undefined) {
    const [min, max] = req.budgetRange;
    if (listing.price >= min && listing.price <= max) {
      score += 1;
      reasons.push(`price ${listing.price} within budget ${min}-${max}`);
    }
  }

  // keyword hit
  const keywords = [...GLOBAL_KEYWORDS, ...(req.keywords ?? [])];
  const haystack = (listing.text ?? '').toLowerCase();
  const hit = keywords.find((k) => haystack.includes(k.toLowerCase()));
  if (hit) {
    score += 1;
    reasons.push(`keyword hit "${hit}"`);
  }

  return { score, reasons };
}
