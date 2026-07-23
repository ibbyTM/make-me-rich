# Real substation capacity (MW/MVA), 2026-07-23

The user pointed out substations were shown in kV (voltage) and asked for
MW instead. Voltage and power capacity are different physical quantities —
voltage doesn't convert to capacity without load/current data, which no
free source publishes at substation level. Rather than fabricate a
conversion or an "indicative range," researched whether a real, free,
no-registration dataset with actual per-substation capacity figures exists.

## What exists, and where

Checked the three DNOs covering this pipeline's geographies:

- **Northern Powergrid** (Yorkshire, North East England) — open data portal
  (`northernpowergrid.opendatasoft.com`), confirmed no-login. "Substation
  Sites List" carries a real `firm_capacity_mva` figure for every
  Primary/BSP/GSP-level site (33kV+). Downloaded the full 57,933-row CSV;
  filtered to the 683 rows with a genuine (non-"Not Applicable") capacity
  figure — see `data/npg-substation-capacity.json`.
- **Electricity North West** (Greater Manchester, Merseyside, Lancashire) —
  capacity/substation datasets on their open data portal are gated:
  "actual dataset content is available to registered users only."
- **NGED** (West Midlands, East Midlands) — same gate on their
  "Distribution Substations" capacity dataset (`connecteddata.nationalgrid.co.uk`).
  Their one no-login dataset (`substation-loading`) is raw MW/MVAr demand
  time-series for named transmission buses, not a capacity rating — using
  it to estimate capacity from historical peak load would be the same
  "fabricate precision we don't have" problem already ruled out earlier for
  VOA yield multipliers and Land Registry residential comparables.

So real MVA data only exists, free and without registration, for
Yorkshire/North East — 2 of this pipeline's 5 geographies.

## Design decision

Given partial coverage, three options were on the table: keep kV
everywhere (drop MW), show real MVA only in NPG territory and "capacity
unavailable" elsewhere, or show real MVA where available and fall back to
the existing kV signal elsewhere, clearly labelled either way. Chose the
third — real data wherever it exists is strictly better than not showing
it, and the existing kV signal is itself real (not fabricated), so falling
back to it isn't a regression.

## Implementation

- `data/npg-substation-capacity.json` — 683 real Primary/BSP/GSP
  substations (Yorkshire/North East), each with `firmCapacityMva`,
  `siteLevel`, and location.
- `src/geo/substationCapacity.ts` — `loadNpgSubstationCapacity()` +
  `nearestCapacitySubstation(point, list, maxKm=8)`. Deliberately a
  separate, additive module from `src/geo/substations.ts` (the existing
  GB-wide OSM voltage-tier dataset) — not merged/matched into it, since
  matching two independently-sourced substation datasets by name/location
  risks misattributing one substation's capacity to a different physical
  site. Kept as two independent nearest-neighbour lookups instead.
- `scripts/data-centre-fit.ts` — writes a new `row.substationCapacity`
  field (real MVA, `null` outside NPG's coverage) alongside the existing
  `row.substation` (kV, GB-wide). The **score** still runs entirely off
  `row.substation`'s voltage-tier signal — unchanged, one consistent scale
  nationally. Only the **display** upgrades to real MVA where it exists.
- `dashboard/dashboard.html` — card badge shows `row.substationCapacity`
  (e.g. "0.5km to Jarratt Street (23 MVA)") when present, otherwise falls
  back to the existing kV badge.

## Verified

- 153 of 211 live rows (Yorkshire/North East-heavy dataset) now show real
  MVA; the remaining 58 (Greater Manchester, and anywhere else NPG doesn't
  cover) correctly fall back to the kV badge — checked directly against the
  written JSON, not just visually.
- Live dashboard screenshot confirms both states render correctly:
  `Doncaster, DN1 3EA` → "0.5km to Jarratt Street (23 MVA)";
  Greater Manchester rows → "0.3km to Bloom Street Substation (132kV)".
- 4 new unit tests for `nearestCapacitySubstation` (in-range match,
  out-of-range returns null rather than a fabricated match, nearest-of-two,
  custom radius). Full suite: 148 tests passing.
