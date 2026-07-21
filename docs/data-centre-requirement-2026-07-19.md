# Data Centre Sites — a proper Requirement, not a bolt-on filter (2026-07-19)

## The gap

Phase 1 of Data Centre Fit (`docs/data-centre-fit-2026-07-19.md`) only scored
the 198 listings that had already passed Citywide Investors (C2R residential
conversion) or Educating Excellence (church conversion) — both filters tuned
for small-to-mid, specifically-worded stock. A genuinely huge industrial
building or land parcel — exactly what data-centre siting wants — could
easily fail those filters (wrong keywords, too large a size the requirement
never asked for, price outside a £500k–£2m band meant for a different
purpose) and never reach Data Centre Fit scoring at all, even as a great
candidate.

## The fix: a real Requirement, scored against the full raw pulls

Added **Data Centre Sites** as a third seed Requirement
(`src/requirements/seeds.ts`), deliberately unlike the other two:

- **Geography**: `yorkshire, greater manchester, west midlands, east
  midlands, north east` — every region this pipeline actually has a live
  source in, not just Citywide's Yorkshire/Greater Manchester.
- **Size**: 20,000+ sq ft (a scored signal, not a hard cutoff — Stage-0 never
  disqualifies on a missed criterion, it just doesn't award that point).
- **Keywords**: industrial, warehouse, distribution, logistics, development
  site, power, substation, grid.
- **No budget cap** — real DC-scale sites can price far outside Citywide's
  band; capping it would have re-created the same blind spot.

This required no scraping changes at all. Every report script already scores
every listing in its **full raw pull** (not just what already passed) against
**every active Requirement** — so simply adding this Requirement to the
Register made the existing Barnsdales/Rightmove/PropertyHive pulls examine
themselves for data-centre fit automatically, next run.

## A latent bug this surfaced and fixed

`scripts/discovered-agents-report.ts`'s postcode→region mapping only knew
Yorkshire and Greater Manchester. Bromwich Hardy (Coventry), Wood Moore & Co
(Nottinghamshire/Lincolnshire), Connect Property North East (Teesside/
Durham) and Shepherd Commercial (Birmingham/Leicestershire) — added in the
PropertyHive-widening passes — all had their commercial stock silently
tagged with an **empty region string** for everything outside those two
areas. Combined with `geoPrescoped: true` (a hard precondition: geography
mismatch disqualifies a listing from a requirement entirely), this meant
**Bromwich Hardy and Wood Moore & Co scored exactly 0 passing listings on
every previous run — not because they had no qualifying stock, but because
their geography could never match anything.** Fixed by extending the
mapping with West Midlands / East Midlands / North East postcode areas.
Confirmed live: Bromwich Hardy went from 0 → 6 passed, Wood Moore & Co from
0 → 1.

Also fixed, found while re-running: `discovered-agents-report.ts` crashed
its entire multi-source loop when one source (Bromwich Hardy, mid-run) hit a
SiteGround `sgcaptcha` bot-challenge — a real anti-bot response, not worked
around, but its `HTTP 202` status slipped past the existing `!res.ok` check
and threw deeper as a JSON parse error, losing every other source's
freshly-pulled results too. Now caught per-source and skipped with a logged
reason, so one blocked/flaky source can't take the whole batch down.
`ensureSeeded()` also had a stale gate (`count > 0` short-circuited the whole
function, so adding a third seed to the source file never reached an
already-seeded store) — changed to insert-if-missing by name.

## Result

| | Before | After |
|---|---|---|
| Total dashboard rows | 198 | **220** |
| Rightmove Commercial | 188 | 198 |
| Discovered agents (PropertyHive) | 8 | 20 |
| Barnsdales | 2 | 2 |
| Listings matched to "Data Centre Sites" | 0 | **64** |
| `strong` Data Centre Fit | 3 | 3 (2 of the 3 now correctly attributed to Data Centre Sites rather than Citywide/Educating) |

**64 listings now qualify under Data Centre Sites specifically** — 52 from
Rightmove, 6 from Bromwich Hardy, 5 from Connect Property North East, 1 from
Wood Moore & Co. Within that set: 2 `strong`, 53 `possible`, 9 `unlikely`
(logged even when they don't clear the Data Centre Fit bar, same as
everywhere else in this pipeline — nothing is hidden).

**Real, large candidates this surfaced that weren't visible before:**

- Unit 3 Interchange 26, Junction 26 M62, Cleckheaton, Bradford BD12 7EZ —
  Light Industrial, 50,000–105,000 sq ft, 9.5km from Thornhill (gas), £1
  guide price. Score 75, `strong`.
- Seaford Road, Manchester M6 — Residential Development, 154,388 sq ft,
  8.3km from Carrington (gas), £5.5m. Score 75, `strong`.
- Two listings for the same site, Land adjacent to 84 Longwood Gate,
  Huddersfield HD3 4US — 161,172 sq ft, £160,000, score 60, `possible`.
- Briscoe Lane, Manchester M40 — 186,872 sq ft, score 60, `possible`.

The two Longwood Gate rows are the same physical site listed twice
(different agents/listing IDs) — worth a human dedup pass before acting on
it, not something Stage-0 tries to solve.

## Geocoding precision, updated

Rightmove detail-page geocoding (`docs/rightmove-detail-geocode-2026-07-19.md`)
now runs against a persistent cache
(`dashboard/data/.rightmove-coords-cache.json`, url → coordinates or
confirmed-absent) so re-running after a fresh base pull doesn't mean
re-fetching ~200 detail pages again — this run resolved 198 rows from cache
in seconds and only fetched the 22 genuinely new URLs. Overall precision
across the full 220-row dashboard: 155 exact/postcode (70%), 65 city-centroid
approximate (30%).

## Bottom line

Data Centre Fit is no longer scoring "whatever happened to already pass a
different filter" — it has its own Requirement, examines the same raw pulls
everything else already does, and surfaced real 150,000+ sq ft candidates
that the residential-conversion requirements would never have shown. Fixed
two real bugs along the way (a silent geography gap that zeroed out 2 of 6
PropertyHive sources' results, and a batch-crashing bot-challenge response).
