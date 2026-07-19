/**
 * GB power station locations, for nearest-station distance analysis.
 *
 * Source: the OSUKED Power Station Dictionary (github.com/OSUKED/
 * Power-Station-Dictionary) is an ID-crosswalk, not a location dataset itself
 * — it links each station to entries in other datasets, one of which is the
 * one actually used here: the World Resources Institute's Global Power Plant
 * Database (github.com/wri/global-power-plant-database, CC-BY-4.0), filtered
 * to country=GBR. It carries the fields the dictionary's own docs point to
 * for location + fuel type (latitude/longitude/primary_fuel), which the
 * dictionary's own ID table does not. A trimmed snapshot (name/capacity_mw/
 * latitude/longitude/primary_fuel only, all 2,751 GB generation sites,
 * fetched 2026-07-19) is committed at data/gb-power-stations.csv — refresh by
 * re-running the same filter against a fresh copy of the WRI CSV.
 *
 * "Generation sites only" — this is exactly what GPPD contains (no
 * substations/distribution assets), so no additional filtering was needed on
 * that front. Capacity ranges from 1MW (small farm-scale solar/biomass) to
 * 2,180MW (major nuclear/gas) — kept in full for `nearestAnyKm`, with a
 * capacity threshold available for `nearestStation({ minCapacityMw })` since
 * proximity to a 1MW rooftop array isn't a meaningful grid-connection signal
 * for data-centre siting the way proximity to a major station is.
 */

import { readFile } from 'node:fs/promises';
import type { LatLon } from './postcodes.js';

export interface PowerStation {
  name: string;
  capacityMw: number;
  lat: number;
  lon: number;
  fuel: string;
}

/** Parse the trimmed CSV (see file header) into PowerStation records. */
export function parseGbPowerStationsCsv(csv: string): PowerStation[] {
  const lines = csv.trim().split('\n');
  const stations: PowerStation[] = [];
  for (const line of lines.slice(1)) {
    const [name, capacityMw, lat, lon, fuel] = line.split(',');
    if (!name || !lat || !lon) continue;
    stations.push({
      name,
      capacityMw: Number(capacityMw) || 0,
      lat: Number(lat),
      lon: Number(lon),
      fuel: (fuel ?? '').trim(),
    });
  }
  return stations;
}

export async function loadGbPowerStations(
  path = new URL('../../data/gb-power-stations.csv', import.meta.url),
): Promise<PowerStation[]> {
  const csv = await readFile(path, 'utf8');
  return parseGbPowerStationsCsv(csv);
}

const EARTH_RADIUS_KM = 6371;

/** Great-circle distance between two points, in km. */
export function haversineKm(a: LatLon, b: LatLon): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export interface NearestStationResult {
  station: PowerStation;
  distanceKm: number;
}

/** Nearest station to `point`, optionally restricted to a minimum capacity. Null if none qualify. */
export function nearestStation(
  point: LatLon,
  stations: PowerStation[],
  opts: { minCapacityMw?: number } = {},
): NearestStationResult | null {
  const pool = opts.minCapacityMw ? stations.filter((s) => s.capacityMw >= opts.minCapacityMw!) : stations;
  let best: NearestStationResult | null = null;
  for (const station of pool) {
    const distanceKm = haversineKm(point, station);
    if (!best || distanceKm < best.distanceKm) best = { station, distanceKm };
  }
  return best;
}
