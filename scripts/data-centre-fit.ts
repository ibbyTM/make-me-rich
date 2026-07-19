/**
 * "Data Centre Fit" analysis (Phase 1, 2026-07-19) — read-only enrichment of
 * listings already sitting in dashboard/data/*.json. No new scraping, no new
 * sites: this reads the same three files the existing report scripts already
 * write, geocodes each listing, finds its nearest power station, scores it,
 * and writes the same three files back out with two new fields per row
 * (`powerStation`, `dataCentreFit`) — every existing field is preserved.
 *
 * IMPORTANT ordering note: barnsdales-report.ts / rightmove-commercial-
 * report.ts / discovered-agents-report.ts each fully REGENERATE their JSON
 * file from a fresh live pull (spec: one script, one file, full overwrite).
 * This script has to run AFTER them, every time — if you refresh listings and
 * don't re-run this script, the dashboard will show stale/missing power-
 * station data on the new rows. There's no dependency-tracking here yet
 * (Phase 1 scope); this is a known, documented limitation, not a bug.
 *
 * Geocoding precision (see src/geo/postcodes.ts for the full reasoning):
 *   - Barnsdales / PropertyHive-sourced rows carry a real postcode in their
 *     address string → exact, address-level geocoding via postcodes.io bulk
 *     lookup.
 *   - Rightmove Commercial rows carry no postcode at all in the stored data
 *     (confirmed in the scraper itself) — only a city name. Those get a
 *     CITY-CENTRE-CENTROID approximation (postcodes.io outcode lookup for
 *     that city's central postcode district), which is coarse: every listing
 *     from the same city collapses to one point. This is flagged per-row via
 *     `powerStation.geocodePrecision` and called out explicitly in the report
 *     — Rightmove is ~95% of current dashboard volume, so this matters for
 *     trusting the numbers.
 *
 *   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
 *     node --import tsx scripts/data-centre-fit.ts
 */

import { readFile, writeFile } from 'node:fs/promises';
import {
  extractPostcode,
  extractTrailingParen,
  bulkGeocodePostcodes,
  outcodeCentroid,
  type LatLon,
} from '../src/geo/postcodes.js';
import { loadGbPowerStations, nearestStation, type PowerStation } from '../src/geo/powerStations.js';
import { scoreDataCentreFit, sizeSqftEquivalent, MAJOR_STATION_MIN_MW } from '../src/scoring/dataCentreFit.js';

/** Rightmove rows only ever carry these 7 city names (src/scrapers/rightmoveCommercial.ts CITYWIDE_CITIES) — a representative central outcode per city, for the approximate fallback. */
const CITY_CENTRE_OUTCODE: Record<string, string> = {
  Leeds: 'LS1',
  Sheffield: 'S1',
  Bradford: 'BD1',
  Huddersfield: 'HD1',
  Doncaster: 'DN1',
  Manchester: 'M1',
  Bolton: 'BL1',
};

interface DashboardRow {
  address: string;
  sizeLabel?: string;
  sizeSqft?: number | null;
  propertyType?: string;
  [key: string]: unknown;
}

interface DashboardFile {
  source: string;
  generatedAt: string;
  rows: DashboardRow[];
}

const FILES = ['dashboard/data/barnsdales.json', 'dashboard/data/rightmove.json', 'dashboard/data/discovered.json'];

async function main() {
  const files: { path: string; data: DashboardFile }[] = [];
  for (const path of FILES) {
    files.push({ path, data: JSON.parse(await readFile(path, 'utf8')) as DashboardFile });
  }

  // --- Collect geocoding keys -------------------------------------------
  const postcodes = new Set<string>();
  const cities = new Set<string>();
  for (const { data } of files) {
    for (const row of data.rows) {
      const pc = extractPostcode(row.address);
      if (pc) {
        postcodes.add(pc);
        continue;
      }
      const city = extractTrailingParen(row.address);
      if (city && CITY_CENTRE_OUTCODE[city]) cities.add(city);
    }
  }

  process.stderr.write(`geocoding ${postcodes.size} unique postcodes (exact) + ${cities.size} unique cities (approximate) ...\n`);
  const postcodeGeo = await bulkGeocodePostcodes([...postcodes]);
  const cityGeo = new Map<string, LatLon>();
  for (const city of cities) {
    const centroid = await outcodeCentroid(CITY_CENTRE_OUTCODE[city]!);
    if (centroid) cityGeo.set(city, centroid);
  }

  process.stderr.write('loading GB power station dataset ...\n');
  const stations: PowerStation[] = await loadGbPowerStations();
  process.stderr.write(`${stations.length} generation sites loaded.\n`);

  // --- Enrich every row ----------------------------------------------------
  const distScoreRows: { score: number; distanceKm: number | null; sqft: number | null; precision: string }[] = [];

  for (const { data } of files) {
    for (const row of data.rows) {
      let point: LatLon | null = null;
      let precision: 'postcode' | 'city-centroid' | 'none' = 'none';

      const pc = extractPostcode(row.address);
      if (pc && postcodeGeo.has(pc)) {
        point = postcodeGeo.get(pc)!;
        precision = 'postcode';
      } else {
        const city = extractTrailingParen(row.address);
        if (city && cityGeo.has(city)) {
          point = cityGeo.get(city)!;
          precision = 'city-centroid';
        }
      }

      const anyStation = point ? nearestStation(point, stations) : null;
      const majorStation = point ? nearestStation(point, stations, { minCapacityMw: MAJOR_STATION_MIN_MW }) : null;

      const sqft = sizeSqftEquivalent(row.sizeLabel ?? '', row.sizeSqft ?? null);
      const fit = scoreDataCentreFit({
        nearestMajorStationKm: majorStation?.distanceKm ?? null,
        sizeSqftEquivalent: sqft,
        propertyType: row.propertyType ?? '',
      });

      row.powerStation = {
        geocodePrecision: precision,
        nearestAnyKm: anyStation ? Number(anyStation.distanceKm.toFixed(1)) : null,
        nearestAnyName: anyStation?.station.name ?? null,
        nearestAnyFuel: anyStation?.station.fuel ?? null,
        nearestMajorKm: majorStation ? Number(majorStation.distanceKm.toFixed(1)) : null,
        nearestMajorName: majorStation?.station.name ?? null,
        nearestMajorFuel: majorStation?.station.fuel ?? null,
        nearestMajorCapacityMw: majorStation?.station.capacityMw ?? null,
      };
      row.dataCentreFit = fit;

      distScoreRows.push({ score: fit.score, distanceKm: majorStation?.distanceKm ?? null, sqft, precision });
    }
  }

  for (const { path, data } of files) {
    await writeFile(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }

  // --- Summary for the report ------------------------------------------
  const total = distScoreRows.length;
  const geocoded = distScoreRows.filter((r) => r.precision !== 'none').length;
  const byPrecision = { postcode: 0, 'city-centroid': 0, none: 0 } as Record<string, number>;
  for (const r of distScoreRows) byPrecision[r.precision]++;
  const bandCounts = { strong: 0, possible: 0, unlikely: 0 } as Record<string, number>;
  for (const { data } of files) {
    for (const row of data.rows) {
      const band = (row.dataCentreFit as { band: string }).band;
      bandCounts[band] = (bandCounts[band] ?? 0) + 1;
    }
  }
  const distances = distScoreRows.map((r) => r.distanceKm).filter((d): d is number => d !== null).sort((a, b) => a - b);
  const median = distances.length ? distances[Math.floor(distances.length / 2)] : null;

  console.log(
    JSON.stringify(
      {
        totalRows: total,
        geocoded,
        byPrecision,
        bandCounts,
        distanceKmStats: distances.length
          ? { min: distances[0], median, max: distances[distances.length - 1] }
          : null,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
