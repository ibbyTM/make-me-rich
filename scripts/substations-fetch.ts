/**
 * Fetch GB electricity substations (free, no auth, OpenStreetMap via the
 * public Overpass API) covering every area the current dashboard listings
 * fall in — the grid-connection dataset behind the Data Centre Fit rebuild
 * (see docs/data-centre-fit-substations-2026-07-22.md and src/geo/substations.ts
 * for why this replaced power-station proximity as the primary signal).
 *
 * Rather than pull the whole GB substation dataset (tens of thousands of
 * records, mostly irrelevant), this derives a small set of padded bounding
 * boxes from the listings' own geocoded coordinates (reusing the same
 * postcode/city-centroid geocoding as scripts/data-centre-fit.ts) and queries
 * Overpass once per box. Re-run whenever the dataset's geographic spread
 * changes meaningfully (new city, new region) — a listing outside every
 * existing box's padding will simply get no substation match until this is
 * re-run, same "known limitation, not a bug" ordering caveat as the other
 * enrichment scripts.
 *
 *   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
 *     node --import tsx scripts/substations-fetch.ts
 *
 * Output: data/gb-substations.json — committed (typically a few thousand
 * records, a few hundred KB — nowhere near the VOA file's national scale).
 */

import { readFile, writeFile } from 'node:fs/promises';
import {
  extractPostcode,
  extractTrailingParen,
  bulkGeocodePostcodes,
  outcodeCentroid,
  type LatLon,
} from '../src/geo/postcodes.js';
import { parseVoltageTag, type Substation } from '../src/geo/substations.js';

const CITY_CENTRE_OUTCODE: Record<string, string> = {
  Leeds: 'LS1',
  Sheffield: 'S1',
  Bradford: 'BD1',
  Huddersfield: 'HD1',
  Doncaster: 'DN1',
  Manchester: 'M1',
  Bolton: 'BL1',
};

const FILES = ['dashboard/data/barnsdales.json', 'dashboard/data/rightmove.json', 'dashboard/data/discovered.json'];
const OUTPUT_PATH = 'data/gb-substations.json';
// overpass-api.de intermittently 406s on this environment's requests (its load
// balancer announces a different backend hostname than the one dialed —
// confirmed 2026-07-22, same query succeeds seconds later on the mirror
// below); overpass.kumi.systems is a well-established public Overpass mirror,
// same free/no-auth OSM data, and answered reliably in testing.
const OVERPASS_URL = 'https://overpass.kumi.systems/api/interpreter';
const DELAY_BETWEEN_QUERIES_MS = 8000; // Overpass etiquette — avoid hammering the shared public instance

interface DashboardRow {
  address: string;
  powerStation?: { lat?: number; lon?: number };
  [key: string]: unknown;
}

async function collectAllPoints(): Promise<LatLon[]> {
  const files: { rows: DashboardRow[] }[] = [];
  for (const path of FILES) files.push(JSON.parse(await readFile(path, 'utf8')));
  const allRows = files.flatMap((f) => f.rows);

  const points: LatLon[] = [];
  const postcodes = new Set<string>();
  const cities = new Set<string>();

  for (const row of allRows) {
    if (row.powerStation?.lat != null && row.powerStation?.lon != null) {
      points.push({ lat: row.powerStation.lat, lon: row.powerStation.lon });
      continue;
    }
    const pc = extractPostcode(row.address);
    if (pc) {
      postcodes.add(pc);
      continue;
    }
    const city = extractTrailingParen(row.address);
    if (city && CITY_CENTRE_OUTCODE[city]) cities.add(city);
  }

  const pcGeo = await bulkGeocodePostcodes([...postcodes]);
  for (const [, v] of pcGeo) points.push(v);
  for (const city of cities) {
    const c = await outcodeCentroid(CITY_CENTRE_OUTCODE[city]!);
    if (c) points.push(c);
  }
  return points;
}

interface BoundingBox {
  south: number;
  west: number;
  north: number;
  east: number;
}

/**
 * Grid-cell clustering with padding, so nearby listings share one Overpass
 * query instead of one each. Cell size deliberately small (~30km): a single
 * 1-degree cell covering a wide scatter of points (Doncaster to
 * Nottinghamshire) produced a ~155km x 160km box that timed out against the
 * shared public Overpass instance (confirmed 2026-07-22, 70s with zero
 * bytes back) — smaller, more numerous boxes are each cheap/fast even
 * though there are more of them.
 */
function clusterIntoBoxes(points: LatLon[]): BoundingBox[] {
  const CELL_SIZE = 0.3;
  const PAD_LAT = 0.15; // ~17km
  const PAD_LON = 0.2; // ~15km at GB latitudes
  const cells = new Map<string, LatLon[]>();
  for (const p of points) {
    const key = `${Math.floor(p.lat / CELL_SIZE)},${Math.floor(p.lon / CELL_SIZE)}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key)!.push(p);
  }
  const boxes: BoundingBox[] = [];
  for (const group of cells.values()) {
    const lats = group.map((p) => p.lat);
    const lons = group.map((p) => p.lon);
    boxes.push({
      south: Math.min(...lats) - PAD_LAT,
      west: Math.min(...lons) - PAD_LON,
      north: Math.max(...lats) + PAD_LAT,
      east: Math.max(...lons) + PAD_LON,
    });
  }
  return boxes;
}

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MAX_RETRIES = 5;

/** Overpass's shared public instances rate-limit and occasionally 406 under load — retry with exponential backoff rather than fail the whole run over a transient block. */
async function queryOverpassBox(box: BoundingBox): Promise<OverpassElement[]> {
  const query = `[out:json][timeout:60];(node["power"="substation"]["voltage"](${box.south},${box.west},${box.north},${box.east});way["power"="substation"]["voltage"](${box.south},${box.west},${box.north},${box.east}););out center tags;`;
  const url = `${OVERPASS_URL}?data=${encodeURIComponent(query)}`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const backoffMs = 5000 * 2 ** (attempt - 1); // 5s, 10s, 20s, 40s, 80s
      process.stderr.write(`retry ${attempt}/${MAX_RETRIES} after ${backoffMs / 1000}s ... `);
      await sleep(backoffMs);
    }
    const res = await fetch(url);
    if (res.ok) {
      const body = (await res.json()) as { elements: OverpassElement[] };
      return body.elements;
    }
    lastError = new Error(`Overpass query failed: HTTP ${res.status}`);
  }
  throw lastError;
}

async function main() {
  process.stderr.write('Collecting listing coordinates...\n');
  const points = await collectAllPoints();
  process.stderr.write(`${points.length} points collected.\n`);

  const boxes = clusterIntoBoxes(points);
  process.stderr.write(`Querying Overpass for ${boxes.length} bounding box(es)...\n`);

  // Seed from any existing output so a re-run (after some boxes failed last
  // time) MERGES with prior progress instead of gambling on the same set of
  // boxes succeeding again — the shared public Overpass instance's load
  // varies run to run, so which boxes succeed isn't consistent.
  const substationsById = new Map<number, Substation>();
  try {
    const existing: Substation[] = JSON.parse(await readFile(OUTPUT_PATH, 'utf8'));
    for (const s of existing) if (s.id !== undefined) substationsById.set(s.id, s);
    process.stderr.write(`Seeded ${substationsById.size} substations from existing ${OUTPUT_PATH}.\n`);
  } catch {
    // no existing output — first run, start empty
  }

  const failedBoxes: BoundingBox[] = [];
  for (let i = 0; i < boxes.length; i++) {
    if (i > 0) await sleep(DELAY_BETWEEN_QUERIES_MS);
    const box = boxes[i]!;
    process.stderr.write(`  box ${i + 1}/${boxes.length}: [${box.south.toFixed(2)},${box.west.toFixed(2)},${box.north.toFixed(2)},${box.east.toFixed(2)}] ... `);

    let elements: OverpassElement[];
    try {
      elements = await queryOverpassBox(box);
    } catch (e) {
      // Shared public Overpass mirrors can stay congested well past this
      // box's retry budget — don't let one stubborn box lose every other
      // box's already-fetched data. Log it, keep going, write what we have.
      process.stderr.write(`giving up on this box (${e instanceof Error ? e.message : e}) — continuing\n`);
      failedBoxes.push(box);
      await writeFile(OUTPUT_PATH, JSON.stringify([...substationsById.values()], null, 2) + '\n', 'utf8');
      continue;
    }

    let added = 0;
    for (const el of elements) {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      const voltageRaw = el.tags?.voltage;
      if (lat == null || lon == null || !voltageRaw) continue;
      const voltageV = parseVoltageTag(voltageRaw);
      if (voltageV === null) continue;
      if (substationsById.has(el.id)) continue;
      substationsById.set(el.id, {
        id: el.id,
        name: el.tags?.name ?? el.tags?.operator ?? `substation ${el.id}`,
        lat,
        lon,
        voltageV,
      });
      added++;
    }
    process.stderr.write(`${elements.length} elements, ${added} new substations\n`);
    // Write after every box, not just at the end — a later box failing (or
    // the process being interrupted) still leaves every earlier box's data
    // on disk instead of losing the whole run.
    await writeFile(OUTPUT_PATH, JSON.stringify([...substationsById.values()], null, 2) + '\n', 'utf8');
  }

  const substations = [...substationsById.values()];

  const byTierCount = { transmission: 0, gridSupply: 0, primary: 0, localPrimary: 0, excluded: 0 };
  for (const s of substations) {
    if (s.voltageV >= 275_000) byTierCount.transmission++;
    else if (s.voltageV >= 132_000) byTierCount.gridSupply++;
    else if (s.voltageV >= 66_000) byTierCount.primary++;
    else if (s.voltageV >= 33_000) byTierCount.localPrimary++;
    else byTierCount.excluded++;
  }

  console.log(
    JSON.stringify(
      {
        status: failedBoxes.length ? 'partial_success' : 'success',
        boundingBoxesQueried: boxes.length,
        boundingBoxesFailed: failedBoxes.length,
        failedBoxes: failedBoxes.length ? failedBoxes : undefined,
        totalSubstations: substations.length,
        byTier: byTierCount,
        outputPath: OUTPUT_PATH,
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
