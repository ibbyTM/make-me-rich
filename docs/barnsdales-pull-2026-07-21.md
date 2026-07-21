# Barnsdales — live commercial-freehold pull + Stage-0 filter

**Date:** 2026-07-21 · **Source:** https://www.barnsdales.co.uk/properties · **Mode:** read-only live pull

Scraped **108** properties from the embedded `var properties` array; **4** passed the documented commercial-freehold filter (`freehold_from` not null, `residential === false`, status Available / Coming Soon). Stage-0 (minimum bar **2** of 4) then passed **2**.

> Region matching: Citywide's requirement is written as regions (Yorkshire / Greater Manchester), so each listing's postcode area is resolved to a region before matching (e.g. `DN`, `WF` → Yorkshire). Educating's named towns are matched by town name.

## Passed the filter

### Castleford, WF10 5HX — £600,000

- **Address:** Castleford (WF10 5HX)
- **Price:** £600,000 _(guide £600,000)_
- **Size:** 1.1 acres
- **Categories:** Land, Mixed Use
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Castleford Yorkshire" matches Citywide Investors; price 600000 within budget 500000-2000000

### Doncaster, DN1 1HQ — £575,000

- **Address:** Doncaster (DN1 1HQ)
- **Price:** £575,000 _(guide £575,000)_
- **Size:** 12000 sqft (12,000 sq ft)
- **Categories:** Retail Development, Retail, Pub / Bar / Club
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; price 575000 within budget 500000-2000000

## Scraped but did not pass Stage-0

| Address | Price (guide) | Size | Best score | Why not |
|---|---|---|---|---|
| Doncaster, DN1 3EA | £425,000 | 2776 sqft | 1/2 | geography "Doncaster Yorkshire" matches Data Centre Sites |
| Bawtry, DN10 6XB | £100,000 | Menagerie Wood 5.13 acres | 1/2 | geography "Bawtry Yorkshire" matches Data Centre Sites |

