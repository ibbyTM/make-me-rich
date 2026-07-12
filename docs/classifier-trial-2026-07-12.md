# Classifier dry-run trial — 6 real UK commercial agent sites

**Date:** 2026-07-12 · **Mode:** dry run (shakeout) · **Threshold:** 0.8
**Safety:** 6/6 audit rows logged to `site_audits`; **0 sources set to `active`** (every source forced to `pending_review`). Nothing was queued for live scraping.

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
