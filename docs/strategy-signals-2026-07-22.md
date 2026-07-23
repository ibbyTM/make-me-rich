# Strategy-specific signals (2026-07-22)

Follow-up to the same-day requirement rename (search-profile names →
strategy names). The user clarified what each strategy actually needs:

> "what i need is properties that are capable of adding value. its what
> citywide need. educating excellence need properties that are ready to be
> turned into a school with little work. u know what data centres require"

## Residential Conversion (Citywide) — Value-Add as the ranking signal

The Value-Add score (VOA business-rates price-percentile — see
`docs/value-add-2026-07-22.md`) already existed dataset-wide but wasn't tied
to any particular strategy. Wired in as directed: the existing
vacant/C2R/geography/budget Stage-0 filter stays the gate (unchanged), and
selecting "Residential Conversion" in the dashboard's Requirement filter now
defaults the sort to Value-Add Score (descending) — dashboard-only change,
no scoring-pipeline change, since Value-Add is already computed for every
listing regardless of which requirement matched it.

## School Conversion (was "Educating Excellence"/"Church & Chapel
Conversion") — retargeted + a real readiness signal

**Renamed and retargeted** (`src/requirements/seeds.ts`): keywords now lead
with `school`/`former school`/`academy`/`college`/`educational`, keeping the
former-church/chapel angle since those are a common, spacious,
community-oriented source of school-conversion stock in the UK — not
dropped, just no longer the only path in.

**"Ready with little work"** is not something Stage-0's keyword gate can
assess, and there's no free UK building-condition/survey dataset — same
class of problem as Value-Add's price signal, solved the same way: use the
best real, free lever available rather than fabricate one.
`src/scoring/schoolReadiness.ts` scores each listing's own marketing text
(`marketingText` — see below) against two keyword lists:

- **Ready-condition phrases** (+20 pts each): "recently renovated",
  "turnkey", "good condition", "ready for occupation", "well maintained",
  etc.
- **Work-needed phrases** (−25 pts each): "requires refurbishment",
  "development opportunity", "needs modernisation", "derelict",
  "disrepair", etc.

Score starts at 50 (neutral), moves per matched phrase, clamps to [0,100].
**No text, or text with no condition language either way, scores `unknown`**
— never a guessed mid score. Bands: `ready` (≥65), `some_work` (35–65),
`major_work` (<35), `unknown`.

This is a real but imperfect signal — agents don't always describe
condition, and marketing copy is naturally upbeat — the reasons array always
shows exactly which phrases were matched, so it's inspectable rather than a
black box.

### New data dependency: `marketingText`

The keyword text (`summary` + `keyFeatures` on Rightmove, `excerpt` +
`features` on PropertyHive-based sources) was already being fetched and used
internally for Stage-0 keyword matching, but discarded before being written
to the dashboard JSON — nothing new to scrape, just a field that wasn't
being persisted. Added `marketingText` to all 3 report scripts' row output.
Barnsdales' scraper carries no such field at all (confirmed in
`src/scrapers/barnsdales.ts` — categories/status only) — `marketingText:
null` there, not fabricated.

**Bug caught while wiring this up**: Rightmove's `keyFeatures` array
contains `{order, description, htmlDescription}` objects, not plain
strings, despite the scraper's type declaring `string[]`. The old code
(`...(p.keyFeatures ?? [])` spread directly into a `.join(' ')`) silently
produced literal `"[object Object]"` text — harmless while this text was
only used internally for a substring keyword search, but it had already
been written into 174 live dashboard rows once `marketingText` started
being persisted, and would have quietly polluted the school-readiness
scorer's input. Fixed in `src/scrapers/rightmoveCommercial.ts` by mapping
each `keyFeatures` entry to its `.description` before joining (with a
fallback for the plain-string case, in case some responses do return
strings). Confirmed clean on re-scrape — zero `"[object Object]"`
occurrences across all three dashboard data files.

## Data Centre Development

Unchanged — user confirmed the existing substation-proximity + size +
industrial/warehouse/land criteria (rebuilt earlier the same day, see
`docs/data-centre-fit-substations-2026-07-22.md`) are already right.

## Pipeline

- `src/scoring/schoolReadiness.ts`: pure scoring function.
- `scripts/school-readiness-listings.ts`: read-only enrichment, same pattern
  as dedup/data-centre-fit/value-add — reads `marketingText`, writes
  `schoolReadiness` back onto each row.
- Dashboard: new "School Readiness" filter (Ready/Some work/Major
  work/Unknown), card tag ("School readiness: ready", hover for matched
  phrases), and the Residential Conversion → Value-Add-sort default
  described above.

## Verified

Full base re-scrape (all 3 sources, live network) to populate
`marketingText` on every row, full enrichment chain re-run in order
(detail-geocode → data-centre-fit → dedup → value-add →
school-readiness), all 203 live rows carry all five enrichment layers
together (dedup/dataCentreFit/substation/valueAdd/schoolReadiness), full
test suite green (142 tests, two new modules with 21 new tests between
them), dashboard checked live via Playwright — School Conversion + Ready
filter and the Residential Conversion auto-sort both confirmed working
against real data.

## Known limitation

School readiness is only as good as the source's marketing text. Barnsdales
carries none at all (always `unknown`); Rightmove/PropertyHive listings
without any condition language in their summary/features also come back
`unknown` rather than a guess — of 203 live rows, 3 scored `ready`, 24
scored `major_work`, 176 `unknown`. That's an honest reflection of how
rarely agents describe condition explicitly, not a bug to "fix" by
inventing signal that isn't there.
