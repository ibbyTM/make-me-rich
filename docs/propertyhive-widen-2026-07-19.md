# Widening the PropertyHive-pattern hunt (2026-07-19, second pass)

Follow-up to `docs/new-sources-discovery-2026-07-19.md`'s addendum, which found
Gifford Dixon and Shepherd Commercial by probing the original 21-agent curated
directory. This pass widened the hunt on two angles, as requested, then ran
every new candidate through the same gate as always.

## Angle 1 — direct discovery: broader city search

Original batch covered ~10 cities (Hull, Leeds, Newcastle, Liverpool,
Manchester, Derby/Leicester/Birmingham, Blackburn, Sheffield). This pass
searched independent commercial agents across cities not covered before, all
in or adjacent to where Citywide operates (Yorkshire, Greater Manchester):
York, Wakefield, Doncaster/Barnsley/Rotherham, Stockport/Oldham/Rochdale,
Wigan/Bury/Salford, Preston, Chester/Warrington, Sunderland/Middlesbrough/
Durham/Teesside, Halifax/Huddersfield, plus adjacent Midlands (Wolverhampton/
Coventry/Stoke-on-Trent, Nottingham/Lincoln) since the original batch already
reached into Derby/Leicester/Birmingham.

**35 new real, web-search-verified candidates found** (no URLs guessed).

## Angle 2 — indirect discovery: fingerprinting the plugin directly

Property Hive is a public WordPress.org plugin. Rather than only checking
agents already known, searched for the plugin's own developer-maintained
showcase page (`wp-property-hive.com/estate-agent-wordpress-website-showcase`)
— a direct list of real sites confirmed built on it. Most listed sites are
residential agencies outside Citywide's target geography (Hampshire, Sussex,
Cotswolds, Warwickshire, etc.), but one — **Miller Metcalfe** — was also
independently found via the Angle-1 city search (Stockport/Rochdale/Wigan),
giving genuine cross-confirmation. (`"powered by Property Hive"` and
`inurl:property-hive` searches surfaced only the plugin's own marketing pages
and an unrelated agency literally named "The Property Hive" — no further
useful fingerprint signal beyond the showcase page.)

## Technical probe: same method that found Gifford Dixon/Shepherd Commercial

Probed all 35 (plus Miller Metcalfe, cross-checked from Angle 2) directly for
`wp-json/wp/v2/{property,properties,commercial-property,listing,listings}`,
then deep-verified every hit's field shape and a full-pagination scan of
`department`/`availability`/`price_from` population, exactly as done for the
first two.

| Result | Count | Sites |
|---|---|---|
| No PropertyHive-shaped REST endpoint at all | 29 | (most of the 35 — a WordPress `property` post type is common to several unrelated real-estate plugins/CRMs, not just this one) |
| `property` post type present, different (non-PropertyHive) schema | 3 | Stephensons Estate Agents (bespoke ACF-driven site, no address/price at top level), Miller Metcalfe and Ashtons (both Reapit-style: `price`/`price_actual`, no `price_from`/`floor_area_from` — same lookalike API as Dacres Commercial/Bradley Hall from the first pass) |
| Genuine PropertyHive schema, but no usable commercial-for-sale stock | 1 | Morgan Williams (Warrington) — real schema, robots.txt clean, but its entire 74-record commercial book is lettings: `availability` is `"Available"`/`"Under Offer"`, never `"For Sale"` |
| **Genuine PropertyHive schema + real, usable commercial-for-sale stock** | **3** | **Bromwich Hardy, Wood Moore & Co, Connect Property North East** |

## The 3 confirmed new sources

| Site | Total on API | Commercial dept. | For Sale | With usable `price_from` | robots.txt |
|---|---|---|---|---|---|
| Bromwich Hardy (Coventry) | 166 | 166 | 54 | 36 | clean (`/wp-admin/` only) |
| Wood Moore & Co (Notts/Lincs) | 78 | 78 | 13 | 12 | clean (`/wp-admin/` only) |
| Connect Property North East (Teesside/NE) | 278 | 278 | 42 | 34 | clean (no disallow at all) |

All three were also run through `classifyAndLogCandidate` (same gate as
always — `discovery_queue` → classify → `sources` forced `pending_review` →
`site_audits`, live robots.txt/ToS check independent of the manual probe
above). All logged with `tosFlag: false`. Now live in
`PROPERTY_HIVE_SOURCES` (`src/scrapers/propertyHive.ts`) — near-zero marginal
code, same generic scraper module as SMC Brownill Vickers.

**Live pull result:** Bromwich Hardy and Wood Moore & Co passed 0 through
Stage-0 (correctly — neither has any stock that actually falls inside
Citywide/Educating's Yorkshire/Greater Manchester territory; Coventry and
Nottinghamshire/Lincolnshire postcodes don't match, and the pipeline's
existing `geoPrescoped` hard geography precondition — not a scored point —
correctly disqualifies them rather than letting price/keyword signals alone
carry a false match). Connect Property North East passed 2, both a genuine
Thirsk (**YO7**, real North Yorkshire) freehold listing within budget — a true
positive despite the agency's "North East" branding, because that specific
property really is in-region. Verified by hand before trusting the pass.

## All 35 (+1) logged, same gate as always

Every candidate — hit or miss — went through `classifyAndLogCandidate`, not
just the 3 winners: **36 rows logged to `site_audits`**, all `sources`
`status = 'pending_review'`. One (Tanners, Nottingham) came back `blocked`
(HTTP 403); the rest classified normally (mostly `static_html`, a few
`manual_entry_only`, a few `needs_review`) at the confidence levels the
generic classifier's page-crawl heuristic happened to find — none of that
matters for the 3 sites this report is about, since they were confirmed
through the real API directly rather than the fragile page-crawl.

## Bottom line

- **35 new candidate sites found** (direct discovery) **+ 1 cross-confirmed**
  via the plugin's own showcase page (indirect discovery) = **36 candidates**.
- **36/36 logged to `site_audits`**, robots.txt/ToS checked on all, 0
  auto-activated.
- **4 genuine PropertyHive-schema matches** (Bromwich Hardy, Wood Moore & Co,
  Connect Property North East, Morgan Williams).
- **3 had usable commercial-for-sale stock** and are now wired into
  `PROPERTY_HIVE_SOURCES` (Morgan Williams excluded — lettings-only stock).
- **Dashboard total: 8 passed listings across 5 real working sources** (up
  from 6 across 3 before this pass, 4 across 1 before the first widening
  pass).
