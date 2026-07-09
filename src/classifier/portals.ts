/**
 * Portal integrations (spec §5, third bullet — in scope for this sprint).
 *
 * Portals such as Rightmove Commercial and EG Propertylink aggregate many
 * agents under one structure, so they need bespoke classification rather than
 * the generic `classifySite` heuristics. This module owns a small registry of
 * known portals and returns a purpose-built classification for them.
 *
 * A portal is *always* routed to review the first time it is seen: it stands up
 * a many-agent integration, which is a business/legal decision, not something
 * the generic confidence gate should auto-approve.
 */

import type { ClassificationResult } from '../types.js';

interface PortalDefinition {
  /** Host suffixes that identify the portal. */
  hosts: string[];
  name: string;
  /** Bespoke scraper strategy for this portal's structure. */
  scraperStrategy: string;
  notes: string;
}

const PORTALS: PortalDefinition[] = [
  {
    name: 'Rightmove Commercial',
    hosts: ['rightmove.co.uk'],
    scraperStrategy: 'apify~portal-rightmove-commercial',
    notes: 'Rightmove Commercial aggregates many agents; uses embedded __NEXT_DATA__ model.',
  },
  {
    name: 'EG Propertylink',
    hosts: ['propertylink.estatesgazette.com', 'egi.co.uk', 'eg.co.uk'],
    scraperStrategy: 'apify~portal-eg-propertylink',
    notes: 'EGi / EG Propertylink aggregates agents behind an authenticated JSON API.',
  },
  {
    name: 'CoStar / LoopNet',
    hosts: ['loopnet.co.uk', 'costar.co.uk'],
    scraperStrategy: 'apify~portal-costar',
    notes: 'CoStar/LoopNet aggregate listings behind a JSON API with anti-bot protection.',
  },
];

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** Returns the matching portal definition, or null if this URL is not a known portal. */
export function matchPortal(url: string): PortalDefinition | null {
  const host = hostnameOf(url);
  if (!host) return null;
  return (
    PORTALS.find((p) => p.hosts.some((h) => host === h || host.endsWith('.' + h))) ??
    null
  );
}

export function isPortal(url: string): boolean {
  return matchPortal(url) !== null;
}

/**
 * Bespoke classification for a known portal. Portals are treated as their own
 * source type: classified with high confidence but always queued for review so
 * a human confirms the many-agent integration before it goes live.
 */
export function classifyPortal(url: string, now: () => Date): ClassificationResult {
  const portal = matchPortal(url);
  if (!portal) {
    throw new Error(`classifyPortal called for non-portal URL: ${url}`);
  }
  return {
    url,
    classification: 'api_endpoint',
    confidence: 0.95,
    scraperStrategy: portal.scraperStrategy,
    // Not a ToS restriction, but the many-agent nature forces human review.
    tosFlag: false,
    detectedStructure: `PORTAL(${portal.name}): ${portal.notes} — routed to review (aggregates multiple agents).`,
    decision: 'queued_for_review',
    resultingStatus: 'pending_review',
    classifiedAt: now().toISOString(),
  };
}
