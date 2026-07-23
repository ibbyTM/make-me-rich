/**
 * Large-corporate-agent policy override (2026-07-19 discovery batch decision).
 *
 * CBRE, Savills and Knight Frank Commercial are technically ordinary agent
 * sites (not multi-agent portals), so they go through the generic
 * `classifySite` heuristics rather than the `portals.ts` shortcut. But given
 * their scale, a technical "scrapeable" verdict alone isn't a green light —
 * this registry forces mandatory human review regardless of the technical
 * classification, mirroring the portal registry's "always route to review"
 * rule. It does not change the detected classification itself, only the
 * tosFlag/decision, so the genuine technical finding stays visible in the
 * audit trail alongside the policy reason.
 */

interface BigCorporateDefinition {
  hosts: string[];
  name: string;
}

const BIG_CORPORATES: BigCorporateDefinition[] = [
  { name: 'CBRE UK', hosts: ['cbre.co.uk'] },
  { name: 'Savills UK', hosts: ['savills.co.uk', 'search.savills.com'] },
  { name: 'Knight Frank Commercial', hosts: ['knightfrank.co.uk'] },
];

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function matchBigCorporate(url: string): BigCorporateDefinition | null {
  const host = hostnameOf(url);
  if (!host) return null;
  return (
    BIG_CORPORATES.find((c) => c.hosts.some((h) => host === h || host.endsWith('.' + h))) ?? null
  );
}

export function isBigCorporate(url: string): boolean {
  return matchBigCorporate(url) !== null;
}
