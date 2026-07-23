# 11 new candidate sources — discovery batch (2026-07-19)

**Mode:** read-only live discovery, same gate as every prior run. Every candidate
was written to `discovery_queue` → classified → written to `sources` with
`status` **hardcoded to `pending_review`** (verified in the DB after the run —
`sourcesSetActive: 0`) → logged to `site_audits`. Nothing was auto-activated;
nothing was scraped beyond the single read-only classification fetch per site.

Run script: `scripts/new-sources-discovery-2026-07-19.ts`. All 11 URLs were
confirmed live via web search before use — none were guessed.

## Pipeline changes made for this batch

Three real pipeline changes landed before this batch ran (tests: `test/detectors.test.ts`,
`test/requirementDiscovery.test.ts`, additions to `test/classify.test.ts` — 74/74 passing):

1. **Bot-challenge detection (`src/classifier/detectors.ts` → `detectBotChallenge`).**
   A 403/429, or a 200-status Cloudflare/Akamai/PerimeterX-style interstitial,
   is now caught *before* classification runs and logged as outcome **`blocked`**
   — still with a full `sources` + `site_audits` row (classification
   `needs_review`, decision `queued_for_review`, `detected_structure` starting
   `BLOCKED:`), not silently dropped and not misclassified as ordinary
   low-signal static content.
2. **Portals now run the live robots/ToS gate for real** (`src/classifier/portals.ts`
   `classifyPortal`). This was a latent bug: the portal shortcut previously
   hardcoded `tosFlag: false` for every portal — including Rightmove — and
   never looked at `robots.txt`/ToS at all. It now runs the same
   `checkRobotsAndTos` gate as every other site; portals still always decide
   `queued_for_review` regardless (that rule is unchanged), but the audit
   trail now reflects genuine findings instead of a hardcoded pass.
3. **Large-corporate policy override** (`src/classifier/bigCorporates.ts`).
   CBRE, Savills and Knight Frank Commercial are ordinary agent sites (not
   portals), so they still run the full technical classifier. A new step
   forces `tosFlag = true` (→ mandatory review) for these three regardless of
   confidence, **without overwriting the genuine technical classification** —
   unlike the text-based ToS gate, which does overwrite classification to
   `needs_review`. The technical finding stays visible in the audit note
   alongside the `POLICY:` reason.

The portal registry itself was also extended: **Zoopla Commercial** and
**NovaLoca** were added alongside the existing LoopNet/Rightmove/EG entries
(genuine multi-agent aggregators, same treatment). **Realla** was added too,
sourced to `realla.co.uk` only — `realla.com` no longer resolves at all (DNS
failure), and CoStar acquired Realla in 2018.

## Priority 1 — aggregator portals

| Site | URL used | Outcome | Why |
|---|---|---|---|
| **LoopNet UK** | loopnet.co.uk/ | **Blocked** (HTTP 403) | Already a registered portal (existing entry, hosts accurate). Every automated request this pass, including the plain homepage, returned 403. |
| **Zoopla Commercial** | zoopla.co.uk/for-sale/commercial/ | **Blocked** (HTTP 403) | Newly registered as a portal this pass. 403 on first request — matches the expectation set going in. |
| **NovaLoca** | novaloca.com/ | **Review-queued** (portal, `api_endpoint`/0.95, `tosFlag: false`) | Newly registered as a portal this pass — **not previously in the registry at all**. Only Priority-1 site that isn't outright blocked. **Caveat, checked manually:** the `api_endpoint` label is the portal's bespoke policy classification, not a verified technical finding — I fetched a real NovaLoca search-results page directly (`property-search-results/default.aspx`) and found no embedded JSON array, no `__NEXT_DATA__`/hydration blob, nothing but a classic ASP.NET WebForms page (`ScriptResource.axd` postback scripts). No bespoke scraper is justified on this evidence; it stays a review-gated portal entry only. |

## Priority 2 — peer regional/national agents

| Site | URL used | Outcome | Why |
|---|---|---|---|
| **Knight Frank Commercial** | knightfrank.co.uk/commercial | **Review-queued** — `needs_review`, confidence 0.6, `tosFlag: true` | `robots.txt` **Disallow covers listing paths** (live-detected, not the policy override — the genuine gate fired first). ToS confirmed manually (below): explicit scraping prohibition. |
| **CBRE UK** | cbre.co.uk/property-search | **Blocked** (HTTP 403) | 403 on every path tried, including the Terms-of-Use page itself. ToS confirmed via `cbre.com` (below) — same policy language, and would have forced review via the big-corporate override regardless. |
| **Savills UK** | savills.co.uk/find-commercial-property/ | **Review-queued** — `needs_review`, confidence 0.8, `tosFlag: true` | `robots.txt` Disallow covers listing paths (live-detected). ToS confirmed manually (below) — no "scraping" keyword, but a real restriction in effect. |
| **Lambert Smith Hampton** | lsh.co.uk/property-search | **Review-queued** — `static_html`, confidence 0.6 | Real search-results page fetched manually: no embedded JSON, no listing content in raw HTML at all — the actual search UI appears to be client-rendered, which this sandbox can't confirm (no working headless browser here — pre-existing, documented limitation). Confidence stayed low; correctly not auto-approved. |
| **Avison Young** | avisonyoung.co.uk/properties-for-sale | **Blocked** (HTTP 403) | Homepage redirected to a results URL, which then 403'd. |
| **Eddisons** | eddisons.com/property-search | **Review-queued** — `static_html`, confidence 0.6 | Real Leeds search-results page fetched manually: no price/address content and no embedded JSON in raw HTML — same "likely client-rendered, can't confirm" situation as LSH. Correctly stayed low-confidence/review. |

**CBRE / Savills / Knight Frank — mandatory review, explicit ToS findings (read manually, not just regex-scanned):**

- **Knight Frank** — explicit and specific: *"You must not engage in spamming, flooding, harvesting of e-mail addresses or other personal information, spidering, screen scraping, database scraping, or any other activity with the purpose of obtaining lists of users or any other information, including specifically, property listings available through the site which are sourced from and driven by Knight Frank's proprietary database."* Unambiguous.
- **CBRE** — `cbre.co.uk`'s own Terms-of-Use page 403'd every fetch attempt (including a plain read), so this was read on the `cbre.com` mirror (same shared corporate policy — the UK page's own search-result snippet corroborates near-identical wording). Explicit: *"harvesting of e-mail addresses or other personal information, spidering, screen scraping, database scraping, or any other activity with the purpose of obtaining lists of users or any other information."*
- **Savills** — no "scraping"/"crawl"/"robot" keyword anywhere in the T&C text, but Section 3 (Intellectual Property) is broadly restrictive in effect: *"You may not make a permanent copy of or reproduce this website or any of its contents in any form. You may not reproduce or incorporate this website or any of its contents into any other website. You may only print or cache temporary copies of the content for your own personal non-commercial use."* A systematic pull of listing data into a database is a "permanent copy... in any form" under this wording, even without a scraping-specific clause.

All three are flagged for review **regardless of the technical classification result** — CBRE never got a technical read at all (blocked outright); Knight Frank and Savills both independently tripped the live `robots.txt` gate on top of the ToS findings above, and would have hit the big-corporate policy override either way.

## Priority 3 — small/independent listing sites

| Site | URL used | Outcome | Why |
|---|---|---|---|
| **Boxpod** | boxpodcommercialproperty.co.uk/ | **Review-queued** — `needs_review`, confidence 0.6, `tosFlag: true` | `robots.txt` Disallow covers listing paths (live-detected). Real unit-to-let listing page found and fetched; ld+json present but SEO-schema only, not listing-shaped. |
| **Realla** | realla.co.uk/sale/commercial-property | **Blocked** (HTTP 403) | 403 on every automated request tried, consistent with (not proof of) having moved onto CoStar's shared anti-bot stack post-2018-acquisition. `realla.com` doesn't resolve at all (DNS failure) — dropped from the portal registry's host list as inaccurate. |

## Scrapers built this pass

**None.** No candidate produced a genuinely high-confidence, technically-verified
`embedded_json`/`api_endpoint` finding:

- The only `api_endpoint` labels (LoopNet/Zoopla/NovaLoca) are the portal
  registry's bespoke *policy* classification, not a verified technical read —
  and the one portal that wasn't outright blocked (NovaLoca) was manually
  checked and found to have no embedded JSON evidence on its real
  search-results page.
- Every non-portal, non-blocked site (LSH, Eddisons, Boxpod) came back
  `static_html`/`needs_review` at confidence ≤ 0.6 — below the 0.8
  auto-approve bar, and per this pass's explicit scope, not force-fit into a
  bespoke scraper.

Consequently there are no new passed listings to add to the dashboard this
round — `dashboard/data/*.json` is unchanged.

## Summary

| Outcome | Count | Sites |
|---|---|---|
| Blocked (403/anti-bot) | 5 | LoopNet UK, Zoopla Commercial, CBRE UK, Avison Young, Realla |
| Review-queued (technical) | 4 | Lambert Smith Hampton, Eddisons, Savills UK*, Knight Frank Commercial* |
| Review-queued (portal policy) | 1 | NovaLoca |
| Review-queued (robots/ToS gate) | 1 | Boxpod |

_*Savills and Knight Frank also independently tripped the live robots.txt gate — counted once each above under "review-queued (technical)"._

**11/11 logged to `site_audits`. 0/11 auto-activated.** All 11 sit in
`sources` with `status = 'pending_review'`, same as every source this pipeline
has ever produced.

## Addendum — LoopNet follow-up and expanding coverage via PropertyHive reuse

LoopNet was asked for directly after this batch. It stays blocked: a plain,
non-evasive read request got a flat 403, and CoStar (LoopNet's owner) both
explicitly prohibits "spidering, screen scraping, database scraping" in its
Terms of Use and has a well-documented history of suing scrapers. No
anti-bot-evasion technique (custom headers, proxies, browser automation, the
`bypass-403` header-trick collection) was built to get around that — the
block is both technical and contractual, and "personal, unpaid use" doesn't
change either fact. If real LoopNet access is wanted, the legitimate paths are
an official CoStar/LoopNet data license or API, or a licensed third-party data
provider — either would get built the same way as every other source (logged,
gated to `pending_review`, nothing auto-activated).

Redirected effort into "get more sources" honestly: re-ran the original
2026-07-17 discovery batch (`scripts/discovery-classify.ts`, 21 independent
regional agents — its results don't survive a container restart since the
PGlite store is local-only) to repopulate classification data, then probed
every one of those 21 agents' domains directly for the same
`wp-json/wp/v2/property`-shaped REST endpoint that made SMC Brownill Vickers
scrapeable, rather than relying on the classifier's page-crawl heuristic
(which mis-picks the real listings page on WordPress sites more often than
not — confirmed again this round on Lambert Smith Hampton, Eddisons, and
several of these 21).

**Result: two new confirmed, live, real sources added to `PROPERTY_HIVE_SOURCES`:**

| Site | Total on API | Commercial for-sale | Passed Stage-0 | robots.txt |
|---|---|---|---|---|
| Gifford Dixon (Manchester) | 35 | 12 | 2 | clean (`/wp-admin/` only) |
| Shepherd Commercial (Birmingham) | 186 | 20 | 0 | clean (`/wp-admin/` only) |

Both confirmed with the full PropertyHive field shape (`price_from`,
`floor_area_from`/`floor_area_units`, `department: "commercial"`, real photo
URLs) — not just a same-named endpoint. `scripts/discovered-agents-report.ts`
re-classifies each with real API-response evidence before pulling, same gate
as SMC. Live pull now totals **6 passed listings across 3 sources** (up from
4 across 1), written to `dashboard/data/discovered.json`.

**Two more of the 21 exposed a similarly-shaped `wp-json/wp/v2/property` API
but were excluded on hard evidence, not guesswork:**

- **Dacres Commercial** and **Bradley Hall** — real listing data, but a
  *different* backing system (Reapit, not PropertyHive: `price`/`price_actual`
  instead of `price_from`, no `floor_area_from`), and both publish a blanket
  `Disallow: /` in `robots.txt`. Excluded on both the schema mismatch and the
  robots.txt block.
- **Cardwells** — genuine PropertyHive schema and clean robots.txt, but its
  API carries **zero** commercial-department listings across all 523 records
  (residential-sales/lettings only) — already noted in the codebase from the
  2026-07-17 batch; re-verified here.

**The remaining agents were checked and not pursued, on evidence rather than
by default:**

- 14 of the 21 have no PropertyHive-style REST endpoint at all.
- Of the 4 that classified `static_html` at confidence 0.8 (Leonards,
  Frobishers, Raybould & Sons, Barker Property — meaning a real HTML page,
  auto-approve-eligible on paper), only **Leonards** actually showed listing
  content on the page fetched, and it's an Alto-CRM-backed agent whose visible
  commercial stock is overwhelmingly lettings (`pcm`/`pa` pricing), not the
  for-sale stock these requirements are scoped to. The other three showed no
  price/address content in the raw HTML on the page the crawler found — likely
  JS/AJAX-loaded, which this sandbox can't confirm (no working headless
  browser here, a pre-existing documented limitation, not something specific
  to this run).

Building bespoke single-site HTML scrapers for any of those four would be
speculative work for uncertain payoff, so none were built this pass — matches
the standing instruction not to force sites into bespoke scrapers without real
evidence of payoff. Happy to build any of them if someone wants to manually
confirm what the real search-results page looks like first.
