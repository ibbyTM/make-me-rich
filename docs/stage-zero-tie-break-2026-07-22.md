# Stage-0 investigation: geography gap + tie-break bug (2026-07-22)

Follow-up to a dashboard spot-check: "Fulneck School, Fulneck, Pudsey, Leeds"
— marketing text literally reads *"substantial former school estate...
Substantial former educational accommodation"* — was tagged **Data Centre
Development**, not School Conversion. Investigated why.

## Bug 1: stale geography list

School Conversion's `geographies` were individual city names
(`manchester, bolton, sheffield, bradford, huddersfield`) — inherited
as-is from the original "Educating Excellence" requirement, never audited
when the requirement was renamed/retargeted earlier the same day.

Rightmove Commercial actually scrapes **7** cities
(`src/scrapers/rightmoveCommercial.ts`'s `CITYWIDE_CITIES`): the 5 above,
plus **Leeds** and **Doncaster** — both entirely missing from School
Conversion's list. Because School Conversion is geo-prescoped
(`src/filter/stageZero.ts`), a geography mismatch **disqualifies the
requirement outright, before its keywords are even checked**. A listing
in Leeds or Doncaster could never match School Conversion — no matter
how clearly its text said "school" — purely on a stale list.

**Fix**: switched to the same region-level matching Residential Conversion
and Data Centre Development already use (`['yorkshire', 'greater
manchester']`) instead of an enumerated city list, so a future new scraped
city can't silently reopen this gap.

## Bug 2: tie-break went to an arbitrary requirement

Fixing the geography gap alone wasn't enough — Fulneck School still showed
Data Centre Development. Both requirements scored **2** for this listing:

- Data Centre Development: size ≥20,000 sqft (+1) + keyword hit on
  `"freehold"` (+1) — a **global** keyword (`src/filter/stageZero.ts`'s
  `GLOBAL_KEYWORDS`) present in nearly every commercial listing.
- School Conversion: size ≥2,000 sqft (+1) + keyword hit on `"school"`
  (+1) — its **own** keyword, directly on-topic.

`stageZeroFilter` only switches its running "best" match on a *strictly
higher* score (`score > best.score`); a tie keeps whichever requirement was
evaluated first. Requirements are loaded via `listActiveRequirements`,
ordered `created_at desc` — so the tie went to whichever requirement
happened to be created most recently (Data Centre Development, created
2026-07-21), a purely incidental fact with no bearing on relevance.

Underlying cause of the tie itself: the keyword-matching code checked
`[...GLOBAL_KEYWORDS, ...req.keywords]` as one combined array and took the
*first* match — since `GLOBAL_KEYWORDS` lists `"freehold"` first, it won
out over `"school"` even when scoring School Conversion itself, so the
"which keyword hit" signal wasn't even reliably visible for tie-breaking.

**Fix**: `scoreAgainst` now checks a requirement's own keywords
independently of the global list, preferring a requirement-specific hit for
both the reported reason text and a new internal `hasSpecificKeyword` flag.
`stageZeroFilter`'s tie-break: on equal scores, prefer whichever candidate
matched its own keyword over one that only matched a global keyword. A
genuine tie with no specific keyword on either side still falls back to
the original "first evaluated" behaviour — unchanged, since there's no
better signal to break it with.

## Verified

- `Fulneck School` now correctly shows `School Conversion`, matched via
  keyword `"school"`.
- Two new unit tests in `test/stageZero.test.ts` reproduce both the
  tie-break-to-specific-keyword case and confirm the no-specific-keyword
  fallback is unchanged.
- Fresh full re-scrape (needed since the geography fix opens up Leeds/
  Doncaster listings to School Conversion for the first time — an in-place
  enrichment pass can't recover previously Stage-0-failed listings, only a
  live re-scrape can) — **School Conversion matches jumped from 82 to
  112**, Data Centre Development dropped from 65 to 55, Residential
  Conversion from 59 to 44. All real, all explained by the fix.
- All 211 live rows carry all five enrichment layers together, full test
  suite green (144 tests).

## Scope note

This tie-break fix is deliberately narrow — prefer specific over global
keywords, nothing more. A broader fix (counting every keyword hit instead
of capping at one point) was considered and explicitly declined: it would
change the scoring scale for every requirement and require re-checking
every minimum-bar threshold across the dataset, a materially bigger change
for a benefit not yet shown to be needed beyond this one case.
