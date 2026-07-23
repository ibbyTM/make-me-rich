# Widening the PropertyHive-pattern hunt (2026-07-19, third pass)

Follow-up to `docs/propertyhive-widen-2026-07-19.md` (second pass: Bromwich
Hardy, Wood Moore & Co, Connect Property North East). This pass pushed into a
wider ring of UK cities/regions still adjacent to Citywide's Yorkshire/Greater
Manchester territory, plus checked for more Property Hive fingerprint sources
beyond the showcase page used last time.

## Angle 1 — direct discovery: even wider city ring

Searched independent commercial agents in cities/regions not covered by
either of the first two passes: Harrogate/Skipton/Keighley, Blackpool/Burnley/
Lancaster, Altrincham/Trafford/Ashton-under-Lyne, Crewe/Macclesfield/
Northwich, St Helens/Southport/Wirral, Solihull/Dudley/Walsall/West Bromwich,
Chesterfield/Mansfield, Carlisle/Kendal/Cumbria, Hartlepool/Darlington,
Scarborough/Selby/Goole, Grimsby/Scunthorpe, and Bury/Rochdale/Oldham.

**25 new real, web-search-verified candidates found** (no URLs guessed).

## Angle 2 — indirect discovery: further fingerprint check

Checked whether there's anything beyond the Property Hive showcase page used
in the previous pass: the plugin's own 5-star-reviews page (no agency names or
URLs in the actual review content — only screenshot images), a
`"powered by Property Hive"` / `"built with Property Hive"` search (surfaced
only the same showcase page and one already-known southern residential agent),
and the WordPress.org plugin page itself (installs count and generic reviews,
no site directory). **No additional fingerprint source found beyond the
showcase page already used** — that page appears to be the only
developer-maintained list of real Property Hive sites that's actually public.

## Technical probe result: 0 new matches this round

Probed all 25 for `wp-json/wp/v2/{property,properties,commercial-property,
listing,listings}`, same method as both prior passes.

| Result | Count | Sites |
|---|---|---|
| No PropertyHive-shaped REST endpoint at all | 21 | — |
| `property`/`properties` post type present, Reapit-style lookalike schema (no `price_from`/`floor_area_from`) | 2 | Jameson and Partners (Altrincham), W.T. Parker (Chesterfield) — same lookalike API as Dacres/Bradley Hall/Miller Metcalfe/Ashtons from earlier passes |
| `property` post type present, bespoke ACF-driven site (no address/price fields at top level) | 2 | Petty Commercial (Burnley), Renshaw Chartered Surveyors (Chesterfield) |
| **Genuine PropertyHive schema with usable commercial-for-sale stock** | **0** | — |

**No new sources added to `PROPERTY_HIVE_SOURCES` this round.** This is the
honest result, not a gap in the method — the same probe found 2 matches in the
first widening pass (out of 21 candidates) and 3 in the second (out of 36),
and found 0 this time (out of 25). PropertyHive is one plugin among several
common UK estate-agency WordPress setups (Reapit-backed sites are clearly at
least as common in this candidate pool), and its market share thins out
further from the original well-covered core.

## All 25 logged, same gate as always

Every candidate went through `classifyAndLogCandidate` regardless of the probe
result: **25 more rows logged to `site_audits`** (93 total across all three
widening passes plus the original two batches), all `sources` status
`pending_review`, 0 auto-activated, live robots.txt/ToS check run on every
one. None came back `blocked` this round (no 403s or bot-challenge
interstitials in this batch).

## Bottom line

- **25 new candidate sites found, 0 new fingerprint sources beyond the
  existing showcase page, 25/25 logged to `site_audits`.**
- **0 new PropertyHive matches with usable stock** — 2 Reapit lookalikes and 2
  bespoke ACF sites came close on the schema check but don't fit the generic
  scraper without bespoke per-site work.
- **Dashboard total unchanged: 8 passed listings across 5 real working
  sources** (same as after the second pass).
- Diminishing returns are now visible on this specific approach (PropertyHive
  REST-endpoint reuse via web search): three consecutive widening passes
  produced 2, then 3, then 0 new sources. Continuing to widen the same way is
  likely to keep returning near-zero; a different lever (a different common
  plugin/CRM's REST shape, or building a bespoke scraper for one of the
  several `static_html`-confidence-0.8 sites already logged) would probably
  be more productive than a fourth city-search-only pass.
