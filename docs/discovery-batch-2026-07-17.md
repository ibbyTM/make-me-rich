# Search-based discovery batch — 21 regional agents, classified + one new scraper

**Date:** 2026-07-17 · **Mode:** read-only · **Gate held:** 21 discovery_queue entries, 20 classified + 1 fetch-blocked, 20 audits logged, **0 sources auto-activated** — everything stored `pending_review`.

Sources were found by web search across Citywide's core cities (Leeds, Hull, Newcastle, Manchester, Liverpool, Derby, Blackburn, Leicester, Sheffield, Birmingham), selecting genuine independent/regional agents and excluding the nationals (Savills, Knight Frank, Colliers, Eddisons, LSH, BNP) and portals. Each site's most listings-like page was located from its homepage and classified (raw-HTML mode — headless still unavailable, the known sandbox limitation, so `api_endpoint`/`js_rendered` signals are under-observed by the classifier itself; see the API follow-up below).

## Per-site results

| Agent | City | Classified | Conf | Outcome |
|---|---|---|---|---|
| PPH Commercial | Hull | static_html | 0.60 | review — WP server-rendered; generic JSON only |
| Barker Property | Hull/Leeds | static_html | 0.80 | review — static pages, no structured data |
| Leonards | Hull | static_html | 0.80 | review |
| Dacres Commercial | Leeds | needs_review (ToS flag) | 0.60 | review — robots/ToS gate tripped |
| WSB Property Consultants | Leeds | manual_entry_only | 0.85 | review — POST-only search |
| Carter Towler | Leeds | static_html | 0.60 | review — WP REST API exists but is hollow (taxonomy IDs, no price/size/content) |
| Naylors Gavin Black | Newcastle | static_html | 0.60 | review — server-rendered cards, no API found |
| Bradley Hall | Newcastle | needs_review (ToS flag) | 0.60 | review |
| Roy Backhouse | Liverpool | static_html | 0.60 | review |
| Frobishers | Liverpool | static_html | 0.80 | review |
| Gifford Dixon | Manchester | static_html | 0.60 | review |
| Roberts & Roberts | Manchester | static_html | 0.60 | review |
| Canning O'Neill | Manchester | static_html | 0.60 | review |
| Roger Hannah | Manchester | — | — | fetch blocked (HTTP 403, bot protection) — review |
| Innes England | Derby/Leicester/B'ham | static_html | 0.60 | review |
| Raybould & Sons | Derby | static_html | 0.80 | review |
| Taylor Weaver | Blackburn | static_html | 0.60 | review |
| Cardwells | Blackburn/Bolton | static_html → API found | 0.60 | review — PropertyHive REST exists but carries **residential only** (all 6 pages verified) |
| Shepherd Commercial | Birmingham | manual_entry_only | 0.85 | review — POST-only search |
| Harris Lamb | Birmingham | static_html | 0.60 | review |
| **SMC Brownill Vickers** | Sheffield | static_html → **api_endpoint 0.92** | 0.92 | **scraper built** ✓ |

## The API follow-up (why one static_html became api_endpoint)

The raw-HTML classifier can't see XHR traffic, so as a manual follow-up every WordPress site was probed for a REST-exposed property post type (`/wp-json/wp/v2/types`). Three had one:

- **SMC Brownill Vickers** — full PropertyHive REST: price, floor area (+units), availability, department, postcode, live listing link. Re-classified **api_endpoint 0.92** with the real endpoint response as network-log evidence. **Scraper built.**
- **Cardwells** — same plugin, but the API carries residential stock only (all 6 pages checked): no commercial data to scrape. Stays in review.
- **Carter Towler** — API returns taxonomy IDs and empty content; no listing fields. Stays in review.

Everything else is genuinely server-rendered static HTML (the classifier was right), POST-form (`manual_entry_only` — WSB, Shepherd), ToS-flagged (Dacres, Bradley Hall), or bot-blocked (Roger Hannah). Per instruction, none were forced.

## The one new scraper

`src/scrapers/propertyHive.ts` — a **generic PropertyHive WP-REST scraper** (fetch → filter `department=commercial` + `For Sale` + on-market → normalise, Barnsdales pattern), because PropertyHive is a common plugin among UK independents: the next PropertyHive agent discovered is a one-line source entry, not a new module.

**SMC live pull:** 317 properties on the API → 11 commercial for-sale → **10 passed Stage-0**, now in the dashboard (`dashboard/data/discovered.json`) alongside Barnsdales and Rightmove.

## ⚠️ Finding: out-of-region passes (5 of 10)

SMC lists nationally, and in normal Stage-0 mode geography is one scored signal, not a gate — so Bow (London), Basildon, Wickford, Matlock and Leyton passed on price+`freehold` or size+`freehold` alone. Same funnel semantics as always (the Barnsdales pull never surfaced it because its stock is all Yorkshire). Options if unwanted: make geography a hard precondition for agent pulls too (the `geoPrescoped` machinery already exists), or leave it to the Day-5 matcher downstream. **Decision for Ahmed** — not changed unilaterally.

## What would unlock more sources

- **Headless rendering in production** (Apify): several of the static/60%-confidence sites likely load listings via XHR that raw HTML can't see — the same limitation flagged in the classifier trial.
- The **static_html 0.80 sites** (Barker, Leonards, Frobishers, Raybould) are scrapeable with per-site HTML extractors — more build effort per site than the API/embedded pattern, which is why they stayed in review this pass.
