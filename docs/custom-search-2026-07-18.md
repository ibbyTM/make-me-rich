# Custom search parameters — build notes (2026-07-18)

**What this adds:** a way to define new search criteria (geography, property type, budget, size) from the dashboard, have them join the Requirements Register that Stage-0 already scores against, and run discovery for them on demand — without touching code for each new search.

## What's real vs. what needed a design call

Everything the brief asked for is built and verified live (headless-browser E2E, not just unit tests). One thing needed an honest design call, laid out below before the rest — it shapes what "discovery on demand" actually means today.

### There is no search-API key anywhere in this environment

No `.env`, no `ANTHROPIC_API_KEY`, no `BING_...` — nothing. Before building anything, I checked whether scraping a search engine's result page could stand in. It can't: DuckDuckGo, DuckDuckGo Lite, and Mojeek were all probed live and returned bot-challenge pages (captcha / HTTP 403), not results, when queried the way this task would need. Building a scraper against that would also make this project a worse ToS citizen than everything else it's been careful about (robots.txt checks, the review gate, geoPrescoped scoring) — so it wasn't built.

**What was built instead:** a `SearchProvider` interface (already existed in `src/discovery/discovery.ts` from the very first sprint — this task is the first thing to actually use it) with two implementations, chosen automatically by `createSearchProvider()`:

- **`BingSearchProvider`** — real, open-ended web search via the Bing Web Search API. Used only when `BING_SEARCH_API_KEY` is set. This is the production path once a key is configured. **It has not been exercised live** — there's no key to test it against — but it's ~25 lines against a stable, documented API and follows the same interface as everything else, so wiring it in later is a config change, not a rebuild.
- **`DirectoryProvider`** (the default, used today) — backed by `data/agent-directory.json`, a curated list of the 21 real independent agents already found and verified via the 2026-07-17 discovery batch, tagged by city/region. A query matches an entry if any of its tags appears in the query text. **This is not web search.** A geography with no directory coverage returns zero candidates — it does not guess or fabricate a URL. Extending coverage is a data edit (add a row to the JSON), not a code change, which satisfies the "no code changes" requirement for the cities already researched, but genuinely novel geographies need either a directory addition or a Bing key.

Every run states which provider was used and why, both in the CLI JSON output and in the dashboard's discovery-result panel — so nobody can mistake a directory hit for a live search result.

## What was built

**1. Persistent Requirements Register** (`src/db/pglite.ts`, `src/db/requirementsRepo.ts`)
`test/helpers/pgHarness.ts`'s in-memory PGlite bootstrap was extracted into a production module that also supports an on-disk `dataDir`. Verified live across genuinely separate process invocations (not just within one script) that a row written by process A is visible to process B. The dashboard server and all three report scripts now open the same `.data/cais-db` directory, so "the same table the two seed requirements already live in" is literally true — the `requirements` table in `0001_base.sql`, not a parallel JSON store. `.data/` is gitignored (local dev state, auto-seeded on first use, same pattern as `node_modules`).

**2. Dashboard "New search" panel**
Fields for name (optional — auto-named from geography if blank), geography, property-type keywords, budget min/max, minimum size. Submitting posts to `POST /requirements`, which validates (name required, at least one geography required) and inserts a row. Every requirement — seed or custom — is then listed with its criteria and a **Run discovery** button.

**3. Parameter-driven discovery**
`scripts/discovery-classify.ts` (the original 21-site batch) had its classify-and-log core extracted into `src/discovery/requirementDiscovery.ts`, shared by the new `scripts/requirement-discovery.ts --requirement <id>`. That script looks the requirement up, builds one query per geography (paired with its first keyword), asks the configured search provider, and classifies + logs every unique candidate URL — **identical safety gate to every other discovery path in this codebase**: everything lands in `discovery_queue`, gets a `site_audits` row, and is written to `sources` with status **forced to `pending_review`**. Nothing is auto-activated or auto-scraped by a discovery run — building a scraper for a newly discovered site remains a manual follow-up, exactly as scoped ("not new scraping logic itself").

The dashboard's Run discovery button calls `POST /discover`, which spawns this script as a child process and shows live status plus a result summary (provider used, queries run, per-candidate classification/decision breakdown) in the panel.

**4. Stage-0 wiring**
`barnsdales-report.ts`, `rightmove-commercial-report.ts`, and `discovered-agents-report.ts` no longer import a hardcoded `SEED_REQUIREMENTS` list — they open the persistent store and read the active Requirements Register on every run. A requirement created via the dashboard is scored against Barnsdales/Rightmove/SMC listings on their very next run, with no code change. Verified live: re-ran the Barnsdales script against the DB-backed path and got byte-identical results to the previous hardcoded-list run (2/4 passed, same addresses, same reasons) — the wiring is a pure plumbing change, not a scoring change.

**5. Dashboard visibility**
The existing requirement filter dropdown already built its option list dynamically from whatever `requirement` names appear in the scraped data (`[...new Set(all.map(r => r.requirement))]`), so a custom requirement's matches are automatically filterable with **no dashboard change** the moment any report script produces a match for it. What *was* added is the separate requirement list panel showing every requirement (seed + custom) with its criteria, independent of whether it has produced any matches yet — so a brand-new search is visible immediately, not only after a scraper happens to find something for it.

## One safety call made without asking

`POST /requirements` (writes) is gated behind the same "only one job at a time" flag as `/run` and `/discover`, returning 409 if a report or discovery job is mid-run. PGlite is a single-writer embedded engine with no documented guarantee for concurrent multi-process access to the same on-disk store; two manual concurrent-access tests here didn't visibly corrupt anything, but "it worked twice" isn't proof of safety, and the cost of being wrong (a corrupted local dev DB) is worse than the cost of a form occasionally saying "try again in a moment." `GET /requirements` (reads) is left unblocked — lower risk, and blocking the whole UI's visibility during a multi-minute Rightmove pull would be a worse trade.

## Verification performed

- 59 automated tests pass (10 new: `requirementsRepo` round-trip/validation, `DirectoryProvider` matching + factory selection), full `npm run typecheck` clean.
- Live, in a real headless browser, not just curl: submitted a custom requirement ("Birmingham Office Fund" — geography Birmingham, keyword office, budget £300k–£1.5m, min size 2,000 sq ft) through the actual form; confirmed it appeared in the requirement list; clicked **Run discovery**; confirmed the run-scrapers checkboxes, the New-search submit button, and the discovery button itself all disabled for the duration; confirmed 3 real candidates (Shepherd Commercial, Harris Lamb, Innes England — genuine Birmingham independents from the directory) were found, classified, and routed to `queued_for_review`; confirmed controls re-enabled after.
- Simulated a genuinely fresh clone by deleting `.data/` entirely and confirming the server auto-seeds the two originals correctly from zero state — this is exactly what a new machine running `npm run dashboard` for the first time will see.
- Confirmed persistence survives real process boundaries (not just within one script run) before building anything on top of it.

## What this does *not* do (by design, per the brief)

- Does not build a scraper for a newly discovered site. Discovery classifies and queues for review, same as every other discovery path — turning a `queued_for_review` site into a working scraper (the Barnsdales/SMC pattern) remains a deliberate manual step.
- Does not do live open-web search today. It's one config value (`BING_SEARCH_API_KEY`) away, behind an interface already built for the swap, but that key isn't something I can provision from here.
- Does not touch the classifier, RLS policies, or the existing PR review flow.
