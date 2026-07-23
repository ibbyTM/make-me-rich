# "Data Centre Fit" — Phase 1: proximity to power stations (2026-07-19)

Read-only analysis layer on top of the 198 listings already in the dashboard.
No new scraping, no new sites — this only adds two fields per existing row.

## What was built

- **Geocoding** (`src/geo/postcodes.ts`) via postcodes.io (free, ONS-backed,
  no API key).
- **Power station dataset** (`data/gb-power-stations.csv`, 2,751 GB generation
  sites). Sourced via the [OSUKED Power Station Dictionary](https://github.com/OSUKED/Power-Station-Dictionary)
  lead: that project is an ID-crosswalk between energy datasets, not a
  location table itself — its own docs point to the linked datasets for
  location/fuel data, one of which is the World Resources Institute's
  [Global Power Plant Database](https://github.com/wri/global-power-plant-database)
  (CC-BY-4.0), filtered to `country=GBR`. That's the actual source of the
  lat/long + fuel type used here. "Generation sites only" is what GPPD
  contains natively (no substations/distribution assets) — no extra
  filtering needed on that front.
- **Distance** (`src/geo/powerStations.ts`): haversine great-circle distance,
  nearest station either unrestricted or capacity-filtered.
- **Data Centre Fit score** (`src/scoring/dataCentreFit.ts`): 0–100, three
  weighted components (all named constants, easy to retune):
  - **60 pts** — proximity to the nearest **major** power station (≥50MW;
    deliberately excludes small farm-scale solar/biomass — a 1MW rooftop
    array a few hundred metres away isn't a meaningful grid-connection
    signal the way a former coal/gas/nuclear/large-wind-farm site is).
  - **25 pts** — size (acres converted to sq ft equivalent as a fallback when
    only an acreage label is present, e.g. Barnsdales land listings).
  - **15 pts** — subtype (Industrial/Warehouse/Land/Development favoured,
    Retail/Office deprioritised, per the brief).
  - Bands: `strong` ≥65, `possible` 35–64, `unlikely` <35 — **these cutoffs
    are the thing to sanity-check**, see distribution below.
- **Orchestration** (`scripts/data-centre-fit.ts`): reads the 3 existing
  `dashboard/data/*.json` files, geocodes, scores, writes them back out with
  the same rows plus two new fields (`powerStation`, `dataCentreFit`).
- **Dashboard UI**: a "Data Centre Fit" filter (strong/possible/unlikely), a
  sort-by option (Price / Data Centre Fit / Distance to power station), and
  each card now shows its nearest major station + distance, plus a fit badge
  with the full reasoning on hover.
- 25 new unit tests (`test/postcodes.test.ts`, `test/powerStations.test.ts`,
  `test/dataCentreFit.test.ts`) — 99/99 passing project-wide.

## The precision caveat (read this before trusting the numbers)

Only **10 of 198 listings** (Barnsdales + the 5 PropertyHive sources) got
**exact, address-level geocoding** — their stored address already includes a
real postcode. The other **188 (95%, all Rightmove Commercial)** got a
**city-centre-centroid approximation** instead, because Rightmove's
search-results payload carries no postcode at all (confirmed directly in
`src/scrapers/rightmoveCommercial.ts` — only a human address string and a
city name). Every Rightmove listing from the same city collapses to one
point — e.g. every Sheffield listing shows exactly **36.1km to Thornhill**
regardless of which side of Sheffield it's actually on. This is flagged
per-row (`powerStation.geocodePrecision`) and visibly marked "(approx.,
city-level)" on every affected card, not silently blended in.

**Practical read:** treat the `strong`/`possible`/`unlikely` band as a
genuine per-property signal only for the 10 precisely-geocoded listings.
For the 188 Rightmove listings, it's really a per-*city* signal dressed up as
a per-listing one — useful for a first-pass "which cities are even in the
right ballpark" filter, not for picking a specific property. Getting
Rightmove to postcode-level precision would mean fetching each listing's
detail page individually (188 more requests, a different page format
entirely per the scraper's own comments) — that's new scraping, out of scope
for this read-only pass, and a decision worth making deliberately rather than
just doing.

## Distribution — sanity-check the thresholds

| Band | Count | % |
|---|---|---|
| Strong (≥65) | 1 | 0.5% |
| Possible (35–64) | 84 | 42% |
| Unlikely (<35) | 113 | 57% |

Score histogram (buckets of 10): 10–19: 18 · 20–29: 53 · 30–39: 60 · 40–49: 48
· 50–59: 13 · 60–69: 5 · 80–89: 1. Nothing scored above 89 or below 10 —
sensible given the component maxes (a listing needs to be close, large, *and*
the right subtype to stack up).

**Only one listing hits `strong`:** Castleford, WF10 5HX (Barnsdales, 1.1
acres, "Land · Mixed Use", exact-geocoded) — 2.4km from Castleford gas power
station (56MW). Score 83 (50 distance + 18 size + 15 subtype). This one is
genuinely well-supported — real postcode, real nearby major station, real
land-scale plot, real favoured subtype. Worth treating as the calibration
example.

Of the 10 precisely-geocoded listings: 1 strong, 1 possible (Gifford Dixon,
Salford, 9.5km to Carrington, 2,336 sq ft office/retail/leisure mix, score
43), 8 unlikely. Of the 84 `possible`-band listings, 83 are Rightmove
city-centroid approximations — so almost all of the "possible" bucket is
riding on the coarse per-city distance, not a real per-property read.

Distance-to-major-station stats across all geocoded rows: min 2.4km, median
14.3km, max 47.6km. The distance histogram has two big spikes (130 rows at
10–14km, 53 rows at 35–39km) that are a direct artifact of the city-centroid
method, not a real geographic pattern — Leeds/Bradford/Huddersfield/Manchester
all happen to land in the first bucket, Sheffield alone drives the second.

**On the band cutoffs themselves:** 65/35 currently means only a very
tightly-qualified listing (close + large + right subtype, or close + huge)
reaches `strong`. Given the real distribution above, if the intent is a wider
`strong` shortlist, lowering the cutoff to ~55 would pull in a few more of the
higher-scoring `possible` rows — but doing that now would mostly promote more
Rightmove city-approximated listings, not add genuine precision. Recommend
holding the current cutoffs until Rightmove has real per-listing coordinates,
rather than tuning against admittedly-coarse data.

## Bottom line

- 198/198 listings geocoded and scored (10 exact, 188 city-approximate).
- 1 listing currently qualifies as a `strong` Data Centre Fit — genuinely
  well-supported, not a false positive.
- 84 `possible`, 113 `unlikely` — but treat `possible` with caution: it's
  almost entirely driven by coarse city-level distance for Rightmove listings.
- All fields are live in the dashboard now (filter, sort, per-card display),
  clearly marked where the distance is approximate.
- Natural Phase 2, if wanted: precise Rightmove geocoding via detail-page
  fetches (new scraping — a decision to make explicitly, not a given).
