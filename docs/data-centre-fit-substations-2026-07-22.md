# Data Centre Fit: substation rebuild (2026-07-22)

Replaced power-station proximity with electricity-substation proximity as
the primary (60/100 pts) Data Centre Fit signal, after checking the live
scored dataset and finding the power-station signal was noisier than it
looked.

## Why the power-station signal was checked

Before this pass, only 3 of 220 listings scored "strong" on Data Centre
Fit. Investigating why: the underlying dataset is 185 GB power stations
≥50MW, but **92 of those 185 (half) are wind farms**. Wind farms sit in
remote/rural locations — good for wind, not for the kind of substantial
grid infrastructure a data centre actually needs nearby. "Near a big wind
farm" turned out to correlate weakly with "near spare grid capacity," the
same kind of proxy-vs-target mismatch already caught once this session with
Land Registry Price Paid Data vs. commercial comparables.

## What a data centre actually connects to

A data centre draws power from the grid via a **substation** — a
power *station* only matters insofar as it feeds grid capacity somewhere
nearby. Proximity to a substation, weighted by that substation's voltage
tier, is the more direct signal.

## Data source

**OpenStreetMap**, queried via the free, no-auth Overpass API —
`power=substation` nodes/ways carrying a `voltage=*` tag. Per OSM's own
"Power networks/Great Britain" wiki page, high-voltage transmission
substations (275/400kV) are well-mapped in GB from open NPE/OS sources;
lower-voltage distribution substations are patchier but plentiful.
Untagged substations (no `voltage` value) are excluded — in a live sample
query, the large majority of untagged nodes were small local transformers
(UPRN-tagged, no name/operator), indistinguishable from a real grid supply
point without a voltage figure.

**Overpass mirror note**: the default `overpass-api.de` endpoint
intermittently 406'd on every request from this environment (its load
balancer announces a different backend hostname than the one actually
dialed) — confirmed reproducible, not a one-off. Switched to
`overpass.kumi.systems`, a well-established public mirror serving the same
free OSM data, which answered reliably in isolated testing. The shared
public instance is still subject to real load from other users worldwide;
`scripts/substations-fetch.ts` retries with exponential backoff (5
attempts, 5s/10s/20s/40s/80s) to ride out transient congestion rather than
failing the whole run over one slow moment.

**Bounding-box sizing**: querying all of GB at once (or even one box per
loose 1°-cell cluster) is too expensive for a shared public instance — a
single ~155km × 160km test box timed out completely (70s, zero bytes back).
Fixed by clustering listing coordinates into much smaller (~0.3° / ~30km)
cells with modest padding before querying, trading "fewer, bigger queries"
for "more, cheap queries" — 22 boxes for the current 161-point dataset,
each answering in a few seconds under normal load.

## Voltage tiers and scoring

| Tier | Voltage | Base points (before distance decay) |
|---|---|---|
| transmission | ≥275kV | 60 |
| grid-supply | ≥132kV | 50 |
| primary | ≥66kV | 35 |
| local-primary | ≥33kV | 20 |
| (excluded) | <33kV | not counted — local distribution, not a meaningful grid-capacity signal |

Same distance-decay curve as the original power-station signal (1.0 at
≤2km, tapering to 0 beyond 40km). For each listing, every nearby substation
with a classifiable voltage is scored (`tier base points × decay factor`),
and the **highest-scoring** substation wins — not necessarily the
physically nearest one. A 275kV substation 8km away can outscore a 33kV
substation 1km away, which is the right tradeoff: what matters is grid
capacity, and a closer-but-weaker connection point isn't necessarily more
useful than a farther-but-much-larger one.

OSM's `voltage` tag is sometimes semicolon-separated (`"132000;33000;11000"`)
when a substation transforms between several voltage levels on one site —
the highest value is used, since that's what determines the site's real
grid tier.

## What changed in the score

`src/scoring/dataCentreFit.ts`'s 100-point model is otherwise unchanged
(size 25 pts, subtype 15 pts) — only the 60-point proximity component was
rebuilt. `nearestMajorStationKm` (power-station distance) is gone from the
scoring input entirely, replaced by `substationPoints` (already
tier-weighted and distance-decayed by `src/geo/substations.ts`) and a
human-readable `substationReason` string.

Power-station data (`row.powerStation`) is **kept on each dashboard row as
informational context only** — still shown on the card, still useful to
know a listing sits near an ex-coal/gas/nuclear site — it just no longer
feeds the score. A new `row.substation` field carries the scored match
(distance, name, voltage, tier).

## Pipeline

- `src/geo/substations.ts`: `classifyVoltage()`, `parseVoltageTag()`,
  `bestSubstationScore()`, `loadGbSubstations()`.
- `scripts/substations-fetch.ts`: derives bounding boxes from the current
  dashboard listings' geocoded coordinates (reusing the same
  postcode/city-centroid geocoding as `scripts/data-centre-fit.ts`), queries
  Overpass per box, writes `data/gb-substations.json` (committed — a filtered
  extract covering only where the current dataset actually has listings, not
  a national dump).
- `scripts/data-centre-fit.ts` and `scripts/rightmove-detail-geocode.ts`:
  both updated to load substations alongside power stations, score on
  substation proximity, keep power-station distance as informational-only.

## Ordering note

Same pattern as the other enrichment scripts: re-run
`scripts/substations-fetch.ts` whenever the dataset's geographic spread
changes (a new city/region) — a listing outside every existing bounding
box's padding will score 0 on the proximity component until it's re-run,
not silently wrong, just untested until then.
