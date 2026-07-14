# Evaluation: `RealEstateWebTools/property_web_scraper` as a portal-scraper replacement

**Date:** 2026-07-14 · **License:** MIT · **Verdict up front: does not fit as a replacement — but its declarative-mapping design is worth borrowing.**

Method: cloned the repo (read-only, into session scratch space), read the mapping catalog and extraction engine, and **ran their actual engine** against (a) a live-fetched Rightmove *commercial* detail page with their `uk_rightmove` mapping, and (b) our cached Barnsdales listings page with their generic fallback. Nothing was integrated into CAIS.

## What it actually is

Despite the Ruby gem heritage in the repo root, the live project is a **TypeScript + Cheerio extraction engine** (`astro-app/src/lib/extractor/`) wrapped in an Astro web app with an API and Chrome extension. Given **one fully-rendered HTML page + source URL**, it applies a declarative JSON mapping (CSS selectors, script-JSON paths, JSON-LD paths, regex, React-Flight paths) and returns **exactly one** structured property (`properties: [sanitizedHash]` — hardcoded single-item array). No fetching, no JS rendering, no crawling — the caller provides the HTML.

## 1. UK coverage in the mapping catalog

109 mappings across 75 countries. UK entries:

| Mapping | Tier | Content source |
|---|---|---|
| `uk_rightmove` | core | script-json (`PAGE_MODEL`) |
| `uk_zoopla` | core | script-json |
| `uk_onthemarket` | core | html |
| `uk_jitty` | core | html |
| `uk_purplebricks` | experimental | json-ld |
| `generic_real_estate` | fallback | json-ld/og-meta (0.30 expected rate) |

**Commercial-property coverage: none.** The string "commercial" appears in **zero** mapping files. No EGi/EG Propertylink, no CoStar/LoopNet, no NovaLoca, no Rightmove-commercial-specific mapping. The field schema itself is residential: `count_bedrooms`, `count_bathrooms` — and the `uk_rightmove` mapping maps **no floor-area/size field at all** (only a static `area_unit: "sqft"` default). Nothing for use class, yield, or freehold/leasehold price ranges.

## 2. Does the Rightmove mapping cover commercial listings?

Two-part answer:

- **Structurally, commercial detail pages carry the same data source.** I fetched a live commercial (`COM_BUY`) detail page: it contains the page model with `propertyData`, `sizings` (sq ft), `propertySubType`, `tenureType`. So a *correct* mapping could serve both channels.
- **In practice, the shipped mapping fails on it — grade F.** Running their engine on that page extracted **12 fields, all from static defaults and `og:` meta fallbacks**: no price, no address, no postcode, no tenure, no size, and `for_sale: false` for a for-sale listing. Root cause: Rightmove now ships `window.__PAGE_MODEL` (double underscore) containing **React-Flight-style reference-indexed data** (`{"data":"[{\"propertyData\":1,…}]"}`), while the mapping expects a plain `PAGE_MODEL` JSON var with dot-paths. The mapping was `last_checked: 2026-02-20` (~5 months stale). Notably their engine *has* a `flightDataPath` strategy for exactly this format — but **no shipped mapping uses it**, including Rightmove's.

So: not commercial-specific, missing commercial-critical fields, and currently broken against live Rightmove full stop.

## 3. Sanity check against Barnsdales

Ran their generic fallback against the same `/properties` page our bespoke scraper handles:

| | Their generic extraction | Our bespoke scraper |
|---|---|---|
| Listings returned | **1** (the page itself) | **105** |
| Fields | page `<title>` + meta description | id, location, postcode, size, freehold/leasehold prices, status, categories |
| Usable for Stage-0 | No | Yes (4 commercial-freehold → 2 passed) |

This isn't (only) a mapping-quality issue — it's architectural. The engine is a **detail-page extractor**: one property per page, by design. Barnsdales embeds its whole inventory in one list page; the engine has no concept of that. Every agent/portal *list* crawl — which is what CAIS's scheduled scraping actually does — would still have to be built by us.

## 4. Recommendation: vendor / fork / doesn't fit?

**Doesn't fit as a replacement.** Four reasons, in order of weight:

1. **Wrong page granularity.** It parses one detail page; CAIS needs list/search-page harvesting. The hard part of every portal scraper (crawling, pagination, list extraction) is out of scope for this tool — it does the easy part.
2. **Residential focus.** Zero commercial mappings, residential field schema, no size field even on its flagship UK mapping.
3. **Staleness risk demonstrated.** The core-tier UK mapping is broken against today's Rightmove. Vendoring the catalog means inheriting a maintenance treadmill for portals we mostly don't need (75 countries of residential portals).
4. `caller provides the HTML` is **not** itself a blocker — it actually matches our probe/Apify split — but it means the tool adds parsing only, and its parsing is the part we've already shown we can do better for our sites.

**What IS worth taking (borrow, don't depend):**

- The **declarative mapping pattern** is genuinely good: per-portal JSON mappings with strategy types (`cssLocator` / `scriptJsonVar` / `jsonLdPath` / `flightDataPath` / `scriptRegEx`), ordered fallback chains, `expectedExtractionRate`, and a quality grade per extraction. That is a better long-term shape for our per-source scrapers than bespoke TS modules per site — a new `scraper_strategy` value could be `mapping:<name>` with mappings stored per source.
- MIT license permits lifting the ~15-file extractor (`astro-app/src/lib/extractor/`) if we ever want that engine as a starting point — extended with (a) multi-listing/list-page extraction and (b) commercial fields. That's a meaningful engine rewrite, though; for the handful of portals we actually need (Rightmove Commercial, EGi), targeted bespoke scrapers on the Barnsdales pattern are less total work.
- Their `flight-data-parser` is a useful reference for when we build a real Rightmove Commercial scraper, since that's the format Rightmove now serves.

**Bottom line:** keep our bespoke-scraper path for portals; adopt their mapping-catalog *idea* (declarative JSON + fallback chains + per-source expected-rate tracking) when we have 3+ scrapers and repetition starts to hurt. Do not add it as a dependency or fork it wholesale.
