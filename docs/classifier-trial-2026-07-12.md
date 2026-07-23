# Classifier dry-run trial — 6 real UK commercial agent sites

**Date:** 2026-07-12 · **Mode:** dry run (shakeout) · **Threshold:** 0.8
**Safety:** 6/6 audit rows logged to `site_audits`; **0 sources set to `active`** (every source forced to `pending_review`). Nothing was queued for live scraping.

> **UPDATE — fixes applied and re-run the same day.** The detector issues flagged
> below were fixed and the six sites re-classified. Auto-approvals dropped from
> **6/6 to 1/6**; all four false-positive/wrong cases now route to review. See
> **[§ Re-run after fixes](#re-run-after-fixes)** at the end. The sections below
> are the *original* run that motivated the fixes.

## ⚠️ Read this first — a sandbox limitation shaped every result

The headless browser could not egress through this environment's policy proxy (Chromium connections reset). So the classifier ran **raw-HTML-only**: `renderedDom == rawHtml` and the network log was empty for all six sites. Two of the five classifier signals were therefore **structurally disabled**:

- **`js_rendered`** — impossible to detect (raw-vs-rendered diff is always `0.00`, so every site defaults to the `static_html` baseline).
- **`api_endpoint`** — impossible to detect (no XHR/fetch capture).

Every "detected structure" note below reads `dom diff ratio 0.00` for this reason. Treat this as a run of the *raw-HTML half* of the classifier, not the whole thing. A production run with a working browser could reclassify several of these.

## Results

| Site | Geo | Classification | Conf. | Verdict | Flag |
|---|---|---|---|---|---|
| Savills (commercial search) | National | `embedded_json` | 0.90 | auto-approved | ⚠️ medium |
| Barnsdales | Doncaster | `static_html` | 0.80 | auto-approved | 🚩 surprising |
| Michael Steel & Co | National | `static_html` | 0.80 | auto-approved | 🚩 wrong |
| Carter Towler | Leeds | `embedded_json` | 0.90 | auto-approved | 🚩 false positive |
| Canning O'Neill | Manchester | `embedded_json` | 0.90 | auto-approved | 🚩 false positive |
| Naylors Gavin Black | Newcastle | `embedded_json` | 0.90 | auto-approved | 🚩 false positive |

*Verdict = the classifier's natural decision at threshold 0.8. All six were **stored** as `pending_review` regardless (dry-run safety).*

## Per-site detail

### Savills — `embedded_json` 0.90 — ⚠️ plausible but over-confident
Detected a Next.js `__NEXT_DATA__` hydration blob **and** a valid `application/ld+json` block. No ToS flag (robots.txt fetched, no broad `Disallow`).
This is the most *defensible* embedded_json call — Savills SSRs its first page of results into `__NEXT_DATA__`, so listing data really is embedded. **But:** Savills is a national aggregator that paginates the rest via API, and `__NEXT_DATA__` typically holds only page 1 + config. Auto-approving it at 0.9 with a `direct-json-extract` strategy would likely capture page 1 and silently miss the rest. Closer to a portal than a single agent — worth routing to review on principle.

### Barnsdales — `static_html` 0.80 — 🚩 the "known-good embedded-JSON baseline" did NOT reproduce
The earlier build treated Barnsdales as the embedded-JSON baseline (`window.properties`). The **real homepage** has no such blob. It *does* carry one `ld+json` script, but the content is **invalid JSON** (`Unexpected non-whitespace character…` — looks like two objects concatenated in one tag), so the detector correctly skipped it and fell back to `static_html`.
Two things to note: (1) the baseline assumption in the handover doc was about a **listings page**, not the homepage I classified — a methodology gap (see below); (2) the detector's strict `JSON.parse` validation is arguably working *correctly* here by refusing malformed JSON.

### Michael Steel — `static_html` 0.80 — 🚩 `manual_entry_only` failed to fire on the exact site meant to test it
The homepage genuinely contains `<form method="post" name="ps" action="/property-search/">` — a POST-only search, which is the textbook `manual_entry_only` case. It did **not** trigger. Reason: the detector requires *no* listing-type links anywhere on the page, but the nav contains `/property…`-style links, so `hasListingLinks` is true and the rule bails. **The "no addressable listing URLs" heuristic is defeated by ordinary nav links.** This is a real detector weakness, surfaced exactly where you pointed it.

### Carter Towler (Leeds) — `embedded_json` 0.90 — 🚩 false positive
The only `ld+json` is an SEO `@graph`: `WebPage, BreadcrumbList, WebSite, Organization`. **Zero listing data.** It's a WordPress site. The classifier saw "valid ld+json → embedded_json, 0.9, auto-approve," but a `direct-json-extract` scraper here would harvest breadcrumb/organisation metadata, not properties.

### Canning O'Neill (Manchester) — `embedded_json` 0.90 — 🚩 false positive
Same failure mode. `ld+json` is `Organization, LocalBusiness, RealEstateAgent, PostalAddress…` — business/SEO schema, no listings. WordPress. Confident 0.9 auto-approval off SEO markup.

### Naylors Gavin Black (Newcastle) — `embedded_json` 0.90 — 🚩 false positive (different path)
Has **no `ld+json` at all**. The `embedded_json` verdict came from the generic "large inline JSON blob (>500 chars)" rule matching a 1,021-char incidental blob (config/analytics-shaped). Flagged as extractable listings JSON at 0.9. It isn't.

## The systemic findings (what you actually want to know)

1. **`embedded_json` is confidently wrong 3 times out of 6.** The detector fires on *any* valid `ld+json` (which almost every modern site has for SEO) or *any* ≥500-char inline JSON, and stamps it **0.9 + auto-approve**. It never checks whether the JSON is *listing-shaped*. This is the biggest issue: on real agent sites, SEO schema markup masquerades as "embedded listings."

2. **`manual_entry_only` under-fires.** Defeated by the presence of any `/property`-ish link. The one POST-form site in the set slipped straight past it to `static_html`.

3. **6/6 auto-approved.** Had this been go-live, all six would have activated — three on false-positive embedded JSON, plus Michael Steel (which is manual-entry) and Savills (partial-capture). The forced `pending_review` is the *only* thing that stopped that. The 0.8 threshold provides no protection when the detector hands out 0.9s for incidental JSON.

4. **The ToS gate was only half-exercised.** robots.txt was fetched for all six (none had broad `Disallow` over listing paths → no flag, which looks correct), but the ToS-text side found no page — the `/terms` path-guessing missed real footer-linked policy pages. That half of the gate effectively didn't run.

5. **Methodology caveat:** I classified each site's **homepage**, not its listings/search page. Embedded-data and API signals live on the *results* pages, not the homepage — so `embedded_json`/`api_endpoint` are systematically under-observed here. The classifier should be pointed at a representative listings URL, not the root domain.

## Suggested fixes (not applied — flagging only)

- Gate `embedded_json` on the JSON being **listing-shaped** (array of objects with price/address/size-type fields), reusing the `LISTING_FIELDS` logic already in `findListingApi`. SEO `@type` values (`Organization`, `WebSite`, `BreadcrumbList`, `LocalBusiness`, `RealEstateAgent`) should not count.
- Lower confidence for "some JSON found" vs. "listings JSON found," so it lands below the auto-approve bar when unsure.
- Strengthen `manual_entry_only`: a POST-only search form should weigh more heavily than the mere presence of nav links.
- Make the headless render work in the real environment before trusting go-live decisions — `js_rendered` and `api_endpoint` are dead without it, and those are exactly the classes the false-positive sites likely belong to.
- Classify a listings URL per source, not the homepage.

---

<a name="re-run-after-fixes"></a>

# Re-run after fixes

Three detector fixes were applied (`src/classifier/detectors.ts`, `classify.ts`) and locked in with six regression tests (`test/classify.test.ts`) that reproduce the exact sites below:

1. **`embedded_json` is now gated on listing shape.** A JSON payload only counts as embedded listings if it contains an array of objects carrying ≥2 property fields (same bar as `findListingApi`). SEO `@type`s (`Organization`, `WebSite`, `BreadcrumbList`, `LocalBusiness`, `RealEstateAgent`, …) are named and excluded.
2. **Generic JSON no longer auto-approves.** When JSON is present but not listing-shaped, the classification stays on the DOM-diff baseline and confidence is capped at **0.6** — below the 0.8 bar — so it routes to review.
3. **`manual_entry_only` strengthened.** A POST-only search form now outweighs category/nav links; it is only vetoed by ≥3 addressable listing-*detail* links (a category segment followed by a slug).

## Before → after

| Site | Before | After | Δ |
|---|---|---|---|
| Savills | `embedded_json` 0.90 · auto | `static_html` 0.60 · **review** | ✅ no longer confident |
| Barnsdales | `static_html` 0.80 · auto | `static_html` 0.80 · auto | ➖ unchanged (correct) |
| Michael Steel | `static_html` 0.80 · auto | `manual_entry_only` 0.85 · **review** | ✅ fixed |
| Carter Towler | `embedded_json` 0.90 · auto | `static_html` 0.60 · **review** | ✅ false positive fixed |
| Canning O'Neill | `embedded_json` 0.90 · auto | `static_html` 0.60 · **review** | ✅ false positive fixed |
| Naylors Gavin Black | `embedded_json` 0.90 · auto | `manual_entry_only` 0.85 · **review** | ✅ false positive fixed |

**Auto-approvals: 6 → 1.** Only Barnsdales (a genuinely static page with no misleading JSON) still auto-approves. **0 sources set to `active`** (dry-run safety unchanged).

## Per-site notes

- **Savills** — its `__NEXT_DATA__` + `ld+json` are now recognised as *generic* (the listing data is nested deeper / under non-standard key names than the `LISTING_FIELDS` check matches), so it drops to `static_html` 0.60 → review. For a national aggregator that's the safer outcome, though it's arguably a *slight* over-correction: the data probably *is* extractable with a Savills-specific mapping. Detected note now reads `ld+json is SEO schema (BreadcrumbList) — excluded`.
- **Carter Towler / Canning O'Neill** — the SEO `@graph` (`WebPage`, `Organization`, `RealEstateAgent`, …) is explicitly excluded; both correctly fall to `static_html` 0.60 → review.
- **Michael Steel** — the POST search form (`action="/property-search/"`) now fires `manual_entry_only` despite the `/property…` nav links (0 addressable detail links).
- **Naylors** — the 1,021-char incidental blob is no longer treated as listings; it *also* has a POST-only search form, so it lands on `manual_entry_only` 0.85 → review.

## Remaining caveats (unchanged / new)

- **Headless render still unavailable** in this sandbox (known issue, left as-is per instruction). All diffs remain `0.00`, so `js_rendered` and `api_endpoint` were still untestable. In production with a working browser, the SEO-only sites that now read `static_html` 0.60 could instead surface as `js_rendered` or `api_endpoint`.
- **Naylors' live fetch was slow** (~10–20 s through the proxy) and timed out inside the batch run — its result above was captured with a longer per-request timeout out-of-band. The batch therefore logged **5** audit rows, not 6; the sixth is covered by the `Naylors` regression test.
- **Possible over-correction:** because nearly every site carries SEO `ld+json`, the "generic JSON → review" rule will route many legitimately-static sites to review. That's the safe direction (no wasted API, human confirms), but expect a larger review queue than before. Tune `GENERIC_JSON_CONFIDENCE` / the shape check if the queue is too heavy.

## Tests added (regression guards)

`test/classify.test.ts` → `classifySite — trial regressions`: Carter Towler, Canning O'Neill, Naylors (all assert **not** `embedded_json` + review), Michael Steel (asserts `manual_entry_only`), plus a positive control (a real array of listing objects still auto-approves) and a veto control (many detail links override the POST-form rule). Full suite: **29 tests pass**.
