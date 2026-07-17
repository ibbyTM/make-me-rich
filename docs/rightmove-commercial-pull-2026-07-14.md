# Rightmove Commercial — live for-sale pull + Stage-0 filter

> **Superseded by [`rightmove-commercial-pull-2026-07-17.md`](rightmove-commercial-pull-2026-07-17.md)**, which additionally keeps pubs/bars/hotels in the investable pool (decision 2026-07-17) and fixes object-form tenure rendering. This file is retained as the snapshot that established the portal-aware Stage-0 corrections.

**Date:** 2026-07-14 · **Source:** rightmove.co.uk commercial-property-for-sale (search pages, `__NEXT_DATA__` plain JSON) · **Mode:** read-only live pull

Searched **7 cities** (Citywide footprint: Yorkshire + Greater Manchester). Portal reports **879** matching results across those searches; fetched a capped **554** (max 5 pages/city, 1.5 s between requests), **554** after cross-city dedupe. **129** business-for-sale going concerns excluded by subtype, leaving **425** investable listings. Stage-0 (minimum bar **2**, geography excluded from scoring — see below) passed **123**.

## Corrections applied in this run (vs the first 2026-07-14 pull)

The first pull passed **335 of 554 (60%)** — inflated, because the searches were already geo-scoped, so every listing collected the geography point for free and the effective bar collapsed to a single keyword hit (all 219 failures scored exactly 1, geography-only). Two fixes applied for this run:

1. **Portal-aware Stage-0 (`geoPrescoped`)** — geography earns no point on a geo-scoped pull; it acts as a precondition instead (a listing outside a requirement's territory cannot match that requirement at all). The 2-point bar now applies to price/size/keywords only.
2. **Going-concern subtype filter** — business-for-sale listings (cafés, restaurants, salons, licensed trade, convenience stores, hotels/guest houses, ...) are excluded before scoring. Premises and development stock (offices, industrial, retail property, mixed use, commercial/residential development, land) are kept.

Excluded by subtype:

| Subtype | Excluded |
|---|---|
| Restaurant | 35 |
| Pub | 29 |
| Cafe | 29 |
| Takeaway | 19 |
| Convenience Store | 7 |
| Hotel | 6 |
| Hairdresser / Barber Shop | 2 |
| Bar / Nightclub | 1 |
| Post Office | 1 |

| City | Region | Portal results | Fetched (deduped) |
|---|---|---|---|
| Leeds | Yorkshire | 222 | 119 |
| Sheffield | Yorkshire | 167 | 114 |
| Bradford | Yorkshire | 75 | 56 |
| Huddersfield | Yorkshire | 58 | 45 |
| Doncaster | Yorkshire | 49 | 47 |
| Manchester | Greater Manchester | 234 | 118 |
| Bolton | Greater Manchester | 74 | 55 |

> robots.txt (checked at pull time) does **not** disallow the commercial `find.html` search path (only contact/map/photo/full-description paths). Portal ToS may still restrict automated collection — in the CAIS pipeline Rightmove remains a route-to-review portal source (spec §4/§5); this was an explicit low-volume read-only pull.

## Agent coverage

**156 distinct agents/branches** appear in the 554 fetched listings (counted before the subtype filter — coverage is a property of the portal, not of our filtering) — vs one agent per bespoke source. 63 distinct agents appear in the Stage-0-passed set.

Top agents by listing count:

| Agent / branch | Listings |
|---|---|
| Ernest Wilson & Co Limited, EW Leeds | 106 |
| BTG Eddisons Property Auctions, Commercial Nationwide | 23 |
| Crosthwaite Commercial Limited, Sheffield | 18 |
| Harvey Silver Hodgkinson, Hale | 14 |
| Alan J Picken, Ilkley | 12 |
| Eddisons Commercial Limited, Sheffield | 12 |
| Carter Towler, Leeds | 10 |
| Christie & Co, Pubs & Restaurants | 10 |
| PPH Commercial Limited, Doncaster | 10 |
| Knight Frank, Sheffield | 9 |
| JBrown International, London | 9 |
| Sanderson Weatherall, Leeds | 8 |
| Eddisons Commercial Limited, Bradford | 8 |
| Commercial Property Partners Ltd, Sheffield | 8 |
| BRAMLEYS LLP, Huddersfield | 8 |

## Passed the filter

### 43 Park Place, Leeds, LS1 2RY — £1,800,000

- **Address:** 43 Park Place, Leeds, LS1 2RY (Leeds, Yorkshire)
- **Price:** £1,800,000 _(£1,800,000)_
- **Size:** 8,997 sq. ft. (8,997 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Knight Frank, Leeds - Commercial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1800000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/154042034#/?channel=COM_BUY

### 26-27 Park Square West, Leeds, LS1 2PL — £1,500,000 Offers in Excess of

- **Address:** 26-27 Park Square West, Leeds, LS1 2PL (Leeds, Yorkshire)
- **Price:** £1,500,000 Offers in Excess of _(£1,500,000)_
- **Size:** 5,856 sq. ft. (5,856 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/698589182145520#/?channel=COM_BUY

### Building/Home Improvement, West Yorkshire, West Yorkshire — £1,400,000

- **Address:** Building/Home Improvement, West Yorkshire, West Yorkshire (Leeds, Yorkshire)
- **Price:** £1,400,000 _(£1,400,000)_
- **Size:** n/a
- **Type:** Residential Development · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1400000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/170335808#/?channel=COM_BUY

### 13-14 Park Place, Leeds, LS1 2SJ — £1,013,000 Offers in Excess of

- **Address:** 13-14 Park Place, Leeds, LS1 2SJ (Leeds, Yorkshire)
- **Price:** £1,013,000 Offers in Excess of _(£1,013,000)_
- **Size:** 5,858 sq. ft. (5,858 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Northcap, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1013000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90125763#/?channel=COM_BUY

### Oxford Chambers, Oxford Place, Leeds, LS1 3AX — £850,000

- **Address:** Oxford Chambers, Oxford Place, Leeds, LS1 3AX (Leeds, Yorkshire)
- **Price:** £850,000 _(£850,000)_
- **Size:** n/a
- **Type:** Land · [object Object]
- **Agent:** Knight Frank, Leeds - Commercial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 850000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/169402238#/?channel=COM_BUY

### 2 Moorland Road, Hyde Park, Leeds, LS6 1AL — £650,000 Offers in Region of

- **Address:** 2 Moorland Road, Hyde Park, Leeds, LS6 1AL (Leeds, Yorkshire)
- **Price:** £650,000 Offers in Region of _(£650,000)_
- **Size:** 3,779 sq. ft. (3,779 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 650000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/722868246358240#/?channel=COM_BUY

### Wetherby, High Street, LS22 — £595,000

- **Address:** Wetherby, High Street, LS22 (Leeds, Yorkshire)
- **Price:** £595,000 _(£595,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Renton & Parr, Wetherby
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 595000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90641748#/?channel=COM_BUY

### Aspect Court, Pond Street, Sheffield, S1 2BG — £6,000,000

- **Address:** Aspect Court, Pond Street, Sheffield, S1 2BG (Sheffield, Yorkshire)
- **Price:** £6,000,000 _(£6,000,000)_
- **Size:** 57,842 sq. ft. (57,842 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 57842 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/760571878944801#/?channel=COM_BUY

### WILSON CARLILE CENTRE, 50 CAVENDISH STREET, SHEFFIELD, YORKSHIRE, S3 — £3,000,000 Guide Price

- **Address:** WILSON CARLILE CENTRE, 50 CAVENDISH STREET, SHEFFIELD, YORKSHIRE, S3 (Sheffield, Yorkshire)
- **Price:** £3,000,000 Guide Price _(£3,000,000)_
- **Size:** 22,881 sq. ft. (22,881 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Bruton Knowles, Gloucester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 22881 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/760730285095312#/?channel=COM_BUY

### Unit 1 Metis Building, 2 Solly Street, Sheffield, S1 — £495,000

- **Address:** Unit 1 Metis Building, 2 Solly Street, Sheffield, S1 (Sheffield, Yorkshire)
- **Price:** £495,000 _(£495,000)_
- **Size:** 3,850 sq. ft. (3,850 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Leaworks Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 3850 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/756215561406961#/?channel=COM_BUY

### Endeavour, Sheffield Digital Campus, Sheffield, South Yorkshire, S1 — £25,460,000

- **Address:** Endeavour, Sheffield Digital Campus, Sheffield, South Yorkshire, S1 (Sheffield, Yorkshire)
- **Price:** £25,460,000 _(£25,460,000)_
- **Size:** 65,511 sq. ft. (65,511 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Lambert Smith Hampton, Living & Capital Markets
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 65511 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760930151971185#/?channel=COM_BUY

### Parkway Plaza, Prince Of Wales Road , Sheffield, S9 4EU — £6,750,000 From

- **Address:** Parkway Plaza, Prince Of Wales Road , Sheffield, S9 4EU (Sheffield, Yorkshire)
- **Price:** £6,750,000 From _(£6,750,000)_
- **Size:** 40,000–85,000 sq. ft. (85,000 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 85000 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759291330487233#/?channel=COM_BUY

### Pheasant Works, Surbiton Street, Sheffield, South Yorkshire, S9 5AQ — £2,800,000

- **Address:** Pheasant Works, Surbiton Street, Sheffield, South Yorkshire, S9 5AQ (Sheffield, Yorkshire)
- **Price:** £2,800,000 _(£2,800,000)_
- **Size:** 35,523 sq. ft. (35,523 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 35523 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/762397808152992#/?channel=COM_BUY

### Group of Dental Investments, UK Wide — £2,000,000 Guide Price

- **Address:** Group of Dental Investments, UK Wide (Sheffield, Yorkshire)
- **Price:** £2,000,000 Guide Price _(£2,000,000)_
- **Size:** n/a
- **Type:** Healthcare Facility · [object Object]
- **Agent:** Christie & Co, Dental
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 2000000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760779631160737#/?channel=COM_BUY

### Sheffield Cold Stores, Roman Ridge Road, Sheffield, S9 — £1,950,000

- **Address:** Sheffield Cold Stores, Roman Ridge Road, Sheffield, S9 (Sheffield, Yorkshire)
- **Price:** £1,950,000 _(£1,950,000)_
- **Size:** 44,910 sq. ft. (44,910 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 44910 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/754599909254481#/?channel=COM_BUY

### 197 Holme Lane, Sheffield, S6 — £1,800,000 Offers in Region of

- **Address:** 197 Holme Lane, Sheffield, S6 (Sheffield, Yorkshire)
- **Price:** £1,800,000 Offers in Region of _(£1,800,000)_
- **Size:** 28,497 sq. ft. (28,497 sq ft)
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1800000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/165618794#/?channel=COM_BUY

### Poplar Way, Rotherham — £1,500,000 Offers in Region of

- **Address:** Poplar Way, Rotherham (Sheffield, Yorkshire)
- **Price:** £1,500,000 Offers in Region of _(£1,500,000)_
- **Size:** 97,574 sq. ft. (97,574 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** BARKER PROUDLOVE LIMITED, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 97574 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760015858866432#/?channel=COM_BUY

### 386 Coleridge Road, Sheffield, S9 — POA

- **Address:** 386 Coleridge Road, Sheffield, S9 (Sheffield, Yorkshire)
- **Price:** POA _(£1,250,000)_
- **Size:** 12,656 sq. ft. (12,656 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1250000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/754599957448257#/?channel=COM_BUY

### Gilbertson Works, Jessell Street, Sheffield, South Yorkshire, S9 3HY — £1,000,000

- **Address:** Gilbertson Works, Jessell Street, Sheffield, South Yorkshire, S9 3HY (Sheffield, Yorkshire)
- **Price:** £1,000,000 _(£1,000,000)_
- **Size:** 13,625 sq. ft. (13,625 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 13625 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759300316797680#/?channel=COM_BUY

### Waverley Works, Effingham Street, Sheffield,  Waverley Works, Effingham Street, Sheffield — £1,000,000 Guide Price

- **Address:** Waverley Works, Effingham Street, Sheffield,  Waverley Works, Effingham Street, Sheffield (Sheffield, Yorkshire)
- **Price:** £1,000,000 Guide Price _(£1,000,000)_ · auction
- **Size:** 35,000 sq. ft. (35,000 sq ft)
- **Type:** Mixed Use · [object Object]
- **Agent:** Savills, Savills Auctions- Commercial
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 35000 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/746606427835057#/?channel=COM_BUY

### Brightside Lane, Sheffield, S9 — £975,000 Offers in Region of

- **Address:** Brightside Lane, Sheffield, S9 (Sheffield, Yorkshire)
- **Price:** £975,000 Offers in Region of _(£975,000)_
- **Size:** 10,387 sq. ft. (10,387 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Commercial Property Rotherham, Rotherham
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 975000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/754397739487104#/?channel=COM_BUY

### Unit 1, Holbrook Industrial Estate, Holbrook Rise, Holbrook, Sheffield, South Yorkshire, S20 3FG — £960,000

- **Address:** Unit 1, Holbrook Industrial Estate, Holbrook Rise, Holbrook, Sheffield, South Yorkshire, S20 3FG (Sheffield, Yorkshire)
- **Price:** £960,000 _(£960,000)_
- **Size:** 14,175 sq. ft. (14,175 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 14175 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760571646084384#/?channel=COM_BUY

### 607-613 Penistone Road, Sheffield, S6 2GA — £900,000

- **Address:** 607-613 Penistone Road, Sheffield, S6 2GA (Sheffield, Yorkshire)
- **Price:** £900,000 _(£900,000)_
- **Size:** 11,403 sq. ft. (11,403 sq ft)
- **Type:** Leisure Facility · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 900000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/754599953229873#/?channel=COM_BUY

### Woodside Works, Rugby Street, Sheffield, S3 9QH — £895,000

- **Address:** Woodside Works, Rugby Street, Sheffield, S3 9QH (Sheffield, Yorkshire)
- **Price:** £895,000 _(£895,000)_
- **Size:** 44,179 sq. ft. (44,179 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 895000 within budget 500000-2000000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/754599932281041#/?channel=COM_BUY

### Egerton Lane & Land at Evans Street, Sheffield S1 4JX — £695,000

- **Address:** Egerton Lane & Land at Evans Street, Sheffield S1 4JX (Sheffield, Yorkshire)
- **Price:** £695,000 _(£695,000)_
- **Size:** 5,022 sq. ft. (5,022 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** Blue Alpine, London
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 695000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/747098253913009#/?channel=COM_BUY

### Kayedee Premises, Stamford Street, Newhall Road Trading Estate, Sheffield, S9 2TX — £500,000

- **Address:** Kayedee Premises, Stamford Street, Newhall Road Trading Estate, Sheffield, S9 2TX (Sheffield, Yorkshire)
- **Price:** £500,000 _(£500,000)_
- **Size:** 21,489 sq. ft. (21,489 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 21489 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760571990026673#/?channel=COM_BUY

### Five Rivers House,  Savile Street, Sheffield S4 7UD — £475,000 Offers in Excess of

- **Address:** Five Rivers House,  Savile Street, Sheffield S4 7UD (Sheffield, Yorkshire)
- **Price:** £475,000 Offers in Excess of _(£475,000)_
- **Size:** 8,196 sq. ft. (8,196 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 8196 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/757307324194945#/?channel=COM_BUY

### 16-18 & 20 Dixon Lane, Sheffield, S1 2AL — £400,000

- **Address:** 16-18 & 20 Dixon Lane, Sheffield, S1 2AL (Sheffield, Yorkshire)
- **Price:** £400,000 _(£400,000)_
- **Size:** 5,765 sq. ft. (5,765 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 5765 >= min 2000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/754599940713777#/?channel=COM_BUY

### Unit 1, Daisy Spring Works, Dun Street, Sheffield, S3 8DW — £399,000

- **Address:** Unit 1, Daisy Spring Works, Dun Street, Sheffield, S3 8DW (Sheffield, Yorkshire)
- **Price:** £399,000 _(£399,000)_
- **Size:** 5,500 sq. ft. (5,500 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 5500 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/112995386#/?channel=COM_BUY

### Unit 8, Shepcote Office Village, Shepcote Lane, Sheffield, South Yorkshire, S9 1TG — £395,000

- **Address:** Unit 8, Shepcote Office Village, Shepcote Lane, Sheffield, South Yorkshire, S9 1TG (Sheffield, Yorkshire)
- **Price:** £395,000 _(£395,000)_
- **Size:** 3,022 sq. ft. (3,022 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 3022 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760571300137888#/?channel=COM_BUY

### Unit 2B, Junction 34 Industrial Estate, Greasbro Road, Tinsley, Sheffield, S9 1TN — £390,000

- **Address:** Unit 2B, Junction 34 Industrial Estate, Greasbro Road, Tinsley, Sheffield, S9 1TN (Sheffield, Yorkshire)
- **Price:** £390,000 _(£390,000)_
- **Size:** 4,820 sq. ft. (4,820 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 4820 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/762568495545041#/?channel=COM_BUY

### Unit 2 - Metis Building, 1 Scotland Street, Sheffield, S3 7AT — £335,000 Offers in Region of

- **Address:** Unit 2 - Metis Building, 1 Scotland Street, Sheffield, S3 7AT (Sheffield, Yorkshire)
- **Price:** £335,000 Offers in Region of _(£335,000)_
- **Size:** 2,343 sq. ft. (2,343 sq ft)
- **Type:** Office · [object Object]
- **Agent:** SMC Brownill Vickers, South Yorkshire
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 2343 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/761307952034992#/?channel=COM_BUY

### Printhouse, The Printhouse, North Church Street, Sheffield — POA

- **Address:** Printhouse, The Printhouse, North Church Street, Sheffield (Sheffield, Yorkshire)
- **Price:** POA _(£330,000)_
- **Size:** 4,390 sq. ft. (4,390 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Fowler Sandford LLP, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 4390 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/759323486182768#/?channel=COM_BUY

### Alliance House, Roman Ridge Road, Sheffield S9 1GB — £325,000

- **Address:** Alliance House, Roman Ridge Road, Sheffield S9 1GB (Sheffield, Yorkshire)
- **Price:** £325,000 _(£325,000)_
- **Size:** 5,743 sq. ft. (5,743 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 5743 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/744622056476753#/?channel=COM_BUY

### 44 Bank Street, Sheffield, South Yorkshire, S1 2DS — £300,000

- **Address:** 44 Bank Street, Sheffield, South Yorkshire, S1 2DS (Sheffield, Yorkshire)
- **Price:** £300,000 _(£300,000)_
- **Size:** 2,458 sq. ft. (2,458 sq ft)
- **Type:** Shop · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 2458 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760570951948481#/?channel=COM_BUY

### 21 Station Road, Kiveton Park, Sheffield, S26 6QP — £299,950

- **Address:** 21 Station Road, Kiveton Park, Sheffield, S26 6QP (Sheffield, Yorkshire)
- **Price:** £299,950 _(£299,950)_
- **Size:** 2,783 sq. ft. (2,783 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** SMC Brownill Vickers, South Yorkshire
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 2783 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/719250187282449#/?channel=COM_BUY

### Land at Green Lane, Ecclesfield, Sheffield S35 9WY — £275,000

- **Address:** Land at Green Lane, Ecclesfield, Sheffield S35 9WY (Sheffield, Yorkshire)
- **Price:** £275,000 _(£275,000)_
- **Size:** 20,042 sq. ft. (20,042 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 20042 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/743551758137296#/?channel=COM_BUY

### 24 Meadowhall Road, Sheffield, South Yorkshire, S9 1BS — POA

- **Address:** 24 Meadowhall Road, Sheffield, South Yorkshire, S9 1BS (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 6,286 sq. ft. (6,286 sq ft)
- **Type:** Showroom · [object Object]
- **Agent:** Flint Real Estate, Doncaster
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 6286 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760551129667441#/?channel=COM_BUY

### Athol House, Heart of The City II, Pinstone Street, Sheffield, S1 2HZ — POA

- **Address:** Athol House, Heart of The City II, Pinstone Street, Sheffield, S1 2HZ (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 968–2,973 sq. ft. (2,973 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Savills, Leeds Offices
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 2973 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/758217253130032#/?channel=COM_BUY

### 50, Broadfield Road, Sheffield, S8 0XJ — POA

- **Address:** 50, Broadfield Road, Sheffield, S8 0XJ (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 3,546 sq. ft. (3,546 sq ft)
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 3546 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/174802055#/?channel=COM_BUY

### 50, Broadfield Road, Sheffield, S8 0XJ — POA

- **Address:** 50, Broadfield Road, Sheffield, S8 0XJ (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 3,546 sq. ft. (3,546 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 3546 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/174801437#/?channel=COM_BUY

### Pennine House, 35a Business Park, Churchill Way, Ecclesfield, Sheffield, S35 — POA

- **Address:** Pennine House, 35a Business Park, Churchill Way, Ecclesfield, Sheffield, S35 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 9,360 sq. ft. (9,360 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 9360 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/157397378#/?channel=COM_BUY

### VGP Park Sheffield , Europa Link, Sheffield, South Yorkshire, S9 1TG — POA

- **Address:** VGP Park Sheffield , Europa Link, Sheffield, South Yorkshire, S9 1TG (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 265,500 sq. ft. (265,500 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 265500 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759292490166064#/?channel=COM_BUY

### 160 Solly Street, Sheffield, S1 4BF — POA

- **Address:** 160 Solly Street, Sheffield, S1 4BF (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 11,421 sq. ft. (11,421 sq ft)
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 11421 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/164601068#/?channel=COM_BUY

### Milton Street, Sheffield, S3 7UF — POA

- **Address:** Milton Street, Sheffield, S3 7UF (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 275,000–350,000 sq. ft. (350,000 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 350000 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759292704103920#/?channel=COM_BUY

### Highfield at Waverley, Highfield Spring, Waverley, Rotherham, S60 — POA

- **Address:** Highfield at Waverley, Highfield Spring, Waverley, Rotherham, S60 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 10,000–80,000 sq. ft. (80,000 sq ft)
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 80000 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/168968804#/?channel=COM_BUY

### South West Centre, Troutbeck Road, Sheffield, S8 0JR — POA

- **Address:** South West Centre, Troutbeck Road, Sheffield, S8 0JR (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 42,195 sq. ft. (42,195 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Avison Young (UK) Limited, Land & Development
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 42195 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/88345509#/?channel=COM_BUY

### No.1 Midpoint Business Park, 1 Mid Point, Thornbury, Bradford, BD3 7AY — £4,000,000 Offers in Excess of

- **Address:** No.1 Midpoint Business Park, 1 Mid Point, Thornbury, Bradford, BD3 7AY (Bradford, Yorkshire)
- **Price:** £4,000,000 Offers in Excess of _(£4,000,000)_
- **Size:** 39,178 sq. ft. (39,178 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Northcap, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 39178 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/89501259#/?channel=COM_BUY

### Futures Way, Off Bolling Road, Bradford, West Yorkshire, BD4 7EB — £4,500,000 Offers in Region of

- **Address:** Futures Way, Off Bolling Road, Bradford, West Yorkshire, BD4 7EB (Bradford, Yorkshire)
- **Price:** £4,500,000 Offers in Region of _(£4,500,000)_
- **Size:** 72,564 sq. ft. (72,564 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 72564 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760556347259392#/?channel=COM_BUY

### West Riding House, 31 Cheapside, Bradford, West Riding House, 31 Cheapside, Bradford — £2,650,000 Guide Price

- **Address:** West Riding House, 31 Cheapside, Bradford, West Riding House, 31 Cheapside, Bradford (Bradford, Yorkshire)
- **Price:** £2,650,000 Guide Price _(£2,650,000)_
- **Size:** 29,351 sq. ft. (29,351 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Savills, City Offices
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 29351 >= min 2000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/750945672314128#/?channel=COM_BUY

### Units D & E, Bradford Business Park, Canal Road, Bradford, BD1 4SJ — £1,750,000 Offers in Region of

- **Address:** Units D & E, Bradford Business Park, Canal Road, Bradford, BD1 4SJ (Bradford, Yorkshire)
- **Price:** £1,750,000 Offers in Region of _(£1,750,000)_
- **Size:** 16,266 sq. ft. (16,266 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 16266 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760557054121681#/?channel=COM_BUY

### Pasture Lane, Clayton, Bradford, BD14 6LU — POA

- **Address:** Pasture Lane, Clayton, Bradford, BD14 6LU (Bradford, Yorkshire)
- **Price:** POA _(£995,000)_
- **Size:** 11,814 sq. ft. (11,814 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Citywide Investors territory (prescoped — not scored); price 995000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/722868265035712#/?channel=COM_BUY

### Onward House, 2 Baptist Place, Bradford, West Yorkshire — £595,000 Offers in Region of

- **Address:** Onward House, 2 Baptist Place, Bradford, West Yorkshire (Bradford, Yorkshire)
- **Price:** £595,000 Offers in Region of _(£595,000)_
- **Size:** 11,194 sq. ft. (11,194 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 11194 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760934224753408#/?channel=COM_BUY

### Little Lane Church, Little Lane, Bradford — £395,000 Offers in Region of

- **Address:** Little Lane Church, Little Lane, Bradford (Bradford, Yorkshire)
- **Price:** £395,000 Offers in Region of _(£395,000)_
- **Size:** 9,015 sq. ft. (9,015 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 9015 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/760934262388241#/?channel=COM_BUY

### 343 Wakefield Road, Bradford, BD4 7NB — £375,000 Offers in Region of

- **Address:** 343 Wakefield Road, Bradford, BD4 7NB (Bradford, Yorkshire)
- **Price:** £375,000 Offers in Region of _(£375,000)_
- **Size:** 3,297 sq. ft. (3,297 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 3297 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760557448387104#/?channel=COM_BUY

### Oxford Place, Bradford — £325,000

- **Address:** Oxford Place, Bradford (Bradford, Yorkshire)
- **Price:** £325,000 _(£325,000)_
- **Size:** 5,761 sq. ft. (5,761 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 5761 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760934153446096#/?channel=COM_BUY

### Queensbury Baptist Church, Chapel Lane, Queensbury, Bradford, Yorkshire, BD13 2PZ — POA

- **Address:** Queensbury Baptist Church, Chapel Lane, Queensbury, Bradford, Yorkshire, BD13 2PZ (Bradford, Yorkshire)
- **Price:** POA _(£250,000)_
- **Size:** 3,083 sq. ft. (3,083 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Lambert Smith Hampton, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 3083 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/760771181578336#/?channel=COM_BUY

### Wharfedale Road, Bradford — POA

- **Address:** Wharfedale Road, Bradford (Bradford, Yorkshire)
- **Price:** POA _(£10)_
- **Size:** 28,079 sq. ft. (28,079 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** CBRE, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 28079 >= min 2000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/746607883263889#/?channel=COM_BUY

### 221 Sunbridge Road, Bradford, BD1 2LG — POA

- **Address:** 221 Sunbridge Road, Bradford, BD1 2LG (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 16,165 sq. ft. (16,165 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 16165 >= min 2000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/760557421122001#/?channel=COM_BUY

### Hillam Road, Off Canal Road, Bradford, BD2 1QL — POA

- **Address:** Hillam Road, Off Canal Road, Bradford, BD2 1QL (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 20,405 sq. ft. (20,405 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 20405 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760557131759280#/?channel=COM_BUY

### The Paper Hall, Anne Gate, Bradford, BD1 4EQ — POA

- **Address:** The Paper Hall, Anne Gate, Bradford, BD1 4EQ (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 4,916 sq. ft. (4,916 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 4916 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760558194972352#/?channel=COM_BUY

### Beech Street, Huddersfield, West Yorkshire, HD1 — £450,000

- **Address:** Beech Street, Huddersfield, West Yorkshire, HD1 (Huddersfield, Yorkshire)
- **Price:** £450,000 _(£450,000)_
- **Size:** 14,128 sq. ft. (14,128 sq ft)
- **Type:** Leisure Facility · [object Object]
- **Agent:** Portfolio Lets Limited, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 14128 >= min 2000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/752945269010833#/?channel=COM_BUY

### Final Plot - Trinity West, Trinity Street, Huddersfield, HD1 4DL — POA

- **Address:** Final Plot - Trinity West, Trinity Street, Huddersfield, HD1 4DL (Huddersfield, Yorkshire)
- **Price:** POA _(£2,550,000)_
- **Size:** 67,082 sq. ft. (67,082 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Fox Lloyd Jones, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 67082 >= min 2000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/721600211753729#/?channel=COM_BUY

### Investment Property, Almondbury, West Yorkshire — £525,000

- **Address:** Investment Property, Almondbury, West Yorkshire (Huddersfield, Yorkshire)
- **Price:** £525,000 _(£525,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 525000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/142703828#/?channel=COM_BUY

### 1 Lord Street, Huddersfield, West Yorkshire, HD1 1QA — £500,000

- **Address:** 1 Lord Street, Huddersfield, West Yorkshire, HD1 1QA (Huddersfield, Yorkshire)
- **Price:** £500,000 _(£500,000)_
- **Size:** 5,422 sq. ft. (5,422 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 5422 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/742090498310208#/?channel=COM_BUY

### Former Bowling Club, King Cliffe Road, West Yorkshire, HD2 2RR — £295,000

- **Address:** Former Bowling Club, King Cliffe Road, West Yorkshire, HD2 2RR (Huddersfield, Yorkshire)
- **Price:** £295,000 _(£295,000)_
- **Size:** 3,448 sq. ft. (3,448 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 3448 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742077927848224#/?channel=COM_BUY

### Development Site to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE — £200,000 Offers in Excess of

- **Address:** Development Site to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE (Huddersfield, Yorkshire)
- **Price:** £200,000 Offers in Excess of _(£200,000)_
- **Size:** 11,761 sq. ft. (11,761 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 11761 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742063384158624#/?channel=COM_BUY

### Land to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE — £200,000 Offers in Excess of

- **Address:** Land to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE (Huddersfield, Yorkshire)
- **Price:** £200,000 Offers in Excess of _(£200,000)_
- **Size:** 11,761 sq. ft. (11,761 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 11761 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742063304407872#/?channel=COM_BUY

### Land Adjacent To 84, Longwood Gate, Longwood, Huddersfield, West Yorkshire, HD3 4US — £160,000

- **Address:** Land Adjacent To 84, Longwood Gate, Longwood, Huddersfield, West Yorkshire, HD3 4US (Huddersfield, Yorkshire)
- **Price:** £160,000 _(£160,000)_
- **Size:** 161,172 sq. ft. (161,172 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 161172 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742063671410129#/?channel=COM_BUY

### Land to Rear of 72 & 74 New North Road, Huddersfield — £200,000 Offers Over

- **Address:** Land to Rear of 72 & 74 New North Road, Huddersfield (Huddersfield, Yorkshire)
- **Price:** £200,000 Offers Over _(£200,000)_
- **Size:** 11,761 sq. ft. (11,761 sq ft)
- **Type:** Land · [object Object]
- **Agent:** Bramleys, Huddersfield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 11761 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/173745665#/?channel=COM_BUY

### Land adjacent to 84 Longwood Gate, Longwood, Huddersfield — £160,000

- **Address:** Land adjacent to 84 Longwood Gate, Longwood, Huddersfield (Huddersfield, Yorkshire)
- **Price:** £160,000 _(£160,000)_
- **Size:** 161,172 sq. ft. (161,172 sq ft)
- **Type:** Land · [object Object]
- **Agent:** Bramleys, Huddersfield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 161172 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/173625812#/?channel=COM_BUY

### Pillar House, 19-21 South Parade, Doncaster, South Yorkshire, DN1 2DJ — £695,000 Offers in Region of

- **Address:** Pillar House, 19-21 South Parade, Doncaster, South Yorkshire, DN1 2DJ (Doncaster, Yorkshire)
- **Price:** £695,000 Offers in Region of _(£695,000)_
- **Size:** 12,389 sq. ft. (12,389 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Flint Real Estate, Doncaster
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Citywide Investors territory (prescoped — not scored); price 695000 within budget 500000-2000000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/760550506814305#/?channel=COM_BUY

### 11-19 Printing Office Street, Doncaster, South Yorkshire, DN1 1TJ — £725,000 Offers in Region of

- **Address:** 11-19 Printing Office Street, Doncaster, South Yorkshire, DN1 1TJ (Doncaster, Yorkshire)
- **Price:** £725,000 Offers in Region of _(£725,000)_
- **Size:** 5,241 sq. ft. (5,241 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** PPH Commercial Limited, Doncaster
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Citywide Investors territory (prescoped — not scored); price 725000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759461342496401#/?channel=COM_BUY

### Hall Gate, Doncaster, DN1 — £1,500,000

- **Address:** Hall Gate, Doncaster, DN1 (Doncaster, Yorkshire)
- **Price:** £1,500,000 _(£1,500,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Nested, Nationwide
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90530232#/?channel=COM_BUY

### Ground Floor (East Wing) Victoria Mill, 10 Lower Vickers Street, Manchester, Manchester, M40 7LH — £1,000,000 Offers in Region of

- **Address:** Ground Floor (East Wing) Victoria Mill, 10 Lower Vickers Street, Manchester, Manchester, M40 7LH (Manchester, Greater Manchester)
- **Price:** £1,000,000 Offers in Region of _(£1,000,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Landwood Group, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1000000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/167035448#/?channel=COM_BUY

### Bury Street, Manchester, Greater Manchester, M3 — £1,550,000 Offers in Excess of

- **Address:** Bury Street, Manchester, Greater Manchester, M3 (Manchester, Greater Manchester)
- **Price:** £1,550,000 Offers in Excess of _(£1,550,000)_
- **Size:** 5,814 sq. ft. (5,814 sq ft)
- **Type:** Office · [object Object]
- **Agent:** OBI PROPERTY LIMITED, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 5814 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/754591526994001#/?channel=COM_BUY

### Briscoe Lane, Manchester, M40 — £7,000,000 Offers in Excess of

- **Address:** Briscoe Lane, Manchester, M40 (Manchester, Greater Manchester)
- **Price:** £7,000,000 Offers in Excess of _(£7,000,000)_
- **Size:** 186,872 sq. ft. (186,872 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Citrus Commercial Circle, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 186872 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/749898455249585#/?channel=COM_BUY

### Wakefield House, 7-13 New Wakefield Street, Manchester, Greater Manchester, M1 5NP — £6,250,000

- **Address:** Wakefield House, 7-13 New Wakefield Street, Manchester, Greater Manchester, M1 5NP (Manchester, Greater Manchester)
- **Price:** £6,250,000 _(£6,250,000)_
- **Size:** 31,330 sq. ft. (31,330 sq ft)
- **Type:** Mixed Use · [object Object]
- **Agent:** W T Gunson, Manchester - BPG
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 31330 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759472245651296#/?channel=COM_BUY

### The Waterside, Springfield Lane, Manchester, M3 7JQ — £6,000,000 Offers in Excess of

- **Address:** The Waterside, Springfield Lane, Manchester, M3 7JQ (Manchester, Greater Manchester)
- **Price:** £6,000,000 Offers in Excess of _(£6,000,000)_
- **Size:** 65,340 sq. ft. (65,340 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** Di Properties Ltd, London
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 65340 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/161828498#/?channel=COM_BUY

### Kiwi Park - Unit 6, Commerce Way, Trafford Park, Manchester, Greater Manchester, M17 — POA

- **Address:** Kiwi Park - Unit 6, Commerce Way, Trafford Park, Manchester, Greater Manchester, M17 (Manchester, Greater Manchester)
- **Price:** POA _(£3,500,000)_
- **Size:** 17,197 sq. ft. (17,197 sq ft)
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** DAVIES HARRISON LIMITED, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 17197 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/754386811315905#/?channel=COM_BUY

### Albion Wharf, 19 Albion Street, Manchester, Greater Manchester — £2,100,000 Offers in Region of

- **Address:** Albion Wharf, 19 Albion Street, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** £2,100,000 Offers in Region of _(£2,100,000)_
- **Size:** 10,430 sq. ft. (10,430 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Roger Hannah Ltd, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 10430 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760768065211217#/?channel=COM_BUY

### 17-25 St. Ann Street, Manchester, Greater Manchester, M2 — £2,000,000 Offers Over

- **Address:** 17-25 St. Ann Street, Manchester, Greater Manchester, M2 (Manchester, Greater Manchester)
- **Price:** £2,000,000 Offers Over _(£2,000,000)_
- **Size:** 10,033 sq. ft. (10,033 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** BARKER PROUDLOVE LIMITED, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 2000000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/754397760540369#/?channel=COM_BUY

### 4 Naval Street, Ancoats, Manchester, M4 6EW — £1,950,000

- **Address:** 4 Naval Street, Ancoats, Manchester, M4 6EW (Manchester, Greater Manchester)
- **Price:** £1,950,000 _(£1,950,000)_
- **Size:** 4,674 sq. ft. (4,674 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Gifford Dixon Commercial Property, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 4674 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/174801380#/?channel=COM_BUY

### Former Chapel St & Hope United Reformed Church, 146 Chapel Street, Salford, M3 6AF — £1,500,000 Offers in Excess of

- **Address:** Former Chapel St & Hope United Reformed Church, 146 Chapel Street, Salford, M3 6AF (Manchester, Greater Manchester)
- **Price:** £1,500,000 Offers in Excess of _(£1,500,000)_
- **Size:** 9,766 sq. ft. (9,766 sq ft)
- **Type:** Place of Worship · [object Object]
- **Agent:** W T Gunson, Manchester - BPG
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1500000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759473348749040#/?channel=COM_BUY

### Grant House, Units 8 & 9 Washington Centre, Broadway, Salford, M50 2UW — POA

- **Address:** Grant House, Units 8 & 9 Washington Centre, Broadway, Salford, M50 2UW (Manchester, Greater Manchester)
- **Price:** POA _(£1,400,000)_
- **Size:** 15,685 sq. ft. (15,685 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Sixteen Real Estate, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 15685 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/88701666#/?channel=COM_BUY

### Stretford Road, Hulme, Manchester, M15 — £1,300,000

- **Address:** Stretford Road, Hulme, Manchester, M15 (Manchester, Greater Manchester)
- **Price:** £1,300,000 _(£1,300,000)_
- **Size:** n/a
- **Type:** Residential Development · [object Object]
- **Agent:** Citrus Commercial Circle, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1300000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/751658404128465#/?channel=COM_BUY

### Unit 2, Fourways Trading Estate, Manchester, M17 1SW — £1,100,000 Offers in Region of

- **Address:** Unit 2, Fourways Trading Estate, Manchester, M17 1SW (Manchester, Greater Manchester)
- **Price:** £1,100,000 Offers in Region of _(£1,100,000)_
- **Size:** 6,352 sq. ft. (6,352 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Williams Sillitoe, Cheshire
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 6352 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/173477042#/?channel=COM_BUY

### Land At New Viaduct Street And 266 Bradford Road, Manchester, Greater Manchester — £1,045,000

- **Address:** Land At New Viaduct Street And 266 Bradford Road, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** £1,045,000 _(£1,045,000)_
- **Size:** 47,916 sq. ft. (47,916 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Roger Hannah Ltd, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1045000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760768027462464#/?channel=COM_BUY

### 22 Oxford Court, Manchester, M2 3WQ — £995,150

- **Address:** 22 Oxford Court, Manchester, M2 3WQ (Manchester, Greater Manchester)
- **Price:** £995,150 _(£995,150)_
- **Size:** 3,062 sq. ft. (3,062 sq ft)
- **Type:** Office · [object Object]
- **Agent:** JLL, Manchester - Offices
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 3062 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/158787608#/?channel=COM_BUY

### 500 Styal Road, Manchester, M22 5HQ — £995,000 Offers in Region of

- **Address:** 500 Styal Road, Manchester, M22 5HQ (Manchester, Greater Manchester)
- **Price:** £995,000 Offers in Region of _(£995,000)_
- **Size:** 6,379 sq. ft. (6,379 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Canning O'Neill, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 6379 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/89204469#/?channel=COM_BUY

### Parkway Four Estate, Longbridge Road, Trafford Park, Trafford — POA

- **Address:** Parkway Four Estate, Longbridge Road, Trafford Park, Trafford (Manchester, Greater Manchester)
- **Price:** POA _(£995,000)_
- **Size:** 6,208 sq. ft. (6,208 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** DAVIES HARRISON LIMITED, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 6208 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760738990430945#/?channel=COM_BUY

### Units 1-4, Hadfield House, Gordon Street, Stockport, SK4 1RR — £975,000

- **Address:** Units 1-4, Hadfield House, Gordon Street, Stockport, SK4 1RR (Manchester, Greater Manchester)
- **Price:** £975,000 _(£975,000)_
- **Size:** 21,507 sq. ft. (21,507 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Fairhurst Buckley, Stockport
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 21507 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759312467830369#/?channel=COM_BUY

### Longley Lane, Manchester, Greater Manchester, M22 — Offers Invited

- **Address:** Longley Lane, Manchester, Greater Manchester, M22 (Manchester, Greater Manchester)
- **Price:** Offers Invited _(£949,000)_
- **Size:** 1–11,080 sq. ft. (11,080 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Houldsworth Business and Arts Centre NW Ltd, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 11080 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/169531910#/?channel=COM_BUY

### Lyons Road, Trafford Park, Manchester, Greater Manchester — £895,000

- **Address:** Lyons Road, Trafford Park, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** £895,000 _(£895,000)_
- **Size:** 9,107 sq. ft. (9,107 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Roger Hannah Ltd, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 9107 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760767924826705#/?channel=COM_BUY

### The Rat and Pigeon, 33 Back Piccadilly, Manchester, M1 1HP — £885,000 Offers in Excess of

- **Address:** The Rat and Pigeon, 33 Back Piccadilly, Manchester, M1 1HP (Manchester, Greater Manchester)
- **Price:** £885,000 Offers in Excess of _(£885,000)_
- **Size:** 1,133 sq. ft. (1,133 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Savills, Margaret Street - Licensed Leisure
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 885000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/744108203782992#/?channel=COM_BUY

### Ayres Road, Stretford, Trafford — £850,000 Offers in Excess of

- **Address:** Ayres Road, Stretford, Trafford (Manchester, Greater Manchester)
- **Price:** £850,000 Offers in Excess of _(£850,000)_
- **Size:** 1,992–7,798 sq. ft. (7,798 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Thomas Willmax Ltd, Sale
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 850000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/738114440579633#/?channel=COM_BUY

### 3 The Stables, Wilmslow Road, East Didsbury, M20 5PG — £850,000 Guide Price

- **Address:** 3 The Stables, Wilmslow Road, East Didsbury, M20 5PG (Manchester, Greater Manchester)
- **Price:** £850,000 Guide Price _(£850,000)_
- **Size:** 2,747 sq. ft. (2,747 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Canning O'Neill, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2747 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/136774796#/?channel=COM_BUY

### 51-53 Richmond Street, Manchester, Lancashire, M1 3WB — £675,000 Offers in Region of

- **Address:** 51-53 Richmond Street, Manchester, Lancashire, M1 3WB (Manchester, Greater Manchester)
- **Price:** £675,000 Offers in Region of _(£675,000)_
- **Size:** n/a
- **Type:** Residential Development · [object Object]
- **Agent:** Landwood Group, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 675000 within budget 500000-2000000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/162129293#/?channel=COM_BUY

### Broughton Street, Manchester, Greater Manchester, M8 — £675,000 Offers in Excess of

- **Address:** Broughton Street, Manchester, Greater Manchester, M8 (Manchester, Greater Manchester)
- **Price:** £675,000 Offers in Excess of _(£675,000)_
- **Size:** 8,500 sq. ft. (8,500 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** NQ Commercial Limited, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 675000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/756213044978816#/?channel=COM_BUY

### Unit 1 and 2, Moho, Arundel Street, Manchester, M15 4JY — £650,000

- **Address:** Unit 1 and 2, Moho, Arundel Street, Manchester, M15 4JY (Manchester, Greater Manchester)
- **Price:** £650,000 _(£650,000)_
- **Size:** 4,047 sq. ft. (4,047 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Shape and Sate, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 4047 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/90799932#/?channel=COM_BUY

### 3 Jordan Street, Manchester M15 — £625,000 Offers in Region of

- **Address:** 3 Jordan Street, Manchester M15 (Manchester, Greater Manchester)
- **Price:** £625,000 Offers in Region of _(£625,000)_
- **Size:** 2,242 sq. ft. (2,242 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Knight Frank, Manchester - Commercial
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2242 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/90414237#/?channel=COM_BUY

### Ashton New Road, Manchester, Greater Manchester, M11 — £625,000

- **Address:** Ashton New Road, Manchester, Greater Manchester, M11 (Manchester, Greater Manchester)
- **Price:** £625,000 _(£625,000)_
- **Size:** 5,960 sq. ft. (5,960 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Thomas Willmax Ltd, Sale
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 625000 within budget 500000-2000000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/754785658201873#/?channel=COM_BUY

### Manchester Road, Manchester — £600,000 Offers in Region of

- **Address:** Manchester Road, Manchester (Manchester, Greater Manchester)
- **Price:** £600,000 Offers in Region of _(£600,000)_
- **Size:** 1,431–1,432 sq. ft. (1,432 sq ft)
- **Type:** Shop · [object Object]
- **Agent:** TFC, Deansgate
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 600000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/755487604418224#/?channel=COM_BUY

### Unit 2, Digital Park, Pacific Way, Salford Quays, M50 1DR — £595,000 Offers in Region of

- **Address:** Unit 2, Digital Park, Pacific Way, Salford Quays, M50 1DR (Manchester, Greater Manchester)
- **Price:** £595,000 Offers in Region of _(£595,000)_
- **Size:** 3,245 sq. ft. (3,245 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Canning O'Neill, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 3245 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/90129879#/?channel=COM_BUY

### Swinton Hall Road, Swinton, Manchester, Greater Manchester, M27 4UB — £560,000 Guide Price

- **Address:** Swinton Hall Road, Swinton, Manchester, Greater Manchester, M27 4UB (Manchester, Greater Manchester)
- **Price:** £560,000 Guide Price _(£560,000)_ · auction
- **Size:** n/a
- **Type:** Commercial Development · [object Object]
- **Agent:** Pattinsons, Pattinsons Auction- National Auctioneer
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 560000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/88587447#/?channel=COM_BUY

### Riverside Unit at Bridgewater Wharf, 257 Ordsall Lane, Salford, M5 3NG — £500,000 Offers in Excess of

- **Address:** Riverside Unit at Bridgewater Wharf, 257 Ordsall Lane, Salford, M5 3NG (Manchester, Greater Manchester)
- **Price:** £500,000 Offers in Excess of _(£500,000)_
- **Size:** 2,336 sq. ft. (2,336 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Gifford Dixon Commercial Property, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2336 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/160038089#/?channel=COM_BUY

### 12 Arundel Street, Manchester, M15 4JR — £430,000 Guide Price

- **Address:** 12 Arundel Street, Manchester, M15 4JR (Manchester, Greater Manchester)
- **Price:** £430,000 Guide Price _(£430,000)_
- **Size:** 2,076 sq. ft. (2,076 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Canning O'Neill, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2076 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/88243917#/?channel=COM_BUY

### Unit 2, Praed Road, Trafford Park, Manchester, M17 1PQ — £395,000

- **Address:** Unit 2, Praed Road, Trafford Park, Manchester, M17 1PQ (Manchester, Greater Manchester)
- **Price:** £395,000 _(£395,000)_
- **Size:** 2,877 sq. ft. (2,877 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Fairhurst Buckley, Stockport
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2877 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/759312782239104#/?channel=COM_BUY

### Ladybarn Lane, Manchester, Greater Manchester, M14 6YU — £150,000 Guide Price

- **Address:** Ladybarn Lane, Manchester, Greater Manchester, M14 6YU (Manchester, Greater Manchester)
- **Price:** £150,000 Guide Price _(£150,000)_ · auction
- **Size:** 2,012 sq. ft. (2,012 sq ft)
- **Type:** Land · [object Object]
- **Agent:** Pattinsons, Pattinsons Auction- National Auctioneer
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2012 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/159892385#/?channel=COM_BUY

### Bridgeman Place Works, Salop Street, Bolton, Lancashire — £1,800,000

- **Address:** Bridgeman Place Works, Salop Street, Bolton, Lancashire (Bolton, Greater Manchester)
- **Price:** £1,800,000 _(£1,800,000)_
- **Size:** 28,211 sq. ft. (28,211 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Fletcher CRE LTD, Bolton
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1800000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759313315085665#/?channel=COM_BUY

### WESTGATE HOUSE, 1 WESTGATE AVENUE, BOLTON, BL1 — £850,000

- **Address:** WESTGATE HOUSE, 1 WESTGATE AVENUE, BOLTON, BL1 (Bolton, Greater Manchester)
- **Price:** £850,000 _(£850,000)_
- **Size:** 7,000 sq. ft. (7,000 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Nolan Real Estate, Bury
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 7000 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759452932809904#/?channel=COM_BUY

### Unit 3 & Car Park, 178/200 Lever Street, Bolton, Bolton, Bolton, Lancashire, BL3 6NZ — £750,000

- **Address:** Unit 3 & Car Park, 178/200 Lever Street, Bolton, Bolton, Bolton, Lancashire, BL3 6NZ (Bolton, Greater Manchester)
- **Price:** £750,000 _(£750,000)_
- **Size:** n/a
- **Type:** Light Industrial · [object Object]
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 750000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/760715703659920#/?channel=COM_BUY

### BEDFORD HOUSE, 60 CHORLEY NEW ROAD , BOLTON, GREATER MANCHESTER, BL1 4DA — £650,000

- **Address:** BEDFORD HOUSE, 60 CHORLEY NEW ROAD , BOLTON, GREATER MANCHESTER, BL1 4DA (Bolton, Greater Manchester)
- **Price:** £650,000 _(£650,000)_
- **Size:** 5,346 sq. ft. (5,346 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 5346 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760714627810529#/?channel=COM_BUY

### 173 CHORLEY NEW ROAD, BOLTON, GREATER MANCHESTER, BL1 4QZ — £600,000

- **Address:** 173 CHORLEY NEW ROAD, BOLTON, GREATER MANCHESTER, BL1 4QZ (Bolton, Greater Manchester)
- **Price:** £600,000 _(£600,000)_
- **Size:** 4,668 sq. ft. (4,668 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 4668 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760714856408001#/?channel=COM_BUY

### Beacon House, 69-73 Manchester Road, Bolton, BL2 1ES — £450,000 Offers in Region of

- **Address:** Beacon House, 69-73 Manchester Road, Bolton, BL2 1ES (Bolton, Greater Manchester)
- **Price:** £450,000 Offers in Region of _(£450,000)_
- **Size:** 5,213 sq. ft. (5,213 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 5213 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760715670176049#/?channel=COM_BUY

### 23 Mawdsley Street, Bolton, BL1 1LL — £375,000 Offers in Region of

- **Address:** 23 Mawdsley Street, Bolton, BL1 1LL (Bolton, Greater Manchester)
- **Price:** £375,000 Offers in Region of _(£375,000)_
- **Size:** 8,288 sq. ft. (8,288 sq ft)
- **Type:** Leisure Facility · [object Object]
- **Agent:** Turner Westwell Commercial Agents, Chorley
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 8288 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760927203609520#/?channel=COM_BUY

### 179 Chorley New Road, Bolton, Lancashire, BL1 4QZ — £365,000

- **Address:** 179 Chorley New Road, Bolton, Lancashire, BL1 4QZ (Bolton, Greater Manchester)
- **Price:** £365,000 _(£365,000)_
- **Size:** 3,625 sq. ft. (3,625 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 3625 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760715194123232#/?channel=COM_BUY

### 9A Gaskell Court , Churchgate, Bolton, BL1 1HU — £350,000

- **Address:** 9A Gaskell Court , Churchgate, Bolton, BL1 1HU (Bolton, Greater Manchester)
- **Price:** £350,000 _(£350,000)_
- **Size:** 3,645 sq. ft. (3,645 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Fletcher CRE LTD, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 3645 >= min 2000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/759313885420993#/?channel=COM_BUY

### White Lion Brow, Bolton, BL1 — £325,000 Offers Over

- **Address:** White Lion Brow, Bolton, BL1 (Bolton, Greater Manchester)
- **Price:** £325,000 Offers Over _(£325,000)_
- **Size:** 25,700 sq. ft. (25,700 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Miller Metcalfe, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 25700 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/88636776#/?channel=COM_BUY

### 477 Leigh Road, Westhoughton, Bolton, Lancashire, BL5 — £215,000

- **Address:** 477 Leigh Road, Westhoughton, Bolton, Lancashire, BL5 (Bolton, Greater Manchester)
- **Price:** £215,000 _(£215,000)_
- **Size:** 2,088 sq. ft. (2,088 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Fletcher CRE LTD, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2088 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759313776288321#/?channel=COM_BUY

### New Hall Lane, Bolton — £195,000 Offers in Region of

- **Address:** New Hall Lane, Bolton (Bolton, Greater Manchester)
- **Price:** £195,000 Offers in Region of _(£195,000)_
- **Size:** 1,000–2,000 sq. ft. (2,000 sq ft)
- **Type:** Mixed Use · [object Object]
- **Agent:** Regency Estates, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2000 >= min 2000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/758269323414560#/?channel=COM_BUY

### Hardman Street, Bolton, Greater Manchester, BL4 — £365,000 Offers in Region of

- **Address:** Hardman Street, Bolton, Greater Manchester, BL4 (Bolton, Greater Manchester)
- **Price:** £365,000 Offers in Region of _(£365,000)_
- **Size:** 3,000 sq. ft. (3,000 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Josephs Estates, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 3000 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/89191197#/?channel=COM_BUY

### Bolton Road, Kearsley, Bolton, BL4 8NG — £250,000 Guide Price

- **Address:** Bolton Road, Kearsley, Bolton, BL4 8NG (Bolton, Greater Manchester)
- **Price:** £250,000 Guide Price _(£250,000)_ · auction
- **Size:** 4,897 sq. ft. (4,897 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Hyde Estate & Lettings Agents, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 4897 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90635571#/?channel=COM_BUY

## Scraped but did not pass Stage-0

302 investable listings scored below the bar (geography not scored — these counts reflect price/size/keyword signals only).

| Best score | Listings | Typical shortfall |
|---|---|---|
| 0/2 | 139 | no non-geo signal at all (POA price, no size given, no keyword hit) |
| 1/2 | 163 | one signal only — e.g. keyword but price outside budget / size unknown |

