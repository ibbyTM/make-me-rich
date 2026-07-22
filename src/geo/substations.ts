/**
 * GB electricity substation locations, for Data Centre Fit's grid-connection
 * signal (2026-07-22 rebuild — see docs/data-centre-fit-substations-2026-07-22.md).
 *
 * Proximity to a *power station* is a proxy for grid connectivity, and a
 * noisy one: checked against the live dataset, half of the 185 GB power
 * stations >=50MW are wind farms, which sit in remote/rural locations far
 * from the kind of substantial grid infrastructure a data centre actually
 * needs to tap into — "near a big wind farm" doesn't mean "near spare grid
 * capacity" the way "near a 275kV substation" does. What a data centre
 * actually connects to is a *substation*, not a power station directly.
 *
 * Source: OpenStreetMap, via the free, no-auth Overpass API
 * (overpass-api.de) — `power=substation` nodes/ways carrying a `voltage=*`
 * tag. Confirmed by manual query (2026-07-22): high-voltage transmission
 * substations (275/400kV) are well-mapped in GB from open NPE/OS sources per
 * OSM's own "Power networks/Great Britain" wiki page; lower-voltage
 * distribution substations are patchier but plentiful. Untagged substations
 * (no `voltage` value) are excluded — without a voltage figure there's no
 * way to tell a 400kV grid supply point from a small local transformer
 * serving a handful of houses, and OSM confirms most untagged nodes here
 * (~85% in a sample GB query) are that kind of local secondary substation.
 */

import { readFile } from 'node:fs/promises';
import { haversineKm } from './powerStations.js';
import type { LatLon } from './postcodes.js';

export interface Substation {
  name: string;
  lat: number;
  lon: number;
  voltageV: number;
}

export type VoltageTier = 'transmission' | 'grid-supply' | 'primary' | 'local-primary';

const TIER_THRESHOLDS: { minVoltageV: number; tier: VoltageTier; basePoints: number }[] = [
  { minVoltageV: 275_000, tier: 'transmission', basePoints: 60 },
  { minVoltageV: 132_000, tier: 'grid-supply', basePoints: 50 },
  { minVoltageV: 66_000, tier: 'primary', basePoints: 35 },
  { minVoltageV: 33_000, tier: 'local-primary', basePoints: 20 },
];

/** Below 33kV is local distribution — not a meaningful grid-capacity signal for a data centre. Returns null. */
export function classifyVoltage(voltageV: number): { tier: VoltageTier; basePoints: number } | null {
  for (const t of TIER_THRESHOLDS) {
    if (voltageV >= t.minVoltageV) return { tier: t.tier, basePoints: t.basePoints };
  }
  return null;
}

/** OSM's voltage tag can be semicolon-separated ("132000;33000;11000") when several voltage levels transform at one site — take the highest, since that's what determines the substation's real grid tier. */
export function parseVoltageTag(raw: string): number | null {
  const values = raw
    .split(';')
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isFinite(v) && v > 0);
  return values.length ? Math.max(...values) : null;
}

const DISTANCE_DECAY: { maxKm: number; factor: number }[] = [
  { maxKm: 2, factor: 1.0 },
  { maxKm: 5, factor: 0.85 },
  { maxKm: 10, factor: 0.6 },
  { maxKm: 20, factor: 0.35 },
  { maxKm: 40, factor: 0.15 },
  { maxKm: Infinity, factor: 0 },
];

function decayFactor(km: number): number {
  return DISTANCE_DECAY.find((b) => km <= b.maxKm)!.factor;
}

export async function loadGbSubstations(
  path = new URL('../../data/gb-substations.json', import.meta.url),
): Promise<Substation[]> {
  const json = await readFile(path, 'utf8');
  return JSON.parse(json) as Substation[];
}

export interface NearestSubstationResult {
  substation: Substation;
  distanceKm: number;
  tier: VoltageTier;
  points: number;
}

/**
 * Best substation-proximity score for `point`: for every substation with a
 * classifiable voltage, points = tier's base points × distance decay factor;
 * returns whichever substation yields the highest points (not necessarily
 * the physically nearest one — a 275kV substation 8km away can outscore a
 * 33kV substation 1km away, which is the right tradeoff for grid capacity).
 */
export function bestSubstationScore(point: LatLon, substations: Substation[]): NearestSubstationResult | null {
  let best: NearestSubstationResult | null = null;
  for (const substation of substations) {
    const classified = classifyVoltage(substation.voltageV);
    if (!classified) continue;
    const distanceKm = haversineKm(point, substation);
    const points = Math.round(classified.basePoints * decayFactor(distanceKm));
    if (!best || points > best.points) {
      best = { substation, distanceKm, tier: classified.tier, points };
    }
  }
  return best;
}
