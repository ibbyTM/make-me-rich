# CAIS — Source Onboarding Pipeline

Scaffold for the **Source Onboarding Pipeline** described in the build spec:
add new scrape sources, classify them automatically, auto-register the
confident ones, and filter scraped listings **for free** before they cost
Claude API budget.

> **Context.** This repo was empty, so this is a fresh, runnable skeleton. The
> real CAIS system (18 Supabase tables, Apify scraping, the Claude API scorer,
> the Day-5 Requirements matcher) is assumed to already exist; here it is
> represented by a **minimal base schema** (`0001_base.sql`) and typed adapter
> seams, just enough for the onboarding modules to be real, tested code rather
> than pseudocode. Swap the seams for the live system when integrating.

## What's built

| Spec section | Module |
|---|---|
| §2.1 sources columns, §2.2 `site_audits`, §2.3 `discovery_queue`, §2.4 RLS | `supabase/migrations/0002_source_onboarding.sql` |
| §3 `classify_site()` (pure decision logic) | `src/classifier/classify.ts` + `src/classifier/detectors.ts` |
| §3 steps 1/2/7 probing (HTTP + headless + robots/ToS) | `src/classifier/probe.ts` |
| §5 portal integrations (**in scope**) | `src/classifier/portals.ts` |
| §4 auto-registration rules (confidence + `tos_flag` gating) | `src/classifier/classify.ts` (`finalize`) + `src/pipeline/onboard.ts` |
| §5 discovery queue, bulk import, search discovery | `src/discovery/discovery.ts` |
| §6 Stage-0 fixed-criteria filter | `src/filter/stageZero.ts` |
| persistence (ports + in-memory + Supabase) | `src/db/*` |
| CLI | `src/cli.ts` |

## Architecture

The decision logic is **pure and fully unit-tested** (fixtures in, decision
out); all I/O — network, headless browser, database — is isolated behind
adapters. That is why `classifySite` and `stageZeroFilter` can be exercised
end-to-end with no network in `test/`.

```
discovery_queue ──drain──▶ probeSite ──▶ classifySite ──▶ log site_audit ──▶ upsert source
   (§5)                     (§3 I/O)      (§3 pure)          (§2.2)            (§4 gating)

scraped listing ──▶ stageZeroFilter (§6, free) ──pass──▶ [existing Claude API scorer]
                                                └─fail──▶ discard + log reason (no API call)
```

## Decisions baked in (per onboarding answers + spec §8)

- **Approval threshold `0.8`** (spec suggested default). Env-overridable via
  `APPROVAL_THRESHOLD`.
- **Portals in scope** — Rightmove Commercial, EG Propertylink, CoStar/LoopNet
  are recognised and given bespoke strategies; a portal is **always** routed to
  review the first time it's seen (many-agent integration = a human decision).
- **`tos_flag` always overrides** — any robots.txt/ToS restriction forces
  `needs_review` regardless of confidence (spec §4).
- **`manual_entry_only`** sources are still created (visible in the register)
  but never auto-scraped (spec §4, "same treatment as Michael Steel").
- **RLS three-tier** (admin / analyst / va) applied to `sources`,
  `site_audits`, and `discovery_queue` from day one (spec §2.4). Onboarding jobs
  write via the service-role key, which bypasses RLS by design.

## Still open for Ahmed (spec §8)

- Who reviews `needs_review` / `tos_flag` items — the RLS here lets
  admin **and** analyst write reviews; tighten `site_audits_write` /
  `sources_write` to admin-only if the ToS legal angle warrants it.
- Portal classification is stubbed with per-portal strategies but the actual
  per-portal scrapers are out of scope for this sprint.
- PRD update (v1.9 → v1.10).

## Usage

```bash
npm install
npm test            # 18 tests, no network needed
npm run typecheck

# Classify a single source (needs Supabase env, or use --dry-run for in-memory)
npm run onboard -- classify https://barnsdales.co.uk/ --dry-run

# Bulk import the ~20-agent list (one URL per line, or CSV first column)
npm run onboard -- import ./agents.csv --dry-run
```

Environment config: copy `.env.example` → `.env`. Playwright is an **optional**
dependency; without it, probing degrades gracefully to raw-HTML-only (lower
signal) instead of failing.

## Migrations

Apply in order against Supabase:

```
supabase/migrations/0001_base.sql            # minimal base (stands in for existing CAIS tables)
supabase/migrations/0002_source_onboarding.sql   # Day A: columns + 2 tables + RLS
```

In the real project, `0001` already exists — apply only `0002` and reconcile the
`sources` / `requirements` / `listings` column names with the live schema.
