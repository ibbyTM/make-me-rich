/**
 * Upgrade Rightmove Commercial listings from city-centroid approximation to
 * precise, address-level Data Centre Fit geocoding (2026-07-19 follow-up to
 * docs/data-centre-fit-2026-07-19.md).
 *
 * Investigation before this script existed (see docs/rightmove-detail-
 * geocode-2026-07-19.md for the full writeup): a handful of real Rightmove
 * detail pages were checked by hand for embedded coordinates. Confirmed
 * present — a `schema.org/Place` JSON-LD block with real `latitude`/
 * `longitude` — on every sample checked, even though the visible address
 * text is a human-readable street/area description with no postcode.
 * robots.txt (re-checked 2026-07-19) does not disallow the `/properties/<id>`
 * detail-page path.
 *
 * Scope, deliberately bounded:
 *   - Only the listings that already passed Stage-0 and are sitting in
 *     dashboard/data/rightmove.json — NOT the full raw pull.
 *   - Same 1.5s delay between requests as fetchCityListings elsewhere in this
 *     scraper (src/scrapers/rightmoveCommercial.ts) — applied only to
 *     listings this run actually has to fetch (see cache below).
 *   - A listing whose detail page fetch fails, or whose page has no Place
 *     ld+json block, is left on its existing city-centroid approximation and
 *     counted as "not upgraded" — never guessed at or estimated.
 *
 * Cache (added 2026-07-19, second run): rightmove-commercial-report.ts fully
 * regenerates dashboard/data/rightmove.json on every run (documented ordering
 * note below), which wipes this script's enrichment fields along with it —
 * so every re-run used to mean re-fetching all ~190 detail pages from
 * scratch, ~20-30 minutes, even for listings whose coordinates we already
 * know. dashboard/data/.rightmove-coords-cache.json persists { url: {lat,lon}
 * | null } across runs (null = confirmed no Place block, not "not checked
 * yet") so a re-run after a fresh base pull only fetches genuinely new
 * listing URLs.
 *
 * IMPORTANT ordering note: this must run AFTER rightmove-commercial-
 * report.ts, every time — if you refresh listings and don't re-run this
 * script, the dashboard will show stale/missing power-station data on the
 * new rows. There's no dependency-tracking here yet; the cache reduces the
 * cost of that but doesn't remove the need to re-run.
 *
 *   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
 *     node --import tsx scripts/rightmove-detail-geocode.ts
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fetchListingCoordinates } from '../src/scrapers/rightmoveCommercial.js';
import { loadGbPowerStations, nearestStation, type PowerStation } from '../src/geo/powerStations.js';
import { scoreDataCentreFit, sizeSqftEquivalent, MAJOR_STATION_MIN_MW } from '../src/scoring/dataCentreFit.js';

interface DashboardRow {
  address: string;
  url: string;
  sizeLabel?: string;
  sizeSqft?: number | null;
  propertyType?: string;
  powerStation?: Record<string, unknown>;
  dataCentreFit?: Record<string, unknown>;
  [key: string]: unknown;
}

type Coords = { lat: number; lon: number } | null;

const PATH = 'dashboard/data/rightmove.json';
const CACHE_PATH = 'dashboard/data/.rightmove-coords-cache.json';
const DELAY_MS = 1500;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function loadCache(): Promise<Record<string, Coords>> {
  try {
    return JSON.parse(await readFile(CACHE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

async function main() {
  const data = JSON.parse(await readFile(PATH, 'utf8')) as { rows: DashboardRow[]; [k: string]: unknown };
  const stations: PowerStation[] = await loadGbPowerStations();
  const cache = await loadCache();

  let upgraded = 0;
  let noBlock = 0;
  let fetchFailed = 0;
  let fromCache = 0;
  let freshlyFetched = 0;
  const bandBefore: Record<string, number> = {};
  const bandAfter: Record<string, number> = {};

  for (let i = 0; i < data.rows.length; i++) {
    const row = data.rows[i]!;

    const before = (row.dataCentreFit as { band?: string } | undefined)?.band ?? 'unknown';
    bandBefore[before] = (bandBefore[before] ?? 0) + 1;

    process.stderr.write(`[${i + 1}/${data.rows.length}] ${row.url} ... `);

    let coords: Coords;
    if (Object.prototype.hasOwnProperty.call(cache, row.url)) {
      coords = cache[row.url]!;
      fromCache++;
      process.stderr.write('(cached) ');
    } else {
      if (freshlyFetched > 0) await sleep(DELAY_MS);
      freshlyFetched++;
      try {
        coords = await fetchListingCoordinates(row.url);
        cache[row.url] = coords;
      } catch (e) {
        fetchFailed++;
        process.stderr.write(`fetch failed (${e instanceof Error ? e.message : e})\n`);
        const after = (row.dataCentreFit as { band?: string } | undefined)?.band ?? 'unknown';
        bandAfter[after] = (bandAfter[after] ?? 0) + 1;
        continue; // don't cache a transient failure — retry next run
      }
    }

    if (!coords) {
      noBlock++;
      process.stderr.write('no Place ld+json block\n');
      const after = (row.dataCentreFit as { band?: string } | undefined)?.band ?? 'unknown';
      bandAfter[after] = (bandAfter[after] ?? 0) + 1;
      continue;
    }

    const anyStation = nearestStation(coords, stations);
    const majorStation = nearestStation(coords, stations, { minCapacityMw: MAJOR_STATION_MIN_MW });
    const sqft = sizeSqftEquivalent(row.sizeLabel ?? '', row.sizeSqft ?? null);
    const fit = scoreDataCentreFit({
      nearestMajorStationKm: majorStation?.distanceKm ?? null,
      sizeSqftEquivalent: sqft,
      propertyType: row.propertyType ?? '',
    });

    row.powerStation = {
      geocodePrecision: 'exact',
      lat: coords.lat,
      lon: coords.lon,
      nearestAnyKm: anyStation ? Number(anyStation.distanceKm.toFixed(1)) : null,
      nearestAnyName: anyStation?.station.name ?? null,
      nearestAnyFuel: anyStation?.station.fuel ?? null,
      nearestMajorKm: majorStation ? Number(majorStation.distanceKm.toFixed(1)) : null,
      nearestMajorName: majorStation?.station.name ?? null,
      nearestMajorFuel: majorStation?.station.fuel ?? null,
      nearestMajorCapacityMw: majorStation?.station.capacityMw ?? null,
    };
    row.dataCentreFit = fit;
    upgraded++;
    process.stderr.write(`exact: ${coords.lat},${coords.lon} — ${fit.band} (${fit.score})\n`);

    bandAfter[fit.band] = (bandAfter[fit.band] ?? 0) + 1;
  }

  await writeFile(PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n', 'utf8');

  console.log(
    JSON.stringify(
      {
        totalRows: data.rows.length,
        fromCache,
        freshlyFetched,
        upgradedToExact: upgraded,
        noPlaceBlock: noBlock,
        fetchFailed,
        bandBefore,
        bandAfter,
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
