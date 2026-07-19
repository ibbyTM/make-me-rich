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
import { checkRobotsAndTos } from './detectors.js';

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
  {
    name: 'Zoopla Commercial',
    hosts: ['zoopla.co.uk'],
    scraperStrategy: 'apify~portal-zoopla-commercial',
    notes: 'Zoopla Commercial aggregates many agents; CoStar-owned, anti-bot protected (added 2026-07-19).',
  },
  {
    name: 'NovaLoca',
    hosts: ['novaloca.com'],
    scraperStrategy: 'apify~portal-novaloca',
    notes: 'NovaLoca aggregates listings from 1,000+ UK commercial agents (added 2026-07-19).',
  },
  {
    // Realla was acquired by CoStar in 2018 (public record). realla.com no
    // longer resolves at all (DNS failure, checked 2026-07-19); realla.co.uk
    // still resolves but returned HTTP 403 to every automated request tried
    // this pass — consistent with, but not proof of, having moved onto
    // CoStar's shared anti-bot stack alongside LoopNet.
    name: 'Realla (CoStar)',
    hosts: ['realla.co.uk'],
    scraperStrategy: 'apify~portal-costar',
    notes: 'Realla was acquired by CoStar (2018); realla.com no longer resolves, realla.co.uk 403s every automated request.',
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
 * a human confirms the many-agent integration before it goes live — decision
 * and resultingStatus are hardcoded to review regardless of what the gate
 * below finds. The robots/ToS gate itself is still run for real (2026-07-19
 * fix — it used to be skipped entirely for portals, hardcoding tosFlag:
 * false), so the audit trail records genuine live findings even though they
 * can't change a portal's always-review decision.
 */
export function classifyPortal(
  url: string,
  now: () => Date,
  robotsTxt?: string,
  tosText?: string,
): ClassificationResult {
  const portal = matchPortal(url);
  if (!portal) {
    throw new Error(`classifyPortal called for non-portal URL: ${url}`);
  }
  const gate = checkRobotsAndTos(robotsTxt, tosText);
  const notes = `PORTAL(${portal.name}): ${portal.notes} — routed to review (aggregates multiple agents).${
    gate.found ? ` TOS GATE: ${gate.notes}` : ''
  }`;
  return {
    url,
    classification: 'api_endpoint',
    confidence: 0.95,
    scraperStrategy: portal.scraperStrategy,
    tosFlag: gate.found,
    detectedStructure: notes,
    decision: 'queued_for_review',
    resultingStatus: 'pending_review',
    classifiedAt: now().toISOString(),
  };
}
