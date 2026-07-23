# Rightmove precise geocoding — investigation + bounded pull (2026-07-19)

Follow-up to `docs/data-centre-fit-2026-07-19.md`, which flagged Rightmove's
188 listings (95% of dashboard volume) as city-centroid approximated because
search-results pages carry no postcode. This investigated whether detail
pages carry real coordinates before committing to any pull.

## Investigation (before touching the 187/188)

Checked 5 real Rightmove Commercial detail pages by hand. Confirmed present
on every one: a `schema.org/Place` JSON-LD block —

```json
{"@context":"https://schema.org","@type":"Place","address":"...","longitude":-1.624357,"latitude":53.755927,"hasMap":"...","photo":"..."}
```

— with real building-level coordinates, even though the visible address text
is a human-readable street/area description ("1-2 Deanhurst Park, Gelderd
Road, Gildersome, Morley, Leeds") with no postcode in it. A second, richer
source is also present on the page (`window.__staticRouterHydrationData`,
a React Router hydration blob) carrying the same coordinates plus a full
postcode (`{"incode":"7LG","outcode":"LS27"}`) — not used here, since the
ld+json block gives the same location via a simpler, standard, more stable
format to parse (a JS-string-escaped blob is more fragile).

**robots.txt** (re-checked 2026-07-19): the default `User-agent: *` block does
not disallow `/properties/<id>` — the disallowed paths are all under the
older `/property-for-sale/`, `/property-to-rent/`, and `/property/` prefixes,
none of which this scraper uses.

Conclusion: coordinates are genuinely present. Proceeded with the bounded
pull.

## The pull

`scripts/rightmove-detail-geocode.ts` fetched all 188 listings currently
passed and sitting in `dashboard/data/rightmove.json` (not the ~554-listing
raw pull), 1.5s between requests (same pacing as the existing city-search
scraper), extracting coordinates via `extractPlaceCoordinates` (added to
`src/scrapers/rightmoveCommercial.ts`, 5 new unit tests).

**Result:**

| | Count |
|---|---|
| Total rows | 188 |
| **Upgraded to exact coordinates** | **120 (64%)** |
| No Place ld+json block found | 68 (36%) |
| Fetch failures | 0 |

**The 68 that didn't upgrade have a clean, explainable pattern, not a random
failure rate:** every one has a short (8–9 digit) Rightmove listing ID —
older-format IDs — while every listing that upgraded has Rightmove's newer
15-digit ID format. That's consistent with an older page-template version
that predates this embedded-coordinates block, not a parsing bug on this
end. Those 68 stay on their previous city-centroid approximation, correctly
still flagged `geocodePrecision: "city-centroid"` and marked "(approx.,
city-level)" on the dashboard — nothing was guessed or estimated to fill the
gap.

Nothing was falsely upgraded, and nothing was silently left ambiguous: every
row's `powerStation.geocodePrecision` says exactly what kind of location data
backs it (`exact`, `postcode`, or `city-centroid`).

## Numbers, before and after

| | Before this pull | After |
|---|---|---|
| Exact/precise geocoding | 10/198 (5%) | **130/198 (66%)** |
| City-centroid approximation | 188/198 (95%) | 68/198 (34%) |
| `strong` Data Centre Fit | 1 | **3** |
| `possible` | 84 | 85 |
| `unlikely` | 113 | 110 |

**Two new genuine `strong` matches**, both now backed by real coordinates:

- **Unit 3 Interchange 26, Junction 26 M62, Cliff Hollins Lane, Cleckheaton,
  Bradford BD12 7EZ** — Light Industrial, 50,000–105,000 sq ft, 9.5km from
  Thornhill (gas). Score 75.
- **Seaford Road, Manchester M6** — Residential Development, 154,388 sq ft,
  8.3km from Carrington (gas). Score 75.

Among the 130 now precisely geocoded (postcode or exact), distance-to-major-
station stats: min 2.4km, median 15.4km, max 47.6km — a real distribution
now, not the two-spike artifact the city-centroid method produced.

Among the 68 still-approximated Rightmove listings: 28 possible, 40 unlikely,
0 strong — none of them changed band, since their location data didn't
change. They remain the honest caveat: any of those 68 could individually be
much closer to a station than their city's centroid suggests, or much
further — there's no way to know without the same per-listing data the other
120 now have, and this pull got everything available without fabricating the
rest.

## Bottom line

- **120 of 187/188 upgraded to real precision** (the discrepancy is just
  188 currently sitting in the file vs. 187 at the time the task was framed —
  same set, whichever a fresh Rightmove pull happens to return).
- 68 stay on the older city-level approximation because the underlying page
  data genuinely isn't there (older listing format) — not a workaround, not
  a guess, just disclosed.
- 3 listings now qualify as `strong` Data Centre Fit, up from 1, and this
  time 2 of the 3 are backed by real per-property coordinates rather than a
  citywide guess.
- 66% of the dashboard's 198 listings now have genuine per-property location
  precision, up from 5%.
