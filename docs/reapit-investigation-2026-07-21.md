# Reapit-shaped API investigation (2026-07-21) — negative result

Follow-up to the PropertyHive-widening passes, which repeatedly ran into a
similar-but-different WordPress REST schema (`price`/`price_actual` instead
of `price_from`, no `floor_area_from`, `bedrooms`/`bathrooms`/
`reception_rooms` fields suggesting a residential-first CRM) on six sites:
Dacres Commercial, Bradley Hall, Miller Metcalfe, Ashtons, Jameson &
Partners, W.T. Parker. Six recurrences looked like real leverage — a second
small parser might unlock several sources at once. Investigated before
building anything.

## What was checked

For the four not already excluded on robots.txt grounds (Dacres and Bradley
Hall both publish a blanket `Disallow: /`, already ruled out in the first
PropertyHive-widening pass), pulled a representative spread of pages from
each site's full catalogue and tallied `department` values, looking
specifically for `commercial` records and what their `acf` (WordPress
Advanced Custom Fields) blob actually contains — since the top-level schema
clearly isn't built for commercial floor-area data, the working theory was
that it might live in `acf` instead.

| Site | Total records | Commercial found | Notes |
|---|---|---|---|
| Jameson and Partners | 123 (full scan) | **0** | 104 residential-sales, 19 residential-lettings |
| Miller Metcalfe | 880 (sampled ~380) | **1** | `acf: []` — empty, no size data even on the one commercial record found |
| Ashtons | 1,733 (sampled ~233, spread across start/middle/end) | **0** | 200 residential-sales, 33 residential-lettings in sample |
| W.T. Parker | 52 (full scan) | **0** | 46 residential-sales, 6 residential-lettings |

## Conclusion

**Not worth building.** Every one of the six Reapit-shaped sites is
excluded, on hard evidence rather than a guess:

- Dacres Commercial, Bradley Hall: real commercial stock exists (confirmed
  in the earlier pass), but both publish a blanket `robots.txt: Disallow: /`
  — a genuine access restriction, not a technical gap.
- Miller Metcalfe, Ashtons, Jameson & Partners, W.T. Parker: robots.txt is
  clean on all four, but they're genuinely residential-only (or
  residential-99.9%) agents. Even Miller Metcalfe's single commercial record
  had an empty `acf` field — no floor area, no land size, nothing a Data
  Centre Fit score could use even if a scraper were built.

The recurring schema is a real pattern (Reapit or a similar residential-
focused property CRM, widely used among smaller UK agents), but "same API
shape" turned out to correlate with "residential-focused agent," not with
"commercial stock we're missing." Building a second generic scraper for this
shape would have added code with no listings behind it. No scraper built,
no new sources added — an honest zero, not a gap in the method.
