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
  /**
   * Set when the pull itself was already geo-scoped (e.g. a portal search
   * filtered by city/region at query time). Geography is then satisfied by
   * construction, so it must not count toward the pass bar — otherwise every
   * listing gets a free point and the bar collapses (see
   * docs/rightmove-commercial-pull-2026-07-14.md). With this flag:
   *   - a geography match earns 0 points (noted in reasons, not scored);
   *   - a geography MISMATCH disqualifies that requirement for the listing —
   *     the pull being scoped to requirement A's territory doesn't make the
   *     listing local to requirement B.
   * The minimum bar therefore applies to the remaining criteria only
   * (price, size, keywords).
   */
  geoPrescoped?: boolean;
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
    const scored = scoreAgainst(listing, req, opts.geoPrescoped === true);
    if (scored === null) continue; // geo-prescoped and this requirement's territory doesn't match
    const { score, reasons } = scored;
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
  geoPrescoped: boolean,
): { score: number; reasons: string[] } | null {
  let score = 0;
  const reasons: string[] = [];

  // geography
  if (listing.geography) {
    const geo = listing.geography.toLowerCase();
    const geoMatches = req.geographies.some((g) => geo.includes(g) || g.includes(geo));
    if (geoPrescoped) {
      // Precondition, not a point: mismatch disqualifies, match earns nothing.
      if (!geoMatches) return null;
      reasons.push(`geography "${listing.geography}" in ${req.name} territory (prescoped — not scored)`);
    } else if (geoMatches) {
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
