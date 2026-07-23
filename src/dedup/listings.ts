/**
 * Cross-source/within-source duplicate detection for dashboard listings
 * (2026-07-21). Pure functions, same discipline as stageZero.ts/
 * dataCentreFit.ts: inputs in, a grouping + human-readable reason out, fully
 * unit-testable with no I/O.
 *
 * Two real patterns found by hand in the live 220-row dashboard before this
 * was built (see docs/dedup-2026-07-21.md):
 *   - Cross-source syndication: an agent we scrape directly (Barnsdales, SMC
 *     Brownill Vickers, Gifford Dixon, ...) also has the same listing
 *     aggregated by Rightmove Commercial — two rows, two sources, one
 *     physical property.
 *   - Same-agent relisting on Rightmove itself: an agent (seen: Bramleys,
 *     Knight Frank) creates more than one listing page for the same site —
 *     sometimes worded differently ("Land to rear" vs "Development Site to
 *     rear"), sometimes split by use-class framing (a mixed warehouse/office
 *     building marketed as two separate listings).
 *
 * Fingerprint: exact price + exact size (both > 0) is already a strong,
 * low-noise signal on this dataset — manually verified zero false positives
 * across all 8 groups it found in the live 220-row set. A lightweight
 * address-token-overlap guard is still required before trusting it, so a
 * coincidental price+size collision between two unrelated properties (not
 * observed live, but plausible at larger scale) doesn't get merged.
 */

export interface DedupCandidate {
  /** Unique reference for this row (its listing URL). */
  key: string;
  source: string;
  address: string;
  priceAmount: number;
  sizeSqft: number | null;
  /** 'exact' | 'postcode' | 'city-centroid' | null — used to pick the best row to keep visible. */
  geocodePrecision: string | null;
}

export interface DedupGroup {
  groupId: string;
  canonicalKey: string;
  memberKeys: string[];
  reason: string;
}

const STOPWORDS = new Set([
  'to', 'the', 'of', 'at', 'in', 'on', 'and', 'a', 'an', 'adjacent', 'land', 'site',
]);

/** Lowercase, strip punctuation, drop short/filler words — for comparing two addresses loosely. */
export function addressTokens(address: string): Set<string> {
  return new Set(
    address
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOPWORDS.has(t)),
  );
}

/** Overlap ratio relative to the smaller token set (0..1). */
export function tokenOverlap(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const t of a) if (b.has(t)) shared++;
  return shared / Math.min(a.size, b.size);
}

/** Minimum shared-token ratio (of the shorter address) to treat a price+size match as a real duplicate. */
export const ADDRESS_OVERLAP_THRESHOLD = 0.3;

const PRECISION_RANK: Record<string, number> = { exact: 3, postcode: 2, 'city-centroid': 1 };

/** Prefer the most precisely-geocoded row; on a tie, a non-portal (directly-scraped) source; on a further tie, the longer/more descriptive address. */
function pickCanonical(rows: DedupCandidate[]): DedupCandidate {
  return [...rows].sort((a, b) => {
    const precisionDiff = (PRECISION_RANK[b.geocodePrecision ?? ''] ?? 0) - (PRECISION_RANK[a.geocodePrecision ?? ''] ?? 0);
    if (precisionDiff !== 0) return precisionDiff;
    const directSourceDiff = Number(a.source === 'Rightmove Commercial') - Number(b.source === 'Rightmove Commercial');
    if (directSourceDiff !== 0) return directSourceDiff;
    return b.address.length - a.address.length;
  })[0]!;
}

/**
 * Group candidates that are almost certainly the same physical listing.
 * Deterministic (stable groupId derived from price/size), so re-running
 * against the same data always produces the same grouping.
 */
export function findDuplicateGroups(candidates: DedupCandidate[]): DedupGroup[] {
  const byPriceSize = new Map<string, DedupCandidate[]>();
  for (const c of candidates) {
    if (c.priceAmount <= 0 || !c.sizeSqft || c.sizeSqft <= 0) continue;
    const k = `${c.priceAmount}:${c.sizeSqft}`;
    (byPriceSize.get(k) ?? byPriceSize.set(k, []).get(k)!).push(c);
  }

  const groups: DedupGroup[] = [];
  for (const [key, rows] of byPriceSize) {
    if (rows.length < 2) continue;
    // Within a price+size bucket, cluster further by address overlap — two
    // unrelated properties sharing a price+size coincidentally shouldn't merge.
    const clusters: DedupCandidate[][] = [];
    for (const row of rows) {
      const tokens = addressTokens(row.address);
      const cluster = clusters.find((c) => tokenOverlap(tokens, addressTokens(c[0]!.address)) >= ADDRESS_OVERLAP_THRESHOLD);
      if (cluster) cluster.push(row);
      else clusters.push([row]);
    }
    for (const [i, cluster] of clusters.entries()) {
      if (cluster.length < 2) continue;
      const canonical = pickCanonical(cluster);
      groups.push({
        groupId: `${key}#${i}`,
        canonicalKey: canonical.key,
        memberKeys: cluster.map((c) => c.key),
        reason: `same price (£${canonical.priceAmount.toLocaleString('en-GB')}) and size (${canonical.sizeSqft!.toLocaleString('en-GB')} sq ft), overlapping address`,
      });
    }
  }
  return groups;
}
