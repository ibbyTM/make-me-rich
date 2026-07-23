/**
 * Real per-substation power capacity (MVA), for the subset of GB this
 * actually exists for as free, no-registration data — added 2026-07-23
 * after the user pointed out kV (voltage) isn't what's wanted; MW/MVA
 * (power capacity) is a different physical quantity and doesn't derive
 * from voltage without load data that isn't in any free source (see
 * docs/substation-capacity-2026-07-23.md).
 *
 * Source: Northern Powergrid's open data portal
 * (northernpowergrid.opendatasoft.com/explore/dataset/substation_sites_list),
 * confirmed no-login. Checked every other DNO covering this pipeline's
 * geographies (Electricity North West — Greater Manchester/Merseyside/
 * Lancashire; NGED — West Midlands/East Midlands) and both gate their
 * capacity/substation datasets behind login/registration, so this only
 * covers Northern Powergrid's own license area: Yorkshire and North East
 * England. data/npg-substation-capacity.json is pre-filtered from NPG's raw
 * 58k-row site list down to the 683 Primary/BSP/GSP-level sites (33kV+,
 * matching the tiers src/geo/substations.ts already scores) that carry a
 * real `firm_capacity_mva` figure — most of the 58k rows are small 11kV/
 * 400V distribution transformers marked "Not Applicable" for firm capacity
 * and are excluded.
 *
 * Deliberately a separate, additive signal from src/geo/substations.ts, not
 * a replacement: that module's GB-wide OSM voltage data still drives the
 * Data Centre Fit score everywhere (so scoring stays on one consistent
 * scale nationally). This module only replaces what's *displayed* on a
 * card's substation badge — real MVA where a matching NPG substation is
 * close by, otherwise the existing kV badge, so nothing is fabricated for
 * the ~3/5 of this pipeline's geography NPG doesn't cover.
 */

import { readFile } from 'node:fs/promises';
import { haversineKm } from './powerStations.js';
import type { LatLon } from './postcodes.js';

export interface SubstationCapacity {
  name: string;
  lat: number;
  lon: number;
  firmCapacityMva: number;
  siteLevel: 'Primary' | 'BSP' | 'GSP';
  primaryVoltageKv: number | null;
  dnoArea: string;
  postcode: string | null;
}

export async function loadNpgSubstationCapacity(
  path = new URL('../../data/npg-substation-capacity.json', import.meta.url),
): Promise<SubstationCapacity[]> {
  const json = await readFile(path, 'utf8');
  return JSON.parse(json) as SubstationCapacity[];
}

export interface NearestCapacityResult {
  substation: SubstationCapacity;
  distanceKm: number;
}

/** Nearest real-capacity substation within maxKm, or null if none of NPG's 683 sites are that close (i.e. the listing isn't in Yorkshire/North East, or is far from any Primary+ site). */
export function nearestCapacitySubstation(
  point: LatLon,
  substations: SubstationCapacity[],
  maxKm = 8,
): NearestCapacityResult | null {
  let best: NearestCapacityResult | null = null;
  for (const substation of substations) {
    const distanceKm = haversineKm(point, substation);
    if (distanceKm > maxKm) continue;
    if (!best || distanceKm < best.distanceKm) best = { substation, distanceKm };
  }
  return best;
}
