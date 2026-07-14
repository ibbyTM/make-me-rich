# Rightmove Commercial — live for-sale pull + Stage-0 filter

**Date:** 2026-07-14 · **Source:** rightmove.co.uk commercial-property-for-sale (search pages, `__NEXT_DATA__` plain JSON) · **Mode:** read-only live pull

Searched **7 cities** (Citywide footprint: Yorkshire + Greater Manchester). Portal reports **878** matching results across those searches; fetched a capped **554** (max 5 pages/city, 1.5 s between requests), **554** after cross-city dedupe. Stage-0 (minimum bar **2** of 4) passed **335**.

| City | Region | Portal results | Fetched (deduped) |
|---|---|---|---|
| Leeds | Yorkshire | 222 | 119 |
| Sheffield | Yorkshire | 167 | 115 |
| Bradford | Yorkshire | 75 | 56 |
| Huddersfield | Yorkshire | 57 | 44 |
| Doncaster | Yorkshire | 49 | 47 |
| Manchester | Greater Manchester | 234 | 118 |
| Bolton | Greater Manchester | 74 | 55 |

> robots.txt (checked at pull time) does **not** disallow the commercial `find.html` search path (only contact/map/photo/full-description paths). Portal ToS may still restrict automated collection — in the CAIS pipeline Rightmove remains a route-to-review portal source (spec §4/§5); this was an explicit low-volume read-only pull.

## ⚠️ Read this first: the 60% pass rate is a funnel design finding, not 335 good leads

Stage-0 passed **335 of 554** — far higher than Barnsdales (2 of 4). The cause is structural, and it matters for API cost:

- **Geography is a free point on a portal pull.** The search itself is geo-scoped to Citywide/Educating cities, so *every* listing scores the geography criterion by construction. The effective bar drops from 2-of-4 to **1-of-3**.
- That one remaining point is most often a **keyword hit** — `freehold` (global keyword) and `office` (Educating keyword) appear in a large share of commercial marketing text. 232 of the 335 passes include a keyword reason; 204 passed with exactly score 2 (geography + one keyword).
- **In production this pull would trigger ~335 Claude API calls.** For geo-scoped portal sources, Stage-0 needs either (a) the geography point excluded when the search is already geo-filtered, or (b) a higher minimum bar for portal pulls. Worth deciding before wiring portals into the scheduled pipeline.
- One agent skews the data: **Ernest Wilson & Co (Leeds)** accounts for 106 of 554 listings — mostly small businesses-for-sale (cafés, salons) whose text often contains `freehold`. Filtering business-for-sale subtypes would cut noise substantially.

The per-listing detail below is complete as requested, but treat the passed set as "geo + one signal", not as scored candidates — that's the Day-5 matcher's job downstream.

## Agent coverage

**156 distinct agents/branches** appear in the 554 fetched listings — vs one agent per bespoke source. 128 distinct agents appear in the Stage-0-passed set.

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
| Sanderson Weatherall, Leeds | 8 |
| Eddisons Commercial Limited, Bradford | 8 |
| Commercial Property Partners Ltd, Sheffield | 8 |
| W T Gunson, Manchester - BPG | 8 |
| JBrown International, London | 8 |

## Passed the filter

### 26-27 Park Square West, Leeds, LS1 2PL — £1,500,000 Offers in Excess of

- **Address:** 26-27 Park Square West, Leeds, LS1 2PL (Leeds, Yorkshire)
- **Price:** £1,500,000 Offers in Excess of _(£1,500,000)_
- **Size:** 5,856 sq. ft. (5,856 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 1500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/698589182145520#/?channel=COM_BUY

### 43 Park Place, Leeds, LS1 2RY — £1,800,000

- **Address:** 43 Park Place, Leeds, LS1 2RY (Leeds, Yorkshire)
- **Price:** £1,800,000 _(£1,800,000)_
- **Size:** 8,997 sq. ft. (8,997 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Knight Frank, Leeds - Commercial
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 1800000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/154042034#/?channel=COM_BUY

### Building/Home Improvement, West Yorkshire, West Yorkshire — £1,400,000

- **Address:** Building/Home Improvement, West Yorkshire, West Yorkshire (Leeds, Yorkshire)
- **Price:** £1,400,000 _(£1,400,000)_
- **Size:** n/a
- **Type:** Residential Development · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 1400000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/170335808#/?channel=COM_BUY

### 13-14 Park Place, Leeds, LS1 2SJ — £1,013,000 Offers in Excess of

- **Address:** 13-14 Park Place, Leeds, LS1 2SJ (Leeds, Yorkshire)
- **Price:** £1,013,000 Offers in Excess of _(£1,013,000)_
- **Size:** 5,858 sq. ft. (5,858 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Northcap, Leeds
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 1013000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90125763#/?channel=COM_BUY

### Wetherby, High Street, LS22 — £595,000

- **Address:** Wetherby, High Street, LS22 (Leeds, Yorkshire)
- **Price:** £595,000 _(£595,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Renton & Parr, Wetherby
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 595000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90641748#/?channel=COM_BUY

### Oxford Chambers, Oxford Place, Leeds, LS1 3AX — £850,000

- **Address:** Oxford Chambers, Oxford Place, Leeds, LS1 3AX (Leeds, Yorkshire)
- **Price:** £850,000 _(£850,000)_
- **Size:** n/a
- **Type:** Land · [object Object]
- **Agent:** Knight Frank, Leeds - Commercial
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 850000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/169402238#/?channel=COM_BUY

### 2 Moorland Road, Hyde Park, Leeds, LS6 1AL — £650,000 Offers in Region of

- **Address:** 2 Moorland Road, Hyde Park, Leeds, LS6 1AL (Leeds, Yorkshire)
- **Price:** £650,000 Offers in Region of _(£650,000)_
- **Size:** 3,779 sq. ft. (3,779 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 650000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/722868246358240#/?channel=COM_BUY

### Unit 1 Metis Building, 2 Solly Street, Sheffield, S1 — £495,000

- **Address:** Unit 1 Metis Building, 2 Solly Street, Sheffield, S1 (Sheffield, Yorkshire)
- **Price:** £495,000 _(£495,000)_
- **Size:** 3,850 sq. ft. (3,850 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Leaworks Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 3850 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/756215561406961#/?channel=COM_BUY

### WILSON CARLILE CENTRE, 50 CAVENDISH STREET, SHEFFIELD, YORKSHIRE, S3 — £3,000,000 Guide Price

- **Address:** WILSON CARLILE CENTRE, 50 CAVENDISH STREET, SHEFFIELD, YORKSHIRE, S3 (Sheffield, Yorkshire)
- **Price:** £3,000,000 Guide Price _(£3,000,000)_
- **Size:** 22,881 sq. ft. (22,881 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Bruton Knowles, Gloucester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 22881 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/760730285095312#/?channel=COM_BUY

### 24 Meadowhall Road, Sheffield, South Yorkshire, S9 1BS — POA

- **Address:** 24 Meadowhall Road, Sheffield, South Yorkshire, S9 1BS (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 6,286 sq. ft. (6,286 sq ft)
- **Type:** Showroom · [object Object]
- **Agent:** Flint Real Estate, Doncaster
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 6286 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760551129667441#/?channel=COM_BUY

### Endeavour, Sheffield Digital Campus, Sheffield, South Yorkshire, S1 — £25,460,000

- **Address:** Endeavour, Sheffield Digital Campus, Sheffield, South Yorkshire, S1 (Sheffield, Yorkshire)
- **Price:** £25,460,000 _(£25,460,000)_
- **Size:** 65,511 sq. ft. (65,511 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Lambert Smith Hampton, Living & Capital Markets
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 65511 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760930151971185#/?channel=COM_BUY

### Parkway Plaza, Prince Of Wales Road , Sheffield, S9 4EU — £6,750,000 From

- **Address:** Parkway Plaza, Prince Of Wales Road , Sheffield, S9 4EU (Sheffield, Yorkshire)
- **Price:** £6,750,000 From _(£6,750,000)_
- **Size:** 40,000–85,000 sq. ft. (85,000 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 85000 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759291330487233#/?channel=COM_BUY

### Aspect Court, Pond Street, Sheffield, S1 2BG — £6,000,000

- **Address:** Aspect Court, Pond Street, Sheffield, S1 2BG (Sheffield, Yorkshire)
- **Price:** £6,000,000 _(£6,000,000)_
- **Size:** 57,842 sq. ft. (57,842 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 57842 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/760571878944801#/?channel=COM_BUY

### Pheasant Works, Surbiton Street, Sheffield, South Yorkshire, S9 5AQ — £2,800,000

- **Address:** Pheasant Works, Surbiton Street, Sheffield, South Yorkshire, S9 5AQ (Sheffield, Yorkshire)
- **Price:** £2,800,000 _(£2,800,000)_
- **Size:** 35,523 sq. ft. (35,523 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 35523 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/762397808152992#/?channel=COM_BUY

### Queen Street, Sheffield — £2,250,000

- **Address:** Queen Street, Sheffield (Sheffield, Yorkshire)
- **Price:** £2,250,000 _(£2,250,000)_
- **Size:** 4,521 sq. ft. (4,521 sq ft)
- **Type:** Hotel · [object Object]
- **Agent:** GPS Commercial, Eastbourne
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 4521 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760545966541872#/?channel=COM_BUY

### Group of Dental Investments, UK Wide — £2,000,000 Guide Price

- **Address:** Group of Dental Investments, UK Wide (Sheffield, Yorkshire)
- **Price:** £2,000,000 Guide Price _(£2,000,000)_
- **Size:** n/a
- **Type:** Healthcare Facility · [object Object]
- **Agent:** Christie & Co, Dental
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 2000000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760779631160737#/?channel=COM_BUY

### Sheffield Cold Stores, Roman Ridge Road, Sheffield, S9 — £1,950,000

- **Address:** Sheffield Cold Stores, Roman Ridge Road, Sheffield, S9 (Sheffield, Yorkshire)
- **Price:** £1,950,000 _(£1,950,000)_
- **Size:** 44,910 sq. ft. (44,910 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 44910 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/754599909254481#/?channel=COM_BUY

### 197 Holme Lane, Sheffield, S6 — £1,800,000 Offers in Region of

- **Address:** 197 Holme Lane, Sheffield, S6 (Sheffield, Yorkshire)
- **Price:** £1,800,000 Offers in Region of _(£1,800,000)_
- **Size:** 28,497 sq. ft. (28,497 sq ft)
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 1800000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/165618794#/?channel=COM_BUY

### Poplar Way, Rotherham — £1,500,000 Offers in Region of

- **Address:** Poplar Way, Rotherham (Sheffield, Yorkshire)
- **Price:** £1,500,000 Offers in Region of _(£1,500,000)_
- **Size:** 97,574 sq. ft. (97,574 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** BARKER PROUDLOVE LIMITED, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 97574 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760015858866432#/?channel=COM_BUY

### 386 Coleridge Road, Sheffield, S9 — POA

- **Address:** 386 Coleridge Road, Sheffield, S9 (Sheffield, Yorkshire)
- **Price:** POA _(£1,250,000)_
- **Size:** 12,656 sq. ft. (12,656 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 1250000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/754599957448257#/?channel=COM_BUY

### Waverley Works, Effingham Street, Sheffield,  Waverley Works, Effingham Street, Sheffield — £1,000,000 Guide Price

- **Address:** Waverley Works, Effingham Street, Sheffield,  Waverley Works, Effingham Street, Sheffield (Sheffield, Yorkshire)
- **Price:** £1,000,000 Guide Price _(£1,000,000)_ · auction
- **Size:** 35,000 sq. ft. (35,000 sq ft)
- **Type:** Mixed Use · [object Object]
- **Agent:** Savills, Savills Auctions- Commercial
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 35000 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/746606427835057#/?channel=COM_BUY

### Gilbertson Works, Jessell Street, Sheffield, South Yorkshire, S9 3HY — £1,000,000

- **Address:** Gilbertson Works, Jessell Street, Sheffield, South Yorkshire, S9 3HY (Sheffield, Yorkshire)
- **Price:** £1,000,000 _(£1,000,000)_
- **Size:** 13,625 sq. ft. (13,625 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 13625 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759300316797680#/?channel=COM_BUY

### Brightside Lane, Sheffield, S9 — £975,000 Offers in Region of

- **Address:** Brightside Lane, Sheffield, S9 (Sheffield, Yorkshire)
- **Price:** £975,000 Offers in Region of _(£975,000)_
- **Size:** 10,387 sq. ft. (10,387 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Commercial Property Rotherham, Rotherham
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 975000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/754397739487104#/?channel=COM_BUY

### Unit 1, Holbrook Industrial Estate, Holbrook Rise, Holbrook, Sheffield, South Yorkshire, S20 3FG — £960,000

- **Address:** Unit 1, Holbrook Industrial Estate, Holbrook Rise, Holbrook, Sheffield, South Yorkshire, S20 3FG (Sheffield, Yorkshire)
- **Price:** £960,000 _(£960,000)_
- **Size:** 14,175 sq. ft. (14,175 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 14175 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760571646084384#/?channel=COM_BUY

### 607-613 Penistone Road, Sheffield, S6 2GA — £900,000

- **Address:** 607-613 Penistone Road, Sheffield, S6 2GA (Sheffield, Yorkshire)
- **Price:** £900,000 _(£900,000)_
- **Size:** 11,403 sq. ft. (11,403 sq ft)
- **Type:** Leisure Facility · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 900000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/754599953229873#/?channel=COM_BUY

### Woodside Works, Rugby Street, Sheffield, S3 9QH — £895,000

- **Address:** Woodside Works, Rugby Street, Sheffield, S3 9QH (Sheffield, Yorkshire)
- **Price:** £895,000 _(£895,000)_
- **Size:** 44,179 sq. ft. (44,179 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 895000 within budget 500000-2000000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/754599932281041#/?channel=COM_BUY

### Egerton Lane & Land at Evans Street, Sheffield S1 4JX — £695,000

- **Address:** Egerton Lane & Land at Evans Street, Sheffield S1 4JX (Sheffield, Yorkshire)
- **Price:** £695,000 _(£695,000)_
- **Size:** 5,022 sq. ft. (5,022 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** Blue Alpine, London
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 695000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/747098253913009#/?channel=COM_BUY

### Kayedee Premises, Stamford Street, Newhall Road Trading Estate, Sheffield, S9 2TX — £500,000

- **Address:** Kayedee Premises, Stamford Street, Newhall Road Trading Estate, Sheffield, S9 2TX (Sheffield, Yorkshire)
- **Price:** £500,000 _(£500,000)_
- **Size:** 21,489 sq. ft. (21,489 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 21489 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760571990026673#/?channel=COM_BUY

### Five Rivers House,  Savile Street, Sheffield S4 7UD — £475,000 Offers in Excess of

- **Address:** Five Rivers House,  Savile Street, Sheffield S4 7UD (Sheffield, Yorkshire)
- **Price:** £475,000 Offers in Excess of _(£475,000)_
- **Size:** 8,196 sq. ft. (8,196 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 8196 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/757307324194945#/?channel=COM_BUY

### 16-18 & 20 Dixon Lane, Sheffield, S1 2AL — £400,000

- **Address:** 16-18 & 20 Dixon Lane, Sheffield, S1 2AL (Sheffield, Yorkshire)
- **Price:** £400,000 _(£400,000)_
- **Size:** 5,765 sq. ft. (5,765 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 5765 >= min 2000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/754599940713777#/?channel=COM_BUY

### Unit 1, Daisy Spring Works, Dun Street, Sheffield, S3 8DW — £399,000

- **Address:** Unit 1, Daisy Spring Works, Dun Street, Sheffield, S3 8DW (Sheffield, Yorkshire)
- **Price:** £399,000 _(£399,000)_
- **Size:** 5,500 sq. ft. (5,500 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 5500 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/112995386#/?channel=COM_BUY

### Unit 8, Shepcote Office Village, Shepcote Lane, Sheffield, South Yorkshire, S9 1TG — £395,000

- **Address:** Unit 8, Shepcote Office Village, Shepcote Lane, Sheffield, South Yorkshire, S9 1TG (Sheffield, Yorkshire)
- **Price:** £395,000 _(£395,000)_
- **Size:** 3,022 sq. ft. (3,022 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 3022 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760571300137888#/?channel=COM_BUY

### Unit 2B, Junction 34 Industrial Estate, Greasbro Road, Tinsley, Sheffield, S9 1TN — £390,000

- **Address:** Unit 2B, Junction 34 Industrial Estate, Greasbro Road, Tinsley, Sheffield, S9 1TN (Sheffield, Yorkshire)
- **Price:** £390,000 _(£390,000)_
- **Size:** 4,820 sq. ft. (4,820 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 4820 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/762568495545041#/?channel=COM_BUY

### Unit 2 - Metis Building, 1 Scotland Street, Sheffield, S3 7AT — £335,000 Offers in Region of

- **Address:** Unit 2 - Metis Building, 1 Scotland Street, Sheffield, S3 7AT (Sheffield, Yorkshire)
- **Price:** £335,000 Offers in Region of _(£335,000)_
- **Size:** 2,343 sq. ft. (2,343 sq ft)
- **Type:** Office · [object Object]
- **Agent:** SMC Brownill Vickers, South Yorkshire
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 2343 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/761307952034992#/?channel=COM_BUY

### Printhouse, The Printhouse, North Church Street, Sheffield — POA

- **Address:** Printhouse, The Printhouse, North Church Street, Sheffield (Sheffield, Yorkshire)
- **Price:** POA _(£330,000)_
- **Size:** 4,390 sq. ft. (4,390 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Fowler Sandford LLP, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 4390 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/759323486182768#/?channel=COM_BUY

### Alliance House, Roman Ridge Road, Sheffield S9 1GB — £325,000

- **Address:** Alliance House, Roman Ridge Road, Sheffield S9 1GB (Sheffield, Yorkshire)
- **Price:** £325,000 _(£325,000)_
- **Size:** 5,743 sq. ft. (5,743 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 5743 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/744622056476753#/?channel=COM_BUY

### 44 Bank Street, Sheffield, South Yorkshire, S1 2DS — £300,000

- **Address:** 44 Bank Street, Sheffield, South Yorkshire, S1 2DS (Sheffield, Yorkshire)
- **Price:** £300,000 _(£300,000)_
- **Size:** 2,458 sq. ft. (2,458 sq ft)
- **Type:** Shop · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 2458 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760570951948481#/?channel=COM_BUY

### 21 Station Road, Kiveton Park, Sheffield, S26 6QP — £299,950

- **Address:** 21 Station Road, Kiveton Park, Sheffield, S26 6QP (Sheffield, Yorkshire)
- **Price:** £299,950 _(£299,950)_
- **Size:** 2,783 sq. ft. (2,783 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** SMC Brownill Vickers, South Yorkshire
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 2783 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/719250187282449#/?channel=COM_BUY

### Land at Green Lane, Ecclesfield, Sheffield S35 9WY — £275,000

- **Address:** Land at Green Lane, Ecclesfield, Sheffield S35 9WY (Sheffield, Yorkshire)
- **Price:** £275,000 _(£275,000)_
- **Size:** 20,042 sq. ft. (20,042 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 20042 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/743551758137296#/?channel=COM_BUY

### Athol House, Heart of The City II, Pinstone Street, Sheffield, S1 2HZ — POA

- **Address:** Athol House, Heart of The City II, Pinstone Street, Sheffield, S1 2HZ (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 968–2,973 sq. ft. (2,973 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Savills, Leeds Offices
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 2973 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/758217253130032#/?channel=COM_BUY

### Highfield at Waverley, Highfield Spring, Waverley, Rotherham, S60 — POA

- **Address:** Highfield at Waverley, Highfield Spring, Waverley, Rotherham, S60 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 10,000–80,000 sq. ft. (80,000 sq ft)
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 80000 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/168968804#/?channel=COM_BUY

### VGP Park Sheffield , Europa Link, Sheffield, South Yorkshire, S9 1TG — POA

- **Address:** VGP Park Sheffield , Europa Link, Sheffield, South Yorkshire, S9 1TG (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 265,500 sq. ft. (265,500 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 265500 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759292490166064#/?channel=COM_BUY

### Advantage House, Poplar Way, Catcliffe, Rotherham, Yorkshire S60 — POA

- **Address:** Advantage House, Poplar Way, Catcliffe, Rotherham, Yorkshire S60 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 19,873 sq. ft. (19,873 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 19873 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/89589720#/?channel=COM_BUY

### Milton Street, Sheffield, S3 7UF — POA

- **Address:** Milton Street, Sheffield, S3 7UF (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 275,000–350,000 sq. ft. (350,000 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 350000 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759292704103920#/?channel=COM_BUY

### Foundry House, 3 Millsands, Sheffield, South Yorkshire, S3 8NH — POA

- **Address:** Foundry House, 3 Millsands, Sheffield, South Yorkshire, S3 8NH (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 36,381 sq. ft. (36,381 sq ft)
- **Type:** Office · [object Object]
- **Agent:** GV&Co, Leeds
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 36381 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760579667771744#/?channel=COM_BUY

### 50, Broadfield Road, Sheffield, S8 0XJ — POA

- **Address:** 50, Broadfield Road, Sheffield, S8 0XJ (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 3,546 sq. ft. (3,546 sq ft)
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 3546 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/174802055#/?channel=COM_BUY

### 50, Broadfield Road, Sheffield, S8 0XJ — POA

- **Address:** 50, Broadfield Road, Sheffield, S8 0XJ (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 3,546 sq. ft. (3,546 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 3546 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/174801437#/?channel=COM_BUY

### Futures Way, Off Bolling Road, Bradford, West Yorkshire, BD4 7EB — £4,500,000 Offers in Region of

- **Address:** Futures Way, Off Bolling Road, Bradford, West Yorkshire, BD4 7EB (Bradford, Yorkshire)
- **Price:** £4,500,000 Offers in Region of _(£4,500,000)_
- **Size:** 72,564 sq. ft. (72,564 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 72564 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760556347259392#/?channel=COM_BUY

### No.1 Midpoint Business Park, 1 Mid Point, Thornbury, Bradford, BD3 7AY — £4,000,000 Offers in Excess of

- **Address:** No.1 Midpoint Business Park, 1 Mid Point, Thornbury, Bradford, BD3 7AY (Bradford, Yorkshire)
- **Price:** £4,000,000 Offers in Excess of _(£4,000,000)_
- **Size:** 39,178 sq. ft. (39,178 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Northcap, Leeds
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 39178 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/89501259#/?channel=COM_BUY

### West Riding House, 31 Cheapside, Bradford, West Riding House, 31 Cheapside, Bradford — £2,650,000 Guide Price

- **Address:** West Riding House, 31 Cheapside, Bradford, West Riding House, 31 Cheapside, Bradford (Bradford, Yorkshire)
- **Price:** £2,650,000 Guide Price _(£2,650,000)_
- **Size:** 29,351 sq. ft. (29,351 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Savills, City Offices
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 29351 >= min 2000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/750945672314128#/?channel=COM_BUY

### Units D & E, Bradford Business Park, Canal Road, Bradford, BD1 4SJ — £1,750,000 Offers in Region of

- **Address:** Units D & E, Bradford Business Park, Canal Road, Bradford, BD1 4SJ (Bradford, Yorkshire)
- **Price:** £1,750,000 Offers in Region of _(£1,750,000)_
- **Size:** 16,266 sq. ft. (16,266 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 16266 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760557054121681#/?channel=COM_BUY

### Pasture Lane, Clayton, Bradford, BD14 6LU — POA

- **Address:** Pasture Lane, Clayton, Bradford, BD14 6LU (Bradford, Yorkshire)
- **Price:** POA _(£995,000)_
- **Size:** 11,814 sq. ft. (11,814 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Bradford Yorkshire" matches Citywide Investors; price 995000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/722868265035712#/?channel=COM_BUY

### Onward House, 2 Baptist Place, Bradford, West Yorkshire — £595,000 Offers in Region of

- **Address:** Onward House, 2 Baptist Place, Bradford, West Yorkshire (Bradford, Yorkshire)
- **Price:** £595,000 Offers in Region of _(£595,000)_
- **Size:** 11,194 sq. ft. (11,194 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 11194 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760934224753408#/?channel=COM_BUY

### Little Lane Church, Little Lane, Bradford — £395,000 Offers in Region of

- **Address:** Little Lane Church, Little Lane, Bradford (Bradford, Yorkshire)
- **Price:** £395,000 Offers in Region of _(£395,000)_
- **Size:** 9,015 sq. ft. (9,015 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 9015 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/760934262388241#/?channel=COM_BUY

### 343 Wakefield Road, Bradford, BD4 7NB — £375,000 Offers in Region of

- **Address:** 343 Wakefield Road, Bradford, BD4 7NB (Bradford, Yorkshire)
- **Price:** £375,000 Offers in Region of _(£375,000)_
- **Size:** 3,297 sq. ft. (3,297 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 3297 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760557448387104#/?channel=COM_BUY

### Oxford Place, Bradford — £325,000

- **Address:** Oxford Place, Bradford (Bradford, Yorkshire)
- **Price:** £325,000 _(£325,000)_
- **Size:** 5,761 sq. ft. (5,761 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 5761 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760934153446096#/?channel=COM_BUY

### Queensbury Baptist Church, Chapel Lane, Queensbury, Bradford, Yorkshire, BD13 2PZ — POA

- **Address:** Queensbury Baptist Church, Chapel Lane, Queensbury, Bradford, Yorkshire, BD13 2PZ (Bradford, Yorkshire)
- **Price:** POA _(£250,000)_
- **Size:** 3,083 sq. ft. (3,083 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Lambert Smith Hampton, Leeds
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 3083 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/760771181578336#/?channel=COM_BUY

### Wharfedale Road, Bradford — POA

- **Address:** Wharfedale Road, Bradford (Bradford, Yorkshire)
- **Price:** POA _(£10)_
- **Size:** 28,079 sq. ft. (28,079 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** CBRE, Leeds
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 28079 >= min 2000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/746607883263889#/?channel=COM_BUY

### The Paper Hall, Anne Gate, Bradford, BD1 4EQ — POA

- **Address:** The Paper Hall, Anne Gate, Bradford, BD1 4EQ (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 4,916 sq. ft. (4,916 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 4916 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760558194972352#/?channel=COM_BUY

### Hillam Road, Off Canal Road, Bradford, BD2 1QL — POA

- **Address:** Hillam Road, Off Canal Road, Bradford, BD2 1QL (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 20,405 sq. ft. (20,405 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 20405 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760557131759280#/?channel=COM_BUY

### 221 Sunbridge Road, Bradford, BD1 2LG — POA

- **Address:** 221 Sunbridge Road, Bradford, BD1 2LG (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 16,165 sq. ft. (16,165 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 16165 >= min 2000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/760557421122001#/?channel=COM_BUY

### Beech Street, Huddersfield, West Yorkshire, HD1 — £450,000

- **Address:** Beech Street, Huddersfield, West Yorkshire, HD1 (Huddersfield, Yorkshire)
- **Price:** £450,000 _(£450,000)_
- **Size:** 14,128 sq. ft. (14,128 sq ft)
- **Type:** Leisure Facility · [object Object]
- **Agent:** Portfolio Lets Limited, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; size 14128 >= min 2000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/752945269010833#/?channel=COM_BUY

### Final Plot - Trinity West, Trinity Street, Huddersfield, HD1 4DL — POA

- **Address:** Final Plot - Trinity West, Trinity Street, Huddersfield, HD1 4DL (Huddersfield, Yorkshire)
- **Price:** POA _(£2,550,000)_
- **Size:** 67,082 sq. ft. (67,082 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Fox Lloyd Jones, Leeds
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; size 67082 >= min 2000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/721600211753729#/?channel=COM_BUY

### Investment Property, Almondbury, West Yorkshire — £525,000

- **Address:** Investment Property, Almondbury, West Yorkshire (Huddersfield, Yorkshire)
- **Price:** £525,000 _(£525,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Citywide Investors; price 525000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/142703828#/?channel=COM_BUY

### 1 Lord Street, Huddersfield, West Yorkshire, HD1 1QA — £500,000

- **Address:** 1 Lord Street, Huddersfield, West Yorkshire, HD1 1QA (Huddersfield, Yorkshire)
- **Price:** £500,000 _(£500,000)_
- **Size:** 5,422 sq. ft. (5,422 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; size 5422 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/742090498310208#/?channel=COM_BUY

### Former Bowling Club, King Cliffe Road, West Yorkshire, HD2 2RR — £295,000

- **Address:** Former Bowling Club, King Cliffe Road, West Yorkshire, HD2 2RR (Huddersfield, Yorkshire)
- **Price:** £295,000 _(£295,000)_
- **Size:** 3,448 sq. ft. (3,448 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; size 3448 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742077927848224#/?channel=COM_BUY

### Development Site to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE — £200,000 Offers in Excess of

- **Address:** Development Site to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE (Huddersfield, Yorkshire)
- **Price:** £200,000 Offers in Excess of _(£200,000)_
- **Size:** 11,761 sq. ft. (11,761 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; size 11761 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742063384158624#/?channel=COM_BUY

### Land to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE — £200,000 Offers in Excess of

- **Address:** Land to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE (Huddersfield, Yorkshire)
- **Price:** £200,000 Offers in Excess of _(£200,000)_
- **Size:** 11,761 sq. ft. (11,761 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; size 11761 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742063304407872#/?channel=COM_BUY

### Land Adjacent To 84, Longwood Gate, Longwood, Huddersfield, West Yorkshire, HD3 4US — £160,000

- **Address:** Land Adjacent To 84, Longwood Gate, Longwood, Huddersfield, West Yorkshire, HD3 4US (Huddersfield, Yorkshire)
- **Price:** £160,000 _(£160,000)_
- **Size:** 161,172 sq. ft. (161,172 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; size 161172 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742063671410129#/?channel=COM_BUY

### Former Revolution, 28 Cross Church Street, Huddersfield, HD1 2PT — POA

- **Address:** Former Revolution, 28 Cross Church Street, Huddersfield, HD1 2PT (Huddersfield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 10,698 sq. ft. (10,698 sq ft)
- **Type:** Bar / Nightclub · [object Object]
- **Agent:** Savills, Margaret Street - Licensed Leisure
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; size 10698 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/749299705809233#/?channel=COM_BUY

### Land to Rear of 72 & 74 New North Road, Huddersfield — £200,000 Offers Over

- **Address:** Land to Rear of 72 & 74 New North Road, Huddersfield (Huddersfield, Yorkshire)
- **Price:** £200,000 Offers Over _(£200,000)_
- **Size:** 11,761 sq. ft. (11,761 sq ft)
- **Type:** Land · [object Object]
- **Agent:** Bramleys, Huddersfield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; size 11761 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/173745665#/?channel=COM_BUY

### Land adjacent to 84 Longwood Gate, Longwood, Huddersfield — £160,000

- **Address:** Land adjacent to 84 Longwood Gate, Longwood, Huddersfield (Huddersfield, Yorkshire)
- **Price:** £160,000 _(£160,000)_
- **Size:** 161,172 sq. ft. (161,172 sq ft)
- **Type:** Land · [object Object]
- **Agent:** Bramleys, Huddersfield
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; size 161172 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/173625812#/?channel=COM_BUY

### Pillar House, 19-21 South Parade, Doncaster, South Yorkshire, DN1 2DJ — £695,000 Offers in Region of

- **Address:** Pillar House, 19-21 South Parade, Doncaster, South Yorkshire, DN1 2DJ (Doncaster, Yorkshire)
- **Price:** £695,000 Offers in Region of _(£695,000)_
- **Size:** 12,389 sq. ft. (12,389 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Flint Real Estate, Doncaster
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; price 695000 within budget 500000-2000000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/760550506814305#/?channel=COM_BUY

### The Lakeside - Beefeater, South Entry Drive White Rose Way, Doncaster, DN4 5PJ — £1,500,000

- **Address:** The Lakeside - Beefeater, South Entry Drive White Rose Way, Doncaster, DN4 5PJ (Doncaster, Yorkshire)
- **Price:** £1,500,000 _(£1,500,000)_
- **Size:** n/a
- **Type:** Restaurant · [object Object]
- **Agent:** Christie & Co, Pubs & Restaurants
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; price 1500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/762383212182224#/?channel=COM_BUY

### 11-19 Printing Office Street, Doncaster, South Yorkshire, DN1 1TJ — £725,000 Offers in Region of

- **Address:** 11-19 Printing Office Street, Doncaster, South Yorkshire, DN1 1TJ (Doncaster, Yorkshire)
- **Price:** £725,000 Offers in Region of _(£725,000)_
- **Size:** 5,241 sq. ft. (5,241 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** PPH Commercial Limited, Doncaster
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; price 725000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759461342496401#/?channel=COM_BUY

### Licenced Trade, Pubs & Clubs, South Yorkshire — £700,000 Offers in Excess of

- **Address:** Licenced Trade, Pubs & Clubs, South Yorkshire (Doncaster, Yorkshire)
- **Price:** £700,000 Offers in Excess of _(£700,000)_
- **Size:** n/a
- **Type:** Pub · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; price 700000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/164177699#/?channel=COM_BUY

### Slug  Lettuce, 54 Hall Gate, Doncaster, DN1 3PB — £500,000 Offers in Excess of

- **Address:** Slug  Lettuce, 54 Hall Gate, Doncaster, DN1 3PB (Doncaster, Yorkshire)
- **Price:** £500,000 Offers in Excess of _(£500,000)_
- **Size:** 11,326 sq. ft. (11,326 sq ft)
- **Type:** Pub · [object Object]
- **Agent:** Savills, Manchester - Licensed Leisure
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; price 500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/723056780266769#/?channel=COM_BUY

### Hall Gate, Doncaster, DN1 — £1,500,000

- **Address:** Hall Gate, Doncaster, DN1 (Doncaster, Yorkshire)
- **Price:** £1,500,000 _(£1,500,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Nested, Nationwide
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; price 1500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90530232#/?channel=COM_BUY

### Unit 1 and 2, Moho, Arundel Street, Manchester, M15 4JY — £650,000

- **Address:** Unit 1 and 2, Moho, Arundel Street, Manchester, M15 4JY (Manchester, Greater Manchester)
- **Price:** £650,000 _(£650,000)_
- **Size:** 4,047 sq. ft. (4,047 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Shape and Sate, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 4047 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/90799932#/?channel=COM_BUY

### Briscoe Lane, Manchester, M40 — £7,000,000 Offers in Excess of

- **Address:** Briscoe Lane, Manchester, M40 (Manchester, Greater Manchester)
- **Price:** £7,000,000 Offers in Excess of _(£7,000,000)_
- **Size:** 186,872 sq. ft. (186,872 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Citrus Commercial Circle, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 186872 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/749898455249585#/?channel=COM_BUY

### Wakefield House, 7-13 New Wakefield Street, Manchester, Greater Manchester, M1 5NP — £6,250,000

- **Address:** Wakefield House, 7-13 New Wakefield Street, Manchester, Greater Manchester, M1 5NP (Manchester, Greater Manchester)
- **Price:** £6,250,000 _(£6,250,000)_
- **Size:** 31,330 sq. ft. (31,330 sq ft)
- **Type:** Mixed Use · [object Object]
- **Agent:** W T Gunson, Manchester - BPG
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 31330 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759472245651296#/?channel=COM_BUY

### The Waterside, Springfield Lane, Manchester, M3 7JQ — £6,000,000 Offers in Excess of

- **Address:** The Waterside, Springfield Lane, Manchester, M3 7JQ (Manchester, Greater Manchester)
- **Price:** £6,000,000 Offers in Excess of _(£6,000,000)_
- **Size:** 65,340 sq. ft. (65,340 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** Di Properties Ltd, London
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 65340 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/161828498#/?channel=COM_BUY

### Kiwi Park - Unit 6, Commerce Way, Trafford Park, Manchester, Greater Manchester, M17 — POA

- **Address:** Kiwi Park - Unit 6, Commerce Way, Trafford Park, Manchester, Greater Manchester, M17 (Manchester, Greater Manchester)
- **Price:** POA _(£3,500,000)_
- **Size:** 17,197 sq. ft. (17,197 sq ft)
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** DAVIES HARRISON LIMITED, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 17197 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/754386811315905#/?channel=COM_BUY

### Albion Wharf, 19 Albion Street, Manchester, Greater Manchester — £2,100,000 Offers in Region of

- **Address:** Albion Wharf, 19 Albion Street, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** £2,100,000 Offers in Region of _(£2,100,000)_
- **Size:** 10,430 sq. ft. (10,430 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Roger Hannah Ltd, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 10430 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760768065211217#/?channel=COM_BUY

### 17-25 St. Ann Street, Manchester, Greater Manchester, M2 — £2,000,000 Offers Over

- **Address:** 17-25 St. Ann Street, Manchester, Greater Manchester, M2 (Manchester, Greater Manchester)
- **Price:** £2,000,000 Offers Over _(£2,000,000)_
- **Size:** 10,033 sq. ft. (10,033 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** BARKER PROUDLOVE LIMITED, Manchester
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 2000000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/754397760540369#/?channel=COM_BUY

### 4 Naval Street, Ancoats, Manchester, M4 6EW — £1,950,000

- **Address:** 4 Naval Street, Ancoats, Manchester, M4 6EW (Manchester, Greater Manchester)
- **Price:** £1,950,000 _(£1,950,000)_
- **Size:** 4,674 sq. ft. (4,674 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Gifford Dixon Commercial Property, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 4674 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/174801380#/?channel=COM_BUY

### Bury Street, Manchester, Greater Manchester, M3 — £1,550,000 Offers in Excess of

- **Address:** Bury Street, Manchester, Greater Manchester, M3 (Manchester, Greater Manchester)
- **Price:** £1,550,000 Offers in Excess of _(£1,550,000)_
- **Size:** 5,814 sq. ft. (5,814 sq ft)
- **Type:** Office · [object Object]
- **Agent:** OBI PROPERTY LIMITED, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 5814 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/754591526994001#/?channel=COM_BUY

### Former Chapel St & Hope United Reformed Church, 146 Chapel Street, Salford, M3 6AF — £1,500,000 Offers in Excess of

- **Address:** Former Chapel St & Hope United Reformed Church, 146 Chapel Street, Salford, M3 6AF (Manchester, Greater Manchester)
- **Price:** £1,500,000 Offers in Excess of _(£1,500,000)_
- **Size:** 9,766 sq. ft. (9,766 sq ft)
- **Type:** Place of Worship · [object Object]
- **Agent:** W T Gunson, Manchester - BPG
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 1500000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759473348749040#/?channel=COM_BUY

### Grant House, Units 8 & 9 Washington Centre, Broadway, Salford, M50 2UW — POA

- **Address:** Grant House, Units 8 & 9 Washington Centre, Broadway, Salford, M50 2UW (Manchester, Greater Manchester)
- **Price:** POA _(£1,400,000)_
- **Size:** 15,685 sq. ft. (15,685 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Sixteen Real Estate, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 15685 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/88701666#/?channel=COM_BUY

### Stretford Road, Hulme, Manchester, M15 — £1,300,000

- **Address:** Stretford Road, Hulme, Manchester, M15 (Manchester, Greater Manchester)
- **Price:** £1,300,000 _(£1,300,000)_
- **Size:** n/a
- **Type:** Residential Development · [object Object]
- **Agent:** Citrus Commercial Circle, Manchester
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 1300000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/751658404128465#/?channel=COM_BUY

### Lyons Road, Trafford Park, Manchester, Greater Manchester — £895,000

- **Address:** Lyons Road, Trafford Park, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** £895,000 _(£895,000)_
- **Size:** 9,107 sq. ft. (9,107 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Roger Hannah Ltd, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 9107 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760767924826705#/?channel=COM_BUY

### Unit 2, Fourways Trading Estate, Manchester, M17 1SW — £1,100,000 Offers in Region of

- **Address:** Unit 2, Fourways Trading Estate, Manchester, M17 1SW (Manchester, Greater Manchester)
- **Price:** £1,100,000 Offers in Region of _(£1,100,000)_
- **Size:** 6,352 sq. ft. (6,352 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Williams Sillitoe, Cheshire
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 6352 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/173477042#/?channel=COM_BUY

### Land At New Viaduct Street And 266 Bradford Road, Manchester, Greater Manchester — £1,045,000

- **Address:** Land At New Viaduct Street And 266 Bradford Road, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** £1,045,000 _(£1,045,000)_
- **Size:** 47,916 sq. ft. (47,916 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Roger Hannah Ltd, Manchester
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 1045000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760768027462464#/?channel=COM_BUY

### Ground Floor (East Wing) Victoria Mill, 10 Lower Vickers Street, Manchester, Manchester, M40 7LH — £1,000,000 Offers in Region of

- **Address:** Ground Floor (East Wing) Victoria Mill, 10 Lower Vickers Street, Manchester, Manchester, M40 7LH (Manchester, Greater Manchester)
- **Price:** £1,000,000 Offers in Region of _(£1,000,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Landwood Group, Manchester
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 1000000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/167035448#/?channel=COM_BUY

### 22 Oxford Court, Manchester, M2 3WQ — £995,150

- **Address:** 22 Oxford Court, Manchester, M2 3WQ (Manchester, Greater Manchester)
- **Price:** £995,150 _(£995,150)_
- **Size:** 3,062 sq. ft. (3,062 sq ft)
- **Type:** Office · [object Object]
- **Agent:** JLL, Manchester - Offices
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 3062 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/158787608#/?channel=COM_BUY

### Parkway Four Estate, Longbridge Road, Trafford Park, Trafford — POA

- **Address:** Parkway Four Estate, Longbridge Road, Trafford Park, Trafford (Manchester, Greater Manchester)
- **Price:** POA _(£995,000)_
- **Size:** 6,208 sq. ft. (6,208 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** DAVIES HARRISON LIMITED, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 6208 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760738990430945#/?channel=COM_BUY

### 500 Styal Road, Manchester, M22 5HQ — £995,000 Offers in Region of

- **Address:** 500 Styal Road, Manchester, M22 5HQ (Manchester, Greater Manchester)
- **Price:** £995,000 Offers in Region of _(£995,000)_
- **Size:** 6,379 sq. ft. (6,379 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Canning O'Neill, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 6379 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/89204469#/?channel=COM_BUY

### Units 1-4, Hadfield House, Gordon Street, Stockport, SK4 1RR — £975,000

- **Address:** Units 1-4, Hadfield House, Gordon Street, Stockport, SK4 1RR (Manchester, Greater Manchester)
- **Price:** £975,000 _(£975,000)_
- **Size:** 21,507 sq. ft. (21,507 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Fairhurst Buckley, Stockport
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 21507 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759312467830369#/?channel=COM_BUY

### Longley Lane, Manchester, Greater Manchester, M22 — Offers Invited

- **Address:** Longley Lane, Manchester, Greater Manchester, M22 (Manchester, Greater Manchester)
- **Price:** Offers Invited _(£949,000)_
- **Size:** 1–11,080 sq. ft. (11,080 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Houldsworth Business and Arts Centre NW Ltd, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 11080 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/169531910#/?channel=COM_BUY

### The Rat and Pigeon, 33 Back Piccadilly, Manchester, M1 1HP — £885,000 Offers in Excess of

- **Address:** The Rat and Pigeon, 33 Back Piccadilly, Manchester, M1 1HP (Manchester, Greater Manchester)
- **Price:** £885,000 Offers in Excess of _(£885,000)_
- **Size:** 1,133 sq. ft. (1,133 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Savills, Margaret Street - Licensed Leisure
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 885000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/744108203782992#/?channel=COM_BUY

### 3 The Stables, Wilmslow Road, East Didsbury, M20 5PG — £850,000 Guide Price

- **Address:** 3 The Stables, Wilmslow Road, East Didsbury, M20 5PG (Manchester, Greater Manchester)
- **Price:** £850,000 Guide Price _(£850,000)_
- **Size:** 2,747 sq. ft. (2,747 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Canning O'Neill, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 2747 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/136774796#/?channel=COM_BUY

### Ayres Road, Stretford, Trafford — £850,000 Offers in Excess of

- **Address:** Ayres Road, Stretford, Trafford (Manchester, Greater Manchester)
- **Price:** £850,000 Offers in Excess of _(£850,000)_
- **Size:** 1,992–7,798 sq. ft. (7,798 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Thomas Willmax Ltd, Sale
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 850000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/738114440579633#/?channel=COM_BUY

### Broughton Street, Manchester, Greater Manchester, M8 — £675,000 Offers in Excess of

- **Address:** Broughton Street, Manchester, Greater Manchester, M8 (Manchester, Greater Manchester)
- **Price:** £675,000 Offers in Excess of _(£675,000)_
- **Size:** 8,500 sq. ft. (8,500 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** NQ Commercial Limited, Manchester
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 675000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/756213044978816#/?channel=COM_BUY

### 51-53 Richmond Street, Manchester, Lancashire, M1 3WB — £675,000 Offers in Region of

- **Address:** 51-53 Richmond Street, Manchester, Lancashire, M1 3WB (Manchester, Greater Manchester)
- **Price:** £675,000 Offers in Region of _(£675,000)_
- **Size:** n/a
- **Type:** Residential Development · [object Object]
- **Agent:** Landwood Group, Manchester
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 675000 within budget 500000-2000000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/162129293#/?channel=COM_BUY

### Whitegate Inn (Beefeater), Broadway, Oldham, OL9 8DW — £640,000

- **Address:** Whitegate Inn (Beefeater), Broadway, Oldham, OL9 8DW (Manchester, Greater Manchester)
- **Price:** £640,000 _(£640,000)_
- **Size:** n/a
- **Type:** Pub · [object Object]
- **Agent:** Christie & Co, Pubs & Restaurants
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 640000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/763088377470560#/?channel=COM_BUY

### Ashton New Road, Manchester, Greater Manchester, M11 — £625,000

- **Address:** Ashton New Road, Manchester, Greater Manchester, M11 (Manchester, Greater Manchester)
- **Price:** £625,000 _(£625,000)_
- **Size:** 5,960 sq. ft. (5,960 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Thomas Willmax Ltd, Sale
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 625000 within budget 500000-2000000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/754785658201873#/?channel=COM_BUY

### 3 Jordan Street, Manchester M15 — £625,000 Offers in Region of

- **Address:** 3 Jordan Street, Manchester M15 (Manchester, Greater Manchester)
- **Price:** £625,000 Offers in Region of _(£625,000)_
- **Size:** 2,242 sq. ft. (2,242 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Knight Frank, Manchester - Commercial
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 2242 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/90414237#/?channel=COM_BUY

### Manchester Road, Manchester — £600,000 Offers in Region of

- **Address:** Manchester Road, Manchester (Manchester, Greater Manchester)
- **Price:** £600,000 Offers in Region of _(£600,000)_
- **Size:** 1,431–1,432 sq. ft. (1,432 sq ft)
- **Type:** Shop · [object Object]
- **Agent:** TFC, Deansgate
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 600000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/755487604418224#/?channel=COM_BUY

### Unit 2, Digital Park, Pacific Way, Salford Quays, M50 1DR — £595,000 Offers in Region of

- **Address:** Unit 2, Digital Park, Pacific Way, Salford Quays, M50 1DR (Manchester, Greater Manchester)
- **Price:** £595,000 Offers in Region of _(£595,000)_
- **Size:** 3,245 sq. ft. (3,245 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Canning O'Neill, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 3245 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/90129879#/?channel=COM_BUY

### Swinton Hall Road, Swinton, Manchester, Greater Manchester, M27 4UB — £560,000 Guide Price

- **Address:** Swinton Hall Road, Swinton, Manchester, Greater Manchester, M27 4UB (Manchester, Greater Manchester)
- **Price:** £560,000 Guide Price _(£560,000)_ · auction
- **Size:** n/a
- **Type:** Commercial Development · [object Object]
- **Agent:** Pattinsons, Pattinsons Auction- National Auctioneer
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 560000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/88587447#/?channel=COM_BUY

### Riverside Unit at Bridgewater Wharf, 257 Ordsall Lane, Salford, M5 3NG — £500,000 Offers in Excess of

- **Address:** Riverside Unit at Bridgewater Wharf, 257 Ordsall Lane, Salford, M5 3NG (Manchester, Greater Manchester)
- **Price:** £500,000 Offers in Excess of _(£500,000)_
- **Size:** 2,336 sq. ft. (2,336 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Gifford Dixon Commercial Property, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 2336 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/160038089#/?channel=COM_BUY

### 12 Arundel Street, Manchester, M15 4JR — £430,000 Guide Price

- **Address:** 12 Arundel Street, Manchester, M15 4JR (Manchester, Greater Manchester)
- **Price:** £430,000 Guide Price _(£430,000)_
- **Size:** 2,076 sq. ft. (2,076 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Canning O'Neill, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 2076 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/88243917#/?channel=COM_BUY

### Unit 2, Praed Road, Trafford Park, Manchester, M17 1PQ — £395,000

- **Address:** Unit 2, Praed Road, Trafford Park, Manchester, M17 1PQ (Manchester, Greater Manchester)
- **Price:** £395,000 _(£395,000)_
- **Size:** 2,877 sq. ft. (2,877 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Fairhurst Buckley, Stockport
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 2877 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/759312782239104#/?channel=COM_BUY

### Ladybarn Lane, Manchester, Greater Manchester, M14 6YU — £150,000 Guide Price

- **Address:** Ladybarn Lane, Manchester, Greater Manchester, M14 6YU (Manchester, Greater Manchester)
- **Price:** £150,000 Guide Price _(£150,000)_ · auction
- **Size:** 2,012 sq. ft. (2,012 sq ft)
- **Type:** Land · [object Object]
- **Agent:** Pattinsons, Pattinsons Auction- National Auctioneer
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 2012 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/159892385#/?channel=COM_BUY

### New Hall Lane, Bolton — £195,000 Offers in Region of

- **Address:** New Hall Lane, Bolton (Bolton, Greater Manchester)
- **Price:** £195,000 Offers in Region of _(£195,000)_
- **Size:** 1,000–2,000 sq. ft. (2,000 sq ft)
- **Type:** Mixed Use · [object Object]
- **Agent:** Regency Estates, Bolton
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; size 2000 >= min 2000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/758269323414560#/?channel=COM_BUY

### 23 Mawdsley Street, Bolton, BL1 1LL — £375,000 Offers in Region of

- **Address:** 23 Mawdsley Street, Bolton, BL1 1LL (Bolton, Greater Manchester)
- **Price:** £375,000 Offers in Region of _(£375,000)_
- **Size:** 8,288 sq. ft. (8,288 sq ft)
- **Type:** Leisure Facility · [object Object]
- **Agent:** Turner Westwell Commercial Agents, Chorley
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; size 8288 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760927203609520#/?channel=COM_BUY

### Bridgeman Place Works, Salop Street, Bolton, Lancashire — £1,800,000

- **Address:** Bridgeman Place Works, Salop Street, Bolton, Lancashire (Bolton, Greater Manchester)
- **Price:** £1,800,000 _(£1,800,000)_
- **Size:** 28,211 sq. ft. (28,211 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Fletcher CRE LTD, Bolton
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; price 1800000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759313315085665#/?channel=COM_BUY

### Swan  Barristers, 2-4 Churchgate, Bolton, BL1 1HJ — £1,200,000 Offers in Excess of

- **Address:** Swan  Barristers, 2-4 Churchgate, Bolton, BL1 1HJ (Bolton, Greater Manchester)
- **Price:** £1,200,000 Offers in Excess of _(£1,200,000)_
- **Size:** 11,326 sq. ft. (11,326 sq ft)
- **Type:** Pub · [object Object]
- **Agent:** Savills, Manchester - Licensed Leisure
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; price 1200000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/723062151173152#/?channel=COM_BUY

### The Swan & Barristers, 2-4 Churchgate, Bolton, BL1 1HJ — £1,200,000

- **Address:** The Swan & Barristers, 2-4 Churchgate, Bolton, BL1 1HJ (Bolton, Greater Manchester)
- **Price:** £1,200,000 _(£1,200,000)_
- **Size:** n/a
- **Type:** Pub · [object Object]
- **Agent:** Christie & Co, Pubs & Restaurants
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; price 1200000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/730294920018513#/?channel=COM_BUY

### WESTGATE HOUSE, 1 WESTGATE AVENUE, BOLTON, BL1 — £850,000

- **Address:** WESTGATE HOUSE, 1 WESTGATE AVENUE, BOLTON, BL1 (Bolton, Greater Manchester)
- **Price:** £850,000 _(£850,000)_
- **Size:** 7,000 sq. ft. (7,000 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Nolan Real Estate, Bury
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; size 7000 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759452932809904#/?channel=COM_BUY

### Unit 3 & Car Park, 178/200 Lever Street, Bolton, Bolton, Bolton, Lancashire, BL3 6NZ — £750,000

- **Address:** Unit 3 & Car Park, 178/200 Lever Street, Bolton, Bolton, Bolton, Lancashire, BL3 6NZ (Bolton, Greater Manchester)
- **Price:** £750,000 _(£750,000)_
- **Size:** n/a
- **Type:** Light Industrial · [object Object]
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; price 750000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/760715703659920#/?channel=COM_BUY

### Red Lion, 1-3 Salford Road, Bolton, BL5 1BJ — £750,000 Offers in Region of

- **Address:** Red Lion, 1-3 Salford Road, Bolton, BL5 1BJ (Bolton, Greater Manchester)
- **Price:** £750,000 Offers in Region of _(£750,000)_
- **Size:** 35,719 sq. ft. (35,719 sq ft)
- **Type:** Pub · [object Object]
- **Agent:** Savills, Manchester - Licensed Leisure
- **Matched requirement:** Citywide Investors (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; price 750000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/757452912626721#/?channel=COM_BUY

### BEDFORD HOUSE, 60 CHORLEY NEW ROAD , BOLTON, GREATER MANCHESTER, BL1 4DA — £650,000

- **Address:** BEDFORD HOUSE, 60 CHORLEY NEW ROAD , BOLTON, GREATER MANCHESTER, BL1 4DA (Bolton, Greater Manchester)
- **Price:** £650,000 _(£650,000)_
- **Size:** 5,346 sq. ft. (5,346 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; size 5346 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760714627810529#/?channel=COM_BUY

### 173 CHORLEY NEW ROAD, BOLTON, GREATER MANCHESTER, BL1 4QZ — £600,000

- **Address:** 173 CHORLEY NEW ROAD, BOLTON, GREATER MANCHESTER, BL1 4QZ (Bolton, Greater Manchester)
- **Price:** £600,000 _(£600,000)_
- **Size:** 4,668 sq. ft. (4,668 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; size 4668 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760714856408001#/?channel=COM_BUY

### Beacon House, 69-73 Manchester Road, Bolton, BL2 1ES — £450,000 Offers in Region of

- **Address:** Beacon House, 69-73 Manchester Road, Bolton, BL2 1ES (Bolton, Greater Manchester)
- **Price:** £450,000 Offers in Region of _(£450,000)_
- **Size:** 5,213 sq. ft. (5,213 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; size 5213 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760715670176049#/?channel=COM_BUY

### 179 Chorley New Road, Bolton, Lancashire, BL1 4QZ — £365,000

- **Address:** 179 Chorley New Road, Bolton, Lancashire, BL1 4QZ (Bolton, Greater Manchester)
- **Price:** £365,000 _(£365,000)_
- **Size:** 3,625 sq. ft. (3,625 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; size 3625 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760715194123232#/?channel=COM_BUY

### 9A Gaskell Court , Churchgate, Bolton, BL1 1HU — £350,000

- **Address:** 9A Gaskell Court , Churchgate, Bolton, BL1 1HU (Bolton, Greater Manchester)
- **Price:** £350,000 _(£350,000)_
- **Size:** 3,645 sq. ft. (3,645 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Fletcher CRE LTD, Bolton
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; size 3645 >= min 2000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/759313885420993#/?channel=COM_BUY

### White Lion Brow, Bolton, BL1 — £325,000 Offers Over

- **Address:** White Lion Brow, Bolton, BL1 (Bolton, Greater Manchester)
- **Price:** £325,000 Offers Over _(£325,000)_
- **Size:** 25,700 sq. ft. (25,700 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Miller Metcalfe, Bolton
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; size 25700 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/88636776#/?channel=COM_BUY

### 477 Leigh Road, Westhoughton, Bolton, Lancashire, BL5 — £215,000

- **Address:** 477 Leigh Road, Westhoughton, Bolton, Lancashire, BL5 (Bolton, Greater Manchester)
- **Price:** £215,000 _(£215,000)_
- **Size:** 2,088 sq. ft. (2,088 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Fletcher CRE LTD, Bolton
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; size 2088 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759313776288321#/?channel=COM_BUY

### Hardman Street, Bolton, Greater Manchester, BL4 — £365,000 Offers in Region of

- **Address:** Hardman Street, Bolton, Greater Manchester, BL4 (Bolton, Greater Manchester)
- **Price:** £365,000 Offers in Region of _(£365,000)_
- **Size:** 3,000 sq. ft. (3,000 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Josephs Estates, Bolton
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; size 3000 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/89191197#/?channel=COM_BUY

### Bolton Road, Kearsley, Bolton, BL4 8NG — £250,000 Guide Price

- **Address:** Bolton Road, Kearsley, Bolton, BL4 8NG (Bolton, Greater Manchester)
- **Price:** £250,000 Guide Price _(£250,000)_ · auction
- **Size:** 4,897 sq. ft. (4,897 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Hyde Estate & Lettings Agents, Manchester
- **Matched requirement:** Educating Excellence (score 3/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; size 4897 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90635571#/?channel=COM_BUY

### Haigh House, The Grange, Three Cottages, Barn, Stables, Lake and 14 Acres of Land, Wakefield Road, Rothwell Haigh, LS26 — £1,850,000 Offers in Region of

- **Address:** Haigh House, The Grange, Three Cottages, Barn, Stables, Lake and 14 Acres of Land, Wakefield Road, Rothwell Haigh, LS26 (Leeds, Yorkshire)
- **Price:** £1,850,000 Offers in Region of _(£1,850,000)_
- **Size:** n/a
- **Type:** Commercial Development · [object Object]
- **Agent:** Simon Blyth Estate Agents, Holmfirth
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 1850000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/89659935#/?channel=COM_BUY

### 1 City West Gelderd Road, Leeds, LS12 6NJ — £995,000 Offers in Region of

- **Address:** 1 City West Gelderd Road, Leeds, LS12 6NJ (Leeds, Yorkshire)
- **Price:** £995,000 Offers in Region of _(£995,000)_
- **Size:** 550–9,210 sq. ft. (9,210 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 995000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/762214045440304#/?channel=COM_BUY

### 2 Leeds City Office Park, Leeds, LS11 5BD — £7,950,000 Offers in Excess of

- **Address:** 2 Leeds City Office Park, Leeds, LS11 5BD (Leeds, Yorkshire)
- **Price:** £7,950,000 Offers in Excess of _(£7,950,000)_
- **Size:** 400–71,209 sq. ft. (71,209 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 71209 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/721810029791568#/?channel=COM_BUY

### 3150 Century Way  3150 Century Way  LEEDS  LS15 8ZB  United Kingdom — £7,000,000

- **Address:** 3150 Century Way  3150 Century Way  LEEDS  LS15 8ZB  United Kingdom (Leeds, Yorkshire)
- **Price:** £7,000,000 _(£7,000,000)_
- **Size:** 29,534 sq. ft. (29,534 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Colliers International, Offices - Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 29534 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/168202244#/?channel=COM_BUY

### Edison Business Centre, Ring Road, Leeds, LS13 4ET — £2,950,000

- **Address:** Edison Business Centre, Ring Road, Leeds, LS13 4ET (Leeds, Yorkshire)
- **Price:** £2,950,000 _(£2,950,000)_
- **Size:** 48,943 sq. ft. (48,943 sq ft)
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 48943 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/173317376#/?channel=COM_BUY

### Central House, 47 St Paul's Street, Leeds, LS1 2TE — £2,855,000 Offers in Excess of

- **Address:** Central House, 47 St Paul's Street, Leeds, LS1 2TE (Leeds, Yorkshire)
- **Price:** £2,855,000 Offers in Excess of _(£2,855,000)_
- **Size:** 10,006 sq. ft. (10,006 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Northcap, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90125895#/?channel=COM_BUY

### Units 1, 2, 3 & 4, Spence Lane, Leeds, LS12 1EF — £2,500,000 Offers in Region of

- **Address:** Units 1, 2, 3 & 4, Spence Lane, Leeds, LS12 1EF (Leeds, Yorkshire)
- **Price:** £2,500,000 Offers in Region of _(£2,500,000)_
- **Size:** 9,831 sq. ft. (9,831 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/761850891905793#/?channel=COM_BUY

### Laurel House 146-148 Garnet Road, Leeds, LS11 5HP — £2,000,000 Offers in Region of

- **Address:** Laurel House 146-148 Garnet Road, Leeds, LS11 5HP (Leeds, Yorkshire)
- **Price:** £2,000,000 Offers in Region of _(£2,000,000)_
- **Size:** 575–53,252 sq. ft. (53,252 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 2000000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/698587804331425#/?channel=COM_BUY

### Tannery Square, Meanwood, Leeds, LS6 4LT — £2,000,000 Offers in Region of

- **Address:** Tannery Square, Meanwood, Leeds, LS6 4LT (Leeds, Yorkshire)
- **Price:** £2,000,000 Offers in Region of _(£2,000,000)_
- **Size:** 7,811 sq. ft. (7,811 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Fox Lloyd Jones, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 2000000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/751133814140048#/?channel=COM_BUY

### Carlton Trading Estate, Pickering Street, Armley, Leeds — £1,660,000 Offers in Region of

- **Address:** Carlton Trading Estate, Pickering Street, Armley, Leeds (Leeds, Yorkshire)
- **Price:** £1,660,000 Offers in Region of _(£1,660,000)_
- **Size:** 57,675 sq. ft. (57,675 sq ft)
- **Type:** Industrial Park · [object Object]
- **Agent:** Northcap, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 1660000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/747888028746705#/?channel=COM_BUY

### Haulage, West Yorkshire, West Yorkshire — £1,500,000

- **Address:** Haulage, West Yorkshire, West Yorkshire (Leeds, Yorkshire)
- **Price:** £1,500,000 _(£1,500,000)_
- **Size:** n/a
- **Type:** Light Industrial · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 1500000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/153559232#/?channel=COM_BUY

### 26/27 Park Square West, Leeds, LS1 2PL — £1,500,000 Offers in Excess of

- **Address:** 26/27 Park Square West, Leeds, LS1 2PL (Leeds, Yorkshire)
- **Price:** £1,500,000 Offers in Excess of _(£1,500,000)_
- **Size:** 5,856 sq. ft. (5,856 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Fox Lloyd Jones, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 1500000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/721600241041920#/?channel=COM_BUY

### United House, 170 Elland Road, Leeds, LS11 8BU — £1,450,000

- **Address:** United House, 170 Elland Road, Leeds, LS11 8BU (Leeds, Yorkshire)
- **Price:** £1,450,000 _(£1,450,000)_
- **Size:** 9,765 sq. ft. (9,765 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 1450000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/90605949#/?channel=COM_BUY

### 3 Whitehall Quay, Leeds, LS1 4BW — £1,200,000 Offers in Region of

- **Address:** 3 Whitehall Quay, Leeds, LS1 4BW (Leeds, Yorkshire)
- **Price:** £1,200,000 Offers in Region of _(£1,200,000)_
- **Size:** 4,119 sq. ft. (4,119 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Fox Lloyd Jones, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 1200000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/721600299765537#/?channel=COM_BUY

### 36-36a Call Lane, Leeds — £1,000,000 Offers in Excess of

- **Address:** 36-36a Call Lane, Leeds (Leeds, Yorkshire)
- **Price:** £1,000,000 Offers in Excess of _(£1,000,000)_
- **Size:** n/a
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 1000000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/760934199587008#/?channel=COM_BUY

### Abbey Road, Leeds, West Yorkshire, LS5 — Offers Invited

- **Address:** Abbey Road, Leeds, West Yorkshire, LS5 (Leeds, Yorkshire)
- **Price:** Offers Invited _(£1,000,000)_
- **Size:** 28,000 sq. ft. (28,000 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** NABARRO MCALLISTER & CO LIMITED, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 1000000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/755877922056849#/?channel=COM_BUY

### Industrial / Warehouse Unit  Cross Chancellor Street  Leeds West Yorkshire — POA

- **Address:** Industrial / Warehouse Unit  Cross Chancellor Street  Leeds West Yorkshire (Leeds, Yorkshire)
- **Price:** POA _(£1,000,000)_
- **Size:** 18,818 sq. ft. (18,818 sq ft)
- **Type:** Industrial Park · [object Object]
- **Agent:** Colliers International, Industrial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 1000000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/169014953#/?channel=COM_BUY

### The Venerable Bede Wyther Houghley Lane, Leeds, LS13 4AU — £350,000 Offers in Region of

- **Address:** The Venerable Bede Wyther Houghley Lane, Leeds, LS13 4AU (Leeds, Yorkshire)
- **Price:** £350,000 Offers in Region of _(£350,000)_
- **Size:** 11,870 sq. ft. (11,870 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 11870 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/733005147134577#/?channel=COM_BUY

### Wedding & Events Venue, Yorkshire — £950,000

- **Address:** Wedding & Events Venue, Yorkshire (Leeds, Yorkshire)
- **Price:** £950,000 _(£950,000)_
- **Size:** n/a
- **Type:** Leisure Facility · [object Object]
- **Agent:** Christie & Co, Hotels
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 950000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/738454269591008#/?channel=COM_BUY

### Hawthorn Park, Coal Road, Whinmoor, Leeds — £900,000

- **Address:** Hawthorn Park, Coal Road, Whinmoor, Leeds (Leeds, Yorkshire)
- **Price:** £900,000 _(£900,000)_
- **Size:** 6,800 sq. ft. (6,800 sq ft)
- **Type:** Office · [object Object]
- **Agent:** NABARRO MCALLISTER & CO LIMITED, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 900000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/758741004284305#/?channel=COM_BUY

### Pavilion Court, Green Lane, Garforth, Leeds, LS25 2AF — £900,000

- **Address:** Pavilion Court, Green Lane, Garforth, Leeds, LS25 2AF (Leeds, Yorkshire)
- **Price:** £900,000 _(£900,000)_
- **Size:** 6,055 sq. ft. (6,055 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 900000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/88691562#/?channel=COM_BUY

### High Street, Boston Spa, Wetherby, Leeds — £850,000

- **Address:** High Street, Boston Spa, Wetherby, Leeds (Leeds, Yorkshire)
- **Price:** £850,000 _(£850,000)_
- **Size:** 2,396 sq. ft. (2,396 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** NABARRO MCALLISTER & CO LIMITED, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 850000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/750593359070864#/?channel=COM_BUY

### Valley Mills, Meanwood, Leeds — £800,000 Offers in Excess of

- **Address:** Valley Mills, Meanwood, Leeds (Leeds, Yorkshire)
- **Price:** £800,000 Offers in Excess of _(£800,000)_
- **Size:** n/a
- **Type:** Industrial Park · [object Object]
- **Agent:** NABARRO MCALLISTER & CO LIMITED, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 800000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/742243428792497#/?channel=COM_BUY

### 60 Wellington Street, Leeds, LS1 2EE — £795,000 Offers in Region of

- **Address:** 60 Wellington Street, Leeds, LS1 2EE (Leeds, Yorkshire)
- **Price:** £795,000 Offers in Region of _(£795,000)_
- **Size:** 3,003 sq. ft. (3,003 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 795000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/90853236#/?channel=COM_BUY

### 3365 The Pentagon, Century Way, Thorpe Park, Leeds, LS15 8ZB — £775,000 Offers in Region of

- **Address:** 3365 The Pentagon, Century Way, Thorpe Park, Leeds, LS15 8ZB (Leeds, Yorkshire)
- **Price:** £775,000 Offers in Region of _(£775,000)_
- **Size:** 3,887 sq. ft. (3,887 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Knight Frank, Leeds - Commercial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 775000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/170303204#/?channel=COM_BUY

### Recycling, West Yorkshire, West Yorkshire — £750,000

- **Address:** Recycling, West Yorkshire, West Yorkshire (Leeds, Yorkshire)
- **Price:** £750,000 _(£750,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 750000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/138724607#/?channel=COM_BUY

### 1-2 Deanhurst Park, Gelderd Road, Gildersome, Morley, Leeds — £725,000

- **Address:** 1-2 Deanhurst Park, Gelderd Road, Gildersome, Morley, Leeds (Leeds, Yorkshire)
- **Price:** £725,000 _(£725,000)_
- **Size:** 5,242 sq. ft. (5,242 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Crans Property Consultants, Huddersfield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 725000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/747152224116992#/?channel=COM_BUY

### 6-8 The Headrow, Leeds, LS1 6PT — £725,000 Offers in Region of

- **Address:** 6-8 The Headrow, Leeds, LS1 6PT (Leeds, Yorkshire)
- **Price:** £725,000 Offers in Region of _(£725,000)_
- **Size:** 5,275 sq. ft. (5,275 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 725000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/173139890#/?channel=COM_BUY

### Main Street, Leeds — £695,000

- **Address:** Main Street, Leeds (Leeds, Yorkshire)
- **Price:** £695,000 _(£695,000)_
- **Size:** 2,793 sq. ft. (2,793 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** NABARRO MCALLISTER & CO LIMITED, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 695000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/758378823950144#/?channel=COM_BUY

### Unit 7 Weaver Street, Leeds, West Yorkshire, LS4 2AU — £695,000 From

- **Address:** Unit 7 Weaver Street, Leeds, West Yorkshire, LS4 2AU (Leeds, Yorkshire)
- **Price:** £695,000 From _(£695,000)_
- **Size:** 7,244–14,488 sq. ft. (14,488 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** GV&Co, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 695000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/760579420307808#/?channel=COM_BUY

### Unit 1, Manor Mills, Manor Road, Leeds, LS11 9AH — £675,000 Offers in Region of

- **Address:** Unit 1, Manor Mills, Manor Road, Leeds, LS11 9AH (Leeds, Yorkshire)
- **Price:** £675,000 Offers in Region of _(£675,000)_
- **Size:** 3,628 sq. ft. (3,628 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Knight Frank, Leeds - Commercial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 675000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/174272831#/?channel=COM_BUY

### Unit 2, Hawthorn Park, Coal Road, Leeds,  LS14 1PQ — £645,000 Offers in Region of

- **Address:** Unit 2, Hawthorn Park, Coal Road, Leeds,  LS14 1PQ (Leeds, Yorkshire)
- **Price:** £645,000 Offers in Region of _(£645,000)_
- **Size:** 4,713 sq. ft. (4,713 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Knight Frank, Leeds - Commercial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 645000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/87687774#/?channel=COM_BUY

### Former Dixons Automotives, Wakefield Road, Rothwell, Leeds, West Yorkshire, LS26 0SB — £625,000 Offers in Region of

- **Address:** Former Dixons Automotives, Wakefield Road, Rothwell, Leeds, West Yorkshire, LS26 0SB (Leeds, Yorkshire)
- **Price:** £625,000 Offers in Region of _(£625,000)_
- **Size:** 9,596 sq. ft. (9,596 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 625000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/760575595098784#/?channel=COM_BUY

### Oak House, 1 Limewood Way, Limewood Business Park, Seacroft, Leeds, LS14 1AB — £620,000 Offers in Region of

- **Address:** Oak House, 1 Limewood Way, Limewood Business Park, Seacroft, Leeds, LS14 1AB (Leeds, Yorkshire)
- **Price:** £620,000 Offers in Region of _(£620,000)_
- **Size:** 2,352–4,713 sq. ft. (4,713 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Knight Frank, Leeds - Commercial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 620000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/174143870#/?channel=COM_BUY

### Post Office, High Street, Wetherby, Leeds — £595,000 Guide Price

- **Address:** Post Office, High Street, Wetherby, Leeds (Leeds, Yorkshire)
- **Price:** £595,000 Guide Price _(£595,000)_
- **Size:** 2,141 sq. ft. (2,141 sq ft)
- **Type:** Mixed Use · [object Object]
- **Agent:** Malcolm Stuart Property Consultants LLP, Tadcaster
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 595000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/762347564791921#/?channel=COM_BUY

### Electrical, North of England, North of England — £595,000

- **Address:** Electrical, North of England, North of England (Leeds, Yorkshire)
- **Price:** £595,000 _(£595,000)_
- **Size:** n/a
- **Type:** Shop · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 595000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/133597607#/?channel=COM_BUY

### 82 York Road, Leeds, LS9 9AA — £595,000

- **Address:** 82 York Road, Leeds, LS9 9AA (Leeds, Yorkshire)
- **Price:** £595,000 _(£595,000)_
- **Size:** 5,982 sq. ft. (5,982 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 595000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/89173143#/?channel=COM_BUY

### Unit 5, Axis Court, Nepshaw Lane, Gildersome, LS27 7UY — £500,000 Offers in Region of

- **Address:** Unit 5, Axis Court, Nepshaw Lane, Gildersome, LS27 7UY (Leeds, Yorkshire)
- **Price:** £500,000 Offers in Region of _(£500,000)_
- **Size:** 4,198 sq. ft. (4,198 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Brackenridge Hanson Tate Limited, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; price 500000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/170094728#/?channel=COM_BUY

### Baptist Chapel, Grove Lane, Headingley, Leeds, LS6 4DP — POA

- **Address:** Baptist Chapel, Grove Lane, Headingley, Leeds, LS6 4DP (Leeds, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 1,816 sq. ft. (1,816 sq ft)
- **Type:** Place of Worship · [object Object]
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/747166306579137#/?channel=COM_BUY

### Gymnasium & Fitness, Morley, West Yorkshire — £495,000

- **Address:** Gymnasium & Fitness, Morley, West Yorkshire (Leeds, Yorkshire)
- **Price:** £495,000 _(£495,000)_
- **Size:** n/a
- **Type:** Leisure Facility · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/88370769#/?channel=COM_BUY

### Madeley House, John Charles Way, Leeds, LS12 6QA — £475,000

- **Address:** Madeley House, John Charles Way, Leeds, LS12 6QA (Leeds, Yorkshire)
- **Price:** £475,000 _(£475,000)_
- **Size:** 3,865 sq. ft. (3,865 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 3865 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/90065235#/?channel=COM_BUY

### Cottingley Community Church, Cottingley Approach, Cottingley, Leeds — £450,000

- **Address:** Cottingley Community Church, Cottingley Approach, Cottingley, Leeds (Leeds, Yorkshire)
- **Price:** £450,000 _(£450,000)_
- **Size:** 6,020 sq. ft. (6,020 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 6020 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/760934249808369#/?channel=COM_BUY

### Lidgett House, 56 Lidgett Lane, Leeds, LS25 1LL — £450,000 Offers in Region of

- **Address:** Lidgett House, 56 Lidgett Lane, Leeds, LS25 1LL (Leeds, Yorkshire)
- **Price:** £450,000 Offers in Region of _(£450,000)_
- **Size:** 3,445 sq. ft. (3,445 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 3445 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/160139987#/?channel=COM_BUY

### 30-31 Kirkgate, Leeds, LS2 7DR — £395,000 Offers in Excess of

- **Address:** 30-31 Kirkgate, Leeds, LS2 7DR (Leeds, Yorkshire)
- **Price:** £395,000 Offers in Excess of _(£395,000)_
- **Size:** 1,904 sq. ft. (1,904 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Fox Lloyd Jones, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/756209632686448#/?channel=COM_BUY

### P D S A, Austhorpe Road, Cross Gates, Leeds — £375,000 Offers in Region of

- **Address:** P D S A, Austhorpe Road, Cross Gates, Leeds (Leeds, Yorkshire)
- **Price:** £375,000 Offers in Region of _(£375,000)_
- **Size:** n/a
- **Type:** Retail Property (out of town) · [object Object]
- **Agent:** Heaney Micklethwaite, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/749348336584336#/?channel=COM_BUY

### Delacey House, Abbey Road, Leeds, LS5 3HS — £375,000 Offers in Region of

- **Address:** Delacey House, Abbey Road, Leeds, LS5 3HS (Leeds, Yorkshire)
- **Price:** £375,000 Offers in Region of _(£375,000)_
- **Size:** 4,620 sq. ft. (4,620 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/751715844897377#/?channel=COM_BUY

### Micklethwaite House, 70 Cross Green Lane, Leeds, LS9 0DG — £350,000 Offers in Excess of

- **Address:** Micklethwaite House, 70 Cross Green Lane, Leeds, LS9 0DG (Leeds, Yorkshire)
- **Price:** £350,000 Offers in Excess of _(£350,000)_
- **Size:** 36,791 sq. ft. (36,791 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/752427605792256#/?channel=COM_BUY

### Units 5-7, Hepton Court, Leeds, — £330,000 Offers in Excess of

- **Address:** Units 5-7, Hepton Court, Leeds, (Leeds, Yorkshire)
- **Price:** £330,000 Offers in Excess of _(£330,000)_
- **Size:** 2,213–8,796 sq. ft. (8,796 sq ft)
- **Type:** Office · [object Object]
- **Agent:** CBRE, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 8796 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/87415677#/?channel=COM_BUY

### 20 & 22, St Michael's Road, Leeds, LS6 3AW — £325,000 Offers in Excess of

- **Address:** 20 & 22, St Michael's Road, Leeds, LS6 3AW (Leeds, Yorkshire)
- **Price:** £325,000 Offers in Excess of _(£325,000)_
- **Size:** 2,333 sq. ft. (2,333 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 2333 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/87844530#/?channel=COM_BUY

### Otley Tavern New Market, Otley, LS21 3AE — £315,000 Offers in Region of

- **Address:** Otley Tavern New Market, Otley, LS21 3AE (Leeds, Yorkshire)
- **Price:** £315,000 Offers in Region of _(£315,000)_
- **Size:** n/a
- **Type:** Pub · [object Object]
- **Agent:** Everard Cole Ltd, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/164459717#/?channel=COM_BUY

### Poplar Products, Ramshead Approach, Seacroft, Leeds — £300,000 From

- **Address:** Poplar Products, Ramshead Approach, Seacroft, Leeds (Leeds, Yorkshire)
- **Price:** £300,000 From _(£300,000)_
- **Size:** 30,742 sq. ft. (30,742 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 30742 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760934272987537#/?channel=COM_BUY

### Vacant Unit, Gildersome, Morley, West Yorkshire — £295,000

- **Address:** Vacant Unit, Gildersome, Morley, West Yorkshire (Leeds, Yorkshire)
- **Price:** £295,000 _(£295,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/87271854#/?channel=COM_BUY

### Property Development, Kippax, West Yorkshire — £250,000

- **Address:** Property Development, Kippax, West Yorkshire (Leeds, Yorkshire)
- **Price:** £250,000 _(£250,000)_
- **Size:** n/a
- **Type:** Commercial Development · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/150446420#/?channel=COM_BUY

### New Market, Otley, Leeds — £200,000

- **Address:** New Market, Otley, Leeds (Leeds, Yorkshire)
- **Price:** £200,000 _(£200,000)_
- **Size:** n/a
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Alan J Picken, Ilkley
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/740254770866144#/?channel=COM_BUY

### Closed Freehold Hair Salon - Leeds [LS27 8QX] — £145,000

- **Address:** Closed Freehold Hair Salon - Leeds [LS27 8QX] (Leeds, Yorkshire)
- **Price:** £145,000 _(£145,000)_
- **Size:** n/a
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Blacks Business Brokers, Bury
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/754386744118688#/?channel=COM_BUY

### Vacant Unit, Farsley, West Yorkshire — £79,950

- **Address:** Vacant Unit, Farsley, West Yorkshire (Leeds, Yorkshire)
- **Price:** £79,950 _(£79,950)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/87835773#/?channel=COM_BUY

### Grosvenor Park Gardens, Headingley, Leeds — £75,000 Offers in Region of

- **Address:** Grosvenor Park Gardens, Headingley, Leeds (Leeds, Yorkshire)
- **Price:** £75,000 Offers in Region of _(£75,000)_
- **Size:** n/a
- **Type:** Residential Development · [object Object]
- **Agent:** NABARRO MCALLISTER & CO LIMITED, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/755877928388576#/?channel=COM_BUY

### Glossop Road, Sheffield — POA

- **Address:** Glossop Road, Sheffield (Sheffield, Yorkshire)
- **Price:** POA _(£2,600,000)_
- **Size:** 1,222–22,259 sq. ft. (22,259 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** Fowler Sandford LLP, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 22259 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/760773543125345#/?channel=COM_BUY

### Lifestyle House 2 Melbourne Avenue, Sheffield, S10 2QH — £1,500,000 Offers in Excess of

- **Address:** Lifestyle House 2 Melbourne Avenue, Sheffield, S10 2QH (Sheffield, Yorkshire)
- **Price:** £1,500,000 Offers in Excess of _(£1,500,000)_
- **Size:** 17,685 sq. ft. (17,685 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 1500000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/698589255316017#/?channel=COM_BUY

### 38-40, 42, 44 And 480 Howard Street, Sheffield, South Yorkshire, S1 2LX — £1,250,000

- **Address:** 38-40, 42, 44 And 480 Howard Street, Sheffield, South Yorkshire, S1 2LX (Sheffield, Yorkshire)
- **Price:** £1,250,000 _(£1,250,000)_
- **Size:** 6,992 sq. ft. (6,992 sq ft)
- **Type:** Shop · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 1250000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/760571799238961#/?channel=COM_BUY

### Lion Works, 91-103 Spital Hill, Sheffield, South Yorkshire S4 7LD — £975,000 Guide Price

- **Address:** Lion Works, 91-103 Spital Hill, Sheffield, South Yorkshire S4 7LD (Sheffield, Yorkshire)
- **Price:** £975,000 Guide Price _(£975,000)_ · auction
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** BTG Eddisons Property Auctions, Commercial Nationwide
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 975000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/173041451#/?channel=COM_BUY

### Units 1 To 3, Bold Street, Sheffield, S9 2LR — £950,000 Offers in Excess of

- **Address:** Units 1 To 3, Bold Street, Sheffield, S9 2LR (Sheffield, Yorkshire)
- **Price:** £950,000 Offers in Excess of _(£950,000)_
- **Size:** 10,836 sq. ft. (10,836 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 950000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/760571314744881#/?channel=COM_BUY

### Unit 3 Waterside Court, Bold Street, Sheffield, South Yorkshire, S9 2LR — £650,000 Guide Price

- **Address:** Unit 3 Waterside Court, Bold Street, Sheffield, South Yorkshire, S9 2LR (Sheffield, Yorkshire)
- **Price:** £650,000 Guide Price _(£650,000)_ · auction
- **Size:** n/a
- **Type:** Office · [object Object]
- **Agent:** Auction Estates Ltd, Nottingham
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 650000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/90471561#/?channel=COM_BUY

### 605 Ecclesall Road, Sheffield, South Yorkshire S11 8PT — £750,000 Guide Price

- **Address:** 605 Ecclesall Road, Sheffield, South Yorkshire S11 8PT (Sheffield, Yorkshire)
- **Price:** £750,000 Guide Price _(£750,000)_ · auction
- **Size:** n/a
- **Type:** Commercial Development · [object Object]
- **Agent:** BTG Eddisons Property Auctions, Commercial Nationwide
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 750000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/89364471#/?channel=COM_BUY

### 936-940 City Road, Sheffield S2 1GQ — £675,000

- **Address:** 936-940 City Road, Sheffield S2 1GQ (Sheffield, Yorkshire)
- **Price:** £675,000 _(£675,000)_
- **Size:** 7,785 sq. ft. (7,785 sq ft)
- **Type:** Mixed Use · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 675000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/743012674615760#/?channel=COM_BUY

### 110-114 Mansfield Road, Sheffield S12 2AP — £650,000

- **Address:** 110-114 Mansfield Road, Sheffield S12 2AP (Sheffield, Yorkshire)
- **Price:** £650,000 _(£650,000)_
- **Size:** 4,580 sq. ft. (4,580 sq ft)
- **Type:** Mixed Use · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; price 650000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/752251579336977#/?channel=COM_BUY

### Restaurants, South Yorkshire — £425,000

- **Address:** Restaurants, South Yorkshire (Sheffield, Yorkshire)
- **Price:** £425,000 _(£425,000)_
- **Size:** n/a
- **Type:** Restaurant · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173798864#/?channel=COM_BUY

### 45 & 53 Nutwood Trading Estate, Limestone Cottage Lane, Sheffield — £425,000

- **Address:** 45 & 53 Nutwood Trading Estate, Limestone Cottage Lane, Sheffield (Sheffield, Yorkshire)
- **Price:** £425,000 _(£425,000)_
- **Size:** 13,148 sq. ft. (13,148 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 13148 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/748063187064193#/?channel=COM_BUY

### Garages, Crookesmoor Road, Sheffield S10 1BJ — £375,000

- **Address:** Garages, Crookesmoor Road, Sheffield S10 1BJ (Sheffield, Yorkshire)
- **Price:** £375,000 _(£375,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/746089752549873#/?channel=COM_BUY

### Unit 11, Westbrook Court, Sharrow Vale Road, Sheffield — £350,000

- **Address:** Unit 11, Westbrook Court, Sharrow Vale Road, Sheffield (Sheffield, Yorkshire)
- **Price:** £350,000 _(£350,000)_
- **Size:** 1,810 sq. ft. (1,810 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/758026269744625#/?channel=COM_BUY

### Hill Top Farm, Main Street, Catcliffe, Rotherham, S60 5SR — £325,000

- **Address:** Hill Top Farm, Main Street, Catcliffe, Rotherham, S60 5SR (Sheffield, Yorkshire)
- **Price:** £325,000 _(£325,000)_
- **Size:** 4,333 sq. ft. (4,333 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 4333 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/760571828537553#/?channel=COM_BUY

### freehold Commercial Investment Property, Manor Lane, Sheffield, S2 1UF — £299,995 Offers in Region of

- **Address:** freehold Commercial Investment Property, Manor Lane, Sheffield, S2 1UF (Sheffield, Yorkshire)
- **Price:** £299,995 Offers in Region of _(£299,995)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** VERITAS BUSINESS SALES LTD, East Midlands
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/755877894808513#/?channel=COM_BUY

### Unit 3 Dun Street, Sheffield, S3 8DW — £295,000

- **Address:** Unit 3 Dun Street, Sheffield, S3 8DW (Sheffield, Yorkshire)
- **Price:** £295,000 _(£295,000)_
- **Size:** 1,609 sq. ft. (1,609 sq ft)
- **Type:** Retail Property (out of town) · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/754599959604624#/?channel=COM_BUY

### 1 Beton House, Park Hill, Rhodes Street, Sheffield, South Yorkshire, S2 5DT — £270,000

- **Address:** 1 Beton House, Park Hill, Rhodes Street, Sheffield, South Yorkshire, S2 5DT (Sheffield, Yorkshire)
- **Price:** £270,000 _(£270,000)_
- **Size:** 2,655 sq. ft. (2,655 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 2655 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/759297143771872#/?channel=COM_BUY

### Unit 10 Park Hill, South Street, Sheffield, South Yorkshire, S2 5QY — £244,000

- **Address:** Unit 10 Park Hill, South Street, Sheffield, South Yorkshire, S2 5QY (Sheffield, Yorkshire)
- **Price:** £244,000 _(£244,000)_
- **Size:** 1,527 sq. ft. (1,527 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759294354560673#/?channel=COM_BUY

### 847 Chesterfield Road, Sheffield, S8 — £240,000 Guide Price

- **Address:** 847 Chesterfield Road, Sheffield, S8 (Sheffield, Yorkshire)
- **Price:** £240,000 Guide Price _(£240,000)_
- **Size:** 1,241 sq. ft. (1,241 sq ft)
- **Type:** Retail Property (out of town) · [object Object]
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/754599953295585#/?channel=COM_BUY

### North Church Street, Sheffield — POA

- **Address:** North Church Street, Sheffield (Sheffield, Yorkshire)
- **Price:** POA _(£200,000)_
- **Size:** 1,343 sq. ft. (1,343 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Fowler Sandford LLP, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759321688844688#/?channel=COM_BUY

### 145 Attercliffe Common, Sheffield — £195,000 Offers in Region of

- **Address:** 145 Attercliffe Common, Sheffield (Sheffield, Yorkshire)
- **Price:** £195,000 Offers in Region of _(£195,000)_
- **Size:** 2,602 sq. ft. (2,602 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** BARKER PROUDLOVE LIMITED, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 2602 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/758018570995760#/?channel=COM_BUY

### Unit B1, Old Station Drive, Millhouses, Sheffield, S7 2PY — £175,000

- **Address:** Unit B1, Old Station Drive, Millhouses, Sheffield, S7 2PY (Sheffield, Yorkshire)
- **Price:** £175,000 _(£175,000)_
- **Size:** 973 sq. ft. (973 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760571891460000#/?channel=COM_BUY

### 4-16 Mowbray Street, Sheffield, S3 8EN — £130,000

- **Address:** 4-16 Mowbray Street, Sheffield, S3 8EN (Sheffield, Yorkshire)
- **Price:** £130,000 _(£130,000)_
- **Size:** 1,521 sq. ft. (1,521 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/762391919408705#/?channel=COM_BUY

### Terry Street, Sheffield — POA

- **Address:** Terry Street, Sheffield (Sheffield, Yorkshire)
- **Price:** POA _(£10)_
- **Size:** 46,139 sq. ft. (46,139 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** CBRE, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 46139 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/744042179075025#/?channel=COM_BUY

### CORE Sheffield, Shepcote Lane, Sheffield, South Yorkshire, S9 1TP — POA

- **Address:** CORE Sheffield, Shepcote Lane, Sheffield, South Yorkshire, S9 1TP (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 367,935 sq. ft. (367,935 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 367935 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/759291900865216#/?channel=COM_BUY

### Land, Broadfield Close, Sheffield, S8 — POA

- **Address:** Land, Broadfield Close, Sheffield, S8 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** n/a
- **Type:** Industrial Development · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/169498337#/?channel=COM_BUY

### Advantage House, Poplar Way, Catcliffe, Rotherham, Yorkshire S60 — POA

- **Address:** Advantage House, Poplar Way, Catcliffe, Rotherham, Yorkshire S60 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** n/a
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/89589717#/?channel=COM_BUY

### Old Fulwood Road, Sheffield, S10 — POA

- **Address:** Old Fulwood Road, Sheffield, S10 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Commercial Property Real Estates Limited, Matlock
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Citywide Investors; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/169773380#/?channel=COM_BUY

### 13 Birley Vale Avenue, Sheffield S12 — POA

- **Address:** 13 Birley Vale Avenue, Sheffield S12 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 17,630 sq. ft. (17,630 sq ft)
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 17630 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/87778536#/?channel=COM_BUY

### Advantage House, Poplar Way, Catcliffe, Rotherham, Yorkshire S60 — POA

- **Address:** Advantage House, Poplar Way, Catcliffe, Rotherham, Yorkshire S60 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** n/a
- **Type:** Industrial Development · [object Object]
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/89589870#/?channel=COM_BUY

### Yards C And D, Old Station Drive, Millhouses, Sheffield, S7 2PY — POA

- **Address:** Yards C And D, Old Station Drive, Millhouses, Sheffield, S7 2PY (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 10,890 sq. ft. (10,890 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" matches Educating Excellence; size 10890 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/760571922917472#/?channel=COM_BUY

### 19 Bridge Street, Bradford, BD1 1JE — £750,000

- **Address:** 19 Bridge Street, Bradford, BD1 1JE (Bradford, Yorkshire)
- **Price:** £750,000 _(£750,000)_
- **Size:** 11,356 sq. ft. (11,356 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Christo & Co, London, London
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bradford Yorkshire" matches Citywide Investors; price 750000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/89729277#/?channel=COM_BUY

### Land at Hartington Terrace, Bradford — £40,000 Guide Price

- **Address:** Land at Hartington Terrace, Bradford (Bradford, Yorkshire)
- **Price:** £40,000 Guide Price _(£40,000)_ · auction
- **Size:** 2,476 sq. ft. (2,476 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Palace Auctions, London
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 2476 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/754780241191488#/?channel=COM_BUY

### Leeds Road, Bradford — £500,000

- **Address:** Leeds Road, Bradford (Bradford, Yorkshire)
- **Price:** £500,000 _(£500,000)_
- **Size:** n/a
- **Type:** Restaurant · [object Object]
- **Agent:** Alan J Picken, Ilkley
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bradford Yorkshire" matches Citywide Investors; price 500000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/735721149776832#/?channel=COM_BUY

### Off License & Convenience, Queensbury, West Yorkshire — £249,950

- **Address:** Off License & Convenience, Queensbury, West Yorkshire (Bradford, Yorkshire)
- **Price:** £249,950 _(£249,950)_
- **Size:** n/a
- **Type:** Convenience Store · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bradford Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/166789874#/?channel=COM_BUY

### Leeds Old Road, Bradford, West Yorkshire, BD3 — £225,000 From

- **Address:** Leeds Old Road, Bradford, West Yorkshire, BD3 (Bradford, Yorkshire)
- **Price:** £225,000 From _(£225,000)_
- **Size:** 500–10,000 sq. ft. (10,000 sq ft)
- **Type:** Retail Property (Shopping Centre) · [object Object]
- **Agent:** Wetherby Property, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 10000 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/752945321440241#/?channel=COM_BUY

### 38/40 James Street, Bradford — £200,000 Offers in Region of

- **Address:** 38/40 James Street, Bradford (Bradford, Yorkshire)
- **Price:** £200,000 Offers in Region of _(£200,000)_
- **Size:** 1,995 sq. ft. (1,995 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Walker Singleton (Commercial), Bradford
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760933312377585#/?channel=COM_BUY

### Vacant Unit, Wyke, West Yorkshire — £190,000

- **Address:** Vacant Unit, Wyke, West Yorkshire (Bradford, Yorkshire)
- **Price:** £190,000 _(£190,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bradford Yorkshire" matches Citywide Investors; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/137963306#/?channel=COM_BUY

### 4-11 Station Mills, Station Road, Wyke, Bradford, BD12 8LA — POA

- **Address:** 4-11 Station Mills, Station Road, Wyke, Bradford, BD12 8LA (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 53,884–69,415 sq. ft. (69,415 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 69415 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/722867770130913#/?channel=COM_BUY

### First & Second Floor, The Wool Exchange, Hustlergate, Bradford, BD1 1RE — £1

- **Address:** First & Second Floor, The Wool Exchange, Hustlergate, Bradford, BD1 1RE (Bradford, Yorkshire)
- **Price:** £1 _(£1)_
- **Size:** n/a
- **Type:** Restaurant · [object Object]
- **Agent:** Christie & Co, Pubs & Restaurants
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/730294055945408#/?channel=COM_BUY

### Unit 3 Interchange 26, Junction 26 M62, Cliff Hollins Lane, Cleckheaton, Bradford, BD12 7EZ — POA

- **Address:** Unit 3 Interchange 26, Junction 26 M62, Cliff Hollins Lane, Cleckheaton, Bradford, BD12 7EZ (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 50,000–105,000 sq. ft. (105,000 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" matches Educating Excellence; size 105000 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/722867839314801#/?channel=COM_BUY

### Sandbeds, Queensbury, Bradford — £170,000

- **Address:** Sandbeds, Queensbury, Bradford (Bradford, Yorkshire)
- **Price:** £170,000 _(£170,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Bronte Estate Agents, Queensbury
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bradford Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90428007#/?channel=COM_BUY

### Drake Fold, Wyke, Bradford, West Yorkshire — £28,000 Guide Price

- **Address:** Drake Fold, Wyke, Bradford, West Yorkshire (Bradford, Yorkshire)
- **Price:** £28,000 Guide Price _(£28,000)_ · auction
- **Size:** n/a
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Auction House, West Yorkshire - Property Auctioneers
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bradford Yorkshire" matches Citywide Investors; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/90218400#/?channel=COM_BUY

### Apartments 1-10,  16-20, Cloth Hall Street, Huddersfield — £800,000

- **Address:** Apartments 1-10,  16-20, Cloth Hall Street, Huddersfield (Huddersfield, Yorkshire)
- **Price:** £800,000 _(£800,000)_
- **Size:** 452–3,616 sq. ft. (3,616 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** LCP, Commercial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Citywide Investors; price 800000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/88202013#/?channel=COM_BUY

### 24 Zetland Street, Huddersfield, HD1 2RA — £595,000

- **Address:** 24 Zetland Street, Huddersfield, HD1 2RA (Huddersfield, Yorkshire)
- **Price:** £595,000 _(£595,000)_
- **Size:** 5,813 sq. ft. (5,813 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Citywide Investors; price 595000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/173895635#/?channel=COM_BUY

### The Grove Inn, 2 Spring Grove Street, Huddersfield, HD1 4BP — £395,000

- **Address:** The Grove Inn, 2 Spring Grove Street, Huddersfield, HD1 4BP (Huddersfield, Yorkshire)
- **Price:** £395,000 _(£395,000)_
- **Size:** n/a
- **Type:** Pub · [object Object]
- **Agent:** Christie & Co, Pubs & Restaurants
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/730293919554240#/?channel=COM_BUY

### 31 - 33 Towngate, Huddersfield, HD4 6JR — £350,000

- **Address:** 31 - 33 Towngate, Huddersfield, HD4 6JR (Huddersfield, Yorkshire)
- **Price:** £350,000 _(£350,000)_
- **Size:** 2,415 sq. ft. (2,415 sq ft)
- **Type:** Retail Property (out of town) · [object Object]
- **Agent:** eXp UK, Commercial
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; size 2415 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/750772690783889#/?channel=COM_BUY

### New Street, Huddersfield, West Yorkshire, HD1 — £320,000 Leasehold

- **Address:** New Street, Huddersfield, West Yorkshire, HD1 (Huddersfield, Yorkshire)
- **Price:** £320,000 Leasehold _(£320,000)_
- **Size:** 3,687 sq. ft. (3,687 sq ft)
- **Type:** Shop · [object Object]
- **Agent:** Ivy Business Centre Ltd, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; size 3687 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/755879419511968#/?channel=COM_BUY

### Church Lane, Newsome, Huddersfield, West Yorkshire, HD4 6JE — £240,000 Guide Price

- **Address:** Church Lane, Newsome, Huddersfield, West Yorkshire, HD4 6JE (Huddersfield, Yorkshire)
- **Price:** £240,000 Guide Price _(£240,000)_ · auction
- **Size:** n/a
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Pattinsons, Pattinsons Auction- National Auctioneer
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/168390494#/?channel=COM_BUY

### Vacant Unit, Paddock, West Yorkshire — £170,000

- **Address:** Vacant Unit, Paddock, West Yorkshire (Huddersfield, Yorkshire)
- **Price:** £170,000 _(£170,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Citywide Investors; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/70055353#/?channel=COM_BUY

### Longwood Edge Road, Huddersfield, West Yorkshire HD3 3UU — POA

- **Address:** Longwood Edge Road, Huddersfield, West Yorkshire HD3 3UU (Huddersfield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 605,048 sq. ft. (605,048 sq ft)
- **Type:** Leisure Facility · [object Object]
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; size 605048 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/760556127239345#/?channel=COM_BUY

### Morley Lane, Huddersfield — £650,000 Offers in Region of

- **Address:** Morley Lane, Huddersfield (Huddersfield, Yorkshire)
- **Price:** £650,000 Offers in Region of _(£650,000)_
- **Size:** n/a
- **Type:** Light Industrial · [object Object]
- **Agent:** Boultons, Huddersfield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Citywide Investors; price 650000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/90737562#/?channel=COM_BUY

### Church Lane, Newsome, HD4 — £235,000 Guide Price

- **Address:** Church Lane, Newsome, HD4 (Huddersfield, Yorkshire)
- **Price:** £235,000 Guide Price _(£235,000)_ · auction
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Open House Estate Agents, Nationwide
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/168292289#/?channel=COM_BUY

### Cross Church Street, Huddersfield, West Yorkshire, HD1 — £70,000 Guide Price

- **Address:** Cross Church Street, Huddersfield, West Yorkshire, HD1 (Huddersfield, Yorkshire)
- **Price:** £70,000 Guide Price _(£70,000)_ · auction
- **Size:** n/a
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Auction House, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Citywide Investors; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/89924976#/?channel=COM_BUY

### Chapel Hill, Huddersfield, HD1 — £20,000 Offers in Excess of

- **Address:** Chapel Hill, Huddersfield, HD1 (Huddersfield, Yorkshire)
- **Price:** £20,000 Offers in Excess of _(£20,000)_
- **Size:** 344 sq. ft. (344 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Ezmuve Estate Agents, Batley
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" matches Educating Excellence; keyword hit "chapel"
- **Listing:** https://www.rightmove.co.uk/properties/153894899#/?channel=COM_BUY

### Grand St Leger Hotel, Bennetthorpe, Doncaster, South Yorkshire, DN2 6AX — POA

- **Address:** Grand St Leger Hotel, Bennetthorpe, Doncaster, South Yorkshire, DN2 6AX (Doncaster, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 57,064 sq. ft. (57,064 sq ft)
- **Type:** Shop · [object Object]
- **Agent:** Flint Real Estate, Doncaster
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/760550448149856#/?channel=COM_BUY

### Synergy House, Heavens Walk, Doncaster, South Yorkshire, DN4 5HZ — £1,250,000 Guide Price

- **Address:** Synergy House, Heavens Walk, Doncaster, South Yorkshire, DN4 5HZ (Doncaster, Yorkshire)
- **Price:** £1,250,000 Guide Price _(£1,250,000)_
- **Size:** 9,768 sq. ft. (9,768 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** PPH Commercial Limited, Doncaster
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; price 1250000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/762163510247120#/?channel=COM_BUY

### 1 South Parade, Doncaster, DN1 2DY — £850,000 Offers in Excess of

- **Address:** 1 South Parade, Doncaster, DN1 2DY (Doncaster, Yorkshire)
- **Price:** £850,000 Offers in Excess of _(£850,000)_
- **Size:** 11,038 sq. ft. (11,038 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Savills, Nottingham
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; price 850000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/723050998393024#/?channel=COM_BUY

### Holly House, Kelham Street Industrial Estate, Holly Street, Doncaster, South Yorkshire, DN1 — £800,000 Guide Price

- **Address:** Holly House, Kelham Street Industrial Estate, Holly Street, Doncaster, South Yorkshire, DN1 (Doncaster, Yorkshire)
- **Price:** £800,000 Guide Price _(£800,000)_
- **Size:** 10,587 sq. ft. (10,587 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** PPH Commercial Limited, Doncaster
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; price 800000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/759462174994224#/?channel=COM_BUY

### 40-44 Silver Street, Doncaster, DN1 1HQ — £575,000

- **Address:** 40-44 Silver Street, Doncaster, DN1 1HQ (Doncaster, Yorkshire)
- **Price:** £575,000 _(£575,000)_
- **Size:** 12,000 sq. ft. (12,000 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Barnsdales Ltd - Commercial, Doncaster
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; price 575000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/167469245#/?channel=COM_BUY

### 53-54 Hall Gate, Doncaster, South Yorkshire, DN1 3PB — £500,000 Offers in Excess of

- **Address:** 53-54 Hall Gate, Doncaster, South Yorkshire, DN1 3PB (Doncaster, Yorkshire)
- **Price:** £500,000 Offers in Excess of _(£500,000)_
- **Size:** 14,175 sq. ft. (14,175 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** PPH Commercial Limited, Doncaster
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; price 500000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/759461900310912#/?channel=COM_BUY

### The Cheswold - Brewers Fayre, Doncaster Leisure Park,  Herten Way Bawtry Road, Doncaster, DN4 7NW — £450,000

- **Address:** The Cheswold - Brewers Fayre, Doncaster Leisure Park,  Herten Way Bawtry Road, Doncaster, DN4 7NW (Doncaster, Yorkshire)
- **Price:** £450,000 _(£450,000)_
- **Size:** n/a
- **Type:** Pub · [object Object]
- **Agent:** Christie & Co, Pubs & Restaurants
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/762383459439937#/?channel=COM_BUY

### Yates, 58-59 Hall Gate, Doncaster, DN1 3PB — £375,000 Offers in Excess of

- **Address:** Yates, 58-59 Hall Gate, Doncaster, DN1 3PB (Doncaster, Yorkshire)
- **Price:** £375,000 Offers in Excess of _(£375,000)_
- **Size:** 521–10,996 sq. ft. (10,996 sq ft)
- **Type:** Pub · [object Object]
- **Agent:** Savills, Manchester - Licensed Leisure
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/723056784562097#/?channel=COM_BUY

### Dennison House, Dennison HouseSouth Parade, Doncaster — £300,000 Guide Price

- **Address:** Dennison House, Dennison HouseSouth Parade, Doncaster (Doncaster, Yorkshire)
- **Price:** £300,000 Guide Price _(£300,000)_
- **Size:** 15,000 sq. ft. (15,000 sq ft)
- **Type:** Leisure Facility · [object Object]
- **Agent:** Savills, City Offices
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/751004728136896#/?channel=COM_BUY

### 114/116 Urban Road, Hexthorpe, Doncaster, South Yorkshire, DN4 0EP — £175,000 Guide Price

- **Address:** 114/116 Urban Road, Hexthorpe, Doncaster, South Yorkshire, DN4 0EP (Doncaster, Yorkshire)
- **Price:** £175,000 Guide Price _(£175,000)_
- **Size:** 2,863 sq. ft. (2,863 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** PPH Commercial Limited, Doncaster
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 2863 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/762393335135152#/?channel=COM_BUY

### Licenced Trade, Pubs & Clubs, South Yorkshire — £150,000

- **Address:** Licenced Trade, Pubs & Clubs, South Yorkshire (Doncaster, Yorkshire)
- **Price:** £150,000 _(£150,000)_
- **Size:** n/a
- **Type:** Pub · [object Object]
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/164177684#/?channel=COM_BUY

### 36 Printing Office Street, Doncaster DN1 1TR — £135,000 Guide Price

- **Address:** 36 Printing Office Street, Doncaster DN1 1TR (Doncaster, Yorkshire)
- **Price:** £135,000 Guide Price _(£135,000)_
- **Size:** 1,136 sq. ft. (1,136 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** P&F, Commercial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/174154352#/?channel=COM_BUY

### 159 Balby Road, Balby, Doncaster, South Yorkshire, DN4 0RG — £128,000 Guide Price

- **Address:** 159 Balby Road, Balby, Doncaster, South Yorkshire, DN4 0RG (Doncaster, Yorkshire)
- **Price:** £128,000 Guide Price _(£128,000)_
- **Size:** 2,071 sq. ft. (2,071 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** PPH Commercial Limited, Doncaster
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 2071 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759461405380672#/?channel=COM_BUY

### Unit 1 Total Park, Water Vole Way, Doncaster, South Yorkshire, DN4 5JP — POA

- **Address:** Unit 1 Total Park, Water Vole Way, Doncaster, South Yorkshire, DN4 5JP (Doncaster, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 66,737 sq. ft. (66,737 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** GV&Co, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 66737 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760578690478512#/?channel=COM_BUY

### Units 1A, 1B & 1C, Kings Mews, Frances Street, Off East Laith Gate, Doncaster, South Yorkshire, DN1 — POA

- **Address:** Units 1A, 1B & 1C, Kings Mews, Frances Street, Off East Laith Gate, Doncaster, South Yorkshire, DN1 (Doncaster, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 1,026–4,481 sq. ft. (4,481 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Lambert Smith Hampton, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 4481 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760772618252433#/?channel=COM_BUY

### Doncaster 130, Water Vole Way, Doncaster, South Yorkshire, DN4 5JP — POA

- **Address:** Doncaster 130, Water Vole Way, Doncaster, South Yorkshire, DN4 5JP (Doncaster, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 131,041 sq. ft. (131,041 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** GV&Co, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 131041 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760578669344497#/?channel=COM_BUY

### Unit 2C & 2D Kings Mews, East Laith Gate, Doncaster, South Yorkshire, DN1 — POA

- **Address:** Unit 2C & 2D Kings Mews, East Laith Gate, Doncaster, South Yorkshire, DN1 (Doncaster, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 1,798–3,606 sq. ft. (3,606 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Lambert Smith Hampton, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** size 3606 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760771217418256#/?channel=COM_BUY

### Victoria Road, Balby, Doncaster — £300,000 Offers in Region of

- **Address:** Victoria Road, Balby, Doncaster (Doncaster, Yorkshire)
- **Price:** £300,000 Offers in Region of _(£300,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Welcome Homes, Doncaster
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/90650610#/?channel=COM_BUY

### 50 Waterdale, Doncaster, South Yorkshire, DN1 — £135,000

- **Address:** 50 Waterdale, Doncaster, South Yorkshire, DN1 (Doncaster, Yorkshire)
- **Price:** £135,000 _(£135,000)_
- **Size:** n/a
- **Type:** Office · [object Object]
- **Agent:** Grice and Hunter, Doncaster
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" matches Citywide Investors; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/132310577#/?channel=COM_BUY

### 498-500 Wilbraham Road, Manchester, M21 9AP — £985,000

- **Address:** 498-500 Wilbraham Road, Manchester, M21 9AP (Manchester, Greater Manchester)
- **Price:** £985,000 _(£985,000)_
- **Size:** 5,266 sq. ft. (5,266 sq ft)
- **Type:** Leisure Facility · [object Object]
- **Agent:** Shape and Sate, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 985000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/90799563#/?channel=COM_BUY

### Belmont Oil Works, Lancashire Hill, Stockport, SK4 1RP — POA

- **Address:** Belmont Oil Works, Lancashire Hill, Stockport, SK4 1RP (Manchester, Greater Manchester)
- **Price:** POA _(£300,000)_
- **Size:** 6,824 sq. ft. (6,824 sq ft)
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** MBRE, Stockport
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 6824 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/158222384#/?channel=COM_BUY

### Project Knight, Manchester, Greater Manchester — £30,000,000 Offers in Region of

- **Address:** Project Knight, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** £30,000,000 Offers in Region of _(£30,000,000)_
- **Size:** n/a
- **Type:** Hotel · [object Object]
- **Agent:** Graham & Sibbald, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/761280160375953#/?channel=COM_BUY

### 51-53 Ducie Street, Manchester, Greater Manchester — POA

- **Address:** 51-53 Ducie Street, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** POA _(£20,000,000)_
- **Size:** n/a
- **Type:** Hotel · [object Object]
- **Agent:** Graham & Sibbald, Hotels
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/761280502207440#/?channel=COM_BUY

### Project Sand - C/o Graham  Sibbald, 10 Chapel Walks, Manchester — £7,100,000 Offers in Region of

- **Address:** Project Sand - C/o Graham  Sibbald, 10 Chapel Walks, Manchester (Manchester, Greater Manchester)
- **Price:** £7,100,000 Offers in Region of _(£7,100,000)_
- **Size:** n/a
- **Type:** Hotel · [object Object]
- **Agent:** Graham & Sibbald, Hotels
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; keyword hit "chapel"
- **Listing:** https://www.rightmove.co.uk/properties/761280376582576#/?channel=COM_BUY

### Admiral Business Park, Cawdor Street, Eccles, Manchester, M30 0ZQ — £6,130,000 Offers in Excess of

- **Address:** Admiral Business Park, Cawdor Street, Eccles, Manchester, M30 0ZQ (Manchester, Greater Manchester)
- **Price:** £6,130,000 Offers in Excess of _(£6,130,000)_
- **Size:** 26,275 sq. ft. (26,275 sq ft)
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** Northcap, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 26275 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/87528609#/?channel=COM_BUY

### Sherborne Street, Manchester — POA

- **Address:** Sherborne Street, Manchester (Manchester, Greater Manchester)
- **Price:** POA _(£5,500,000)_
- **Size:** 80,000 sq. ft. (80,000 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** Citrus Commercial Circle, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 80000 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/738315773469473#/?channel=COM_BUY

### Seaford Road, Manchester M6 — £5,500,000 Guide Price

- **Address:** Seaford Road, Manchester M6 (Manchester, Greater Manchester)
- **Price:** £5,500,000 Guide Price _(£5,500,000)_
- **Size:** 154,388 sq. ft. (154,388 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** ESTATE OFFICE INVESTMENTS LIMITED, London
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 154388 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/755829050114448#/?channel=COM_BUY

### Project Veil,  C/o GS , 10 Chapel Walks, Manchester, Greater Manchester — POA

- **Address:** Project Veil,  C/o GS , 10 Chapel Walks, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** POA _(£3,250,000)_
- **Size:** n/a
- **Type:** Leisure Facility · [object Object]
- **Agent:** Graham & Sibbald, Hotels
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; keyword hit "chapel"
- **Listing:** https://www.rightmove.co.uk/properties/760718784387536#/?channel=COM_BUY

### Victoria House, 252 Great Ancoats Street, Manchester, M4 7DB — £2,175,000 Offers in Excess of

- **Address:** Victoria House, 252 Great Ancoats Street, Manchester, M4 7DB (Manchester, Greater Manchester)
- **Price:** £2,175,000 Offers in Excess of _(£2,175,000)_
- **Size:** 2,914 sq. ft. (2,914 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Graham & Sibbald, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 2914 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/760716636883840#/?channel=COM_BUY

### Unit 5, Brightgate Way, Trafford Park, M32 0TB — POA

- **Address:** Unit 5, Brightgate Way, Trafford Park, M32 0TB (Manchester, Greater Manchester)
- **Price:** POA _(£1,300,000)_
- **Size:** 6,520 sq. ft. (6,520 sq ft)
- **Type:** Warehouse · [object Object]
- **Agent:** B8 Real Estate LLP, Warrington
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 1300000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/173747120#/?channel=COM_BUY

### 496, 496a and 496b Wilbraham Road, Manchester, Greater Manchester, M21 — £1,275,000 Offers in Excess of

- **Address:** 496, 496a and 496b Wilbraham Road, Manchester, Greater Manchester, M21 (Manchester, Greater Manchester)
- **Price:** £1,275,000 Offers in Excess of _(£1,275,000)_
- **Size:** n/a
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** BARKER PROUDLOVE LIMITED, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 1275000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/754397735518577#/?channel=COM_BUY

### Prospect House, Moston Lane East, Oldham, Lancashire, M40 3HZ — £295,000

- **Address:** Prospect House, Moston Lane East, Oldham, Lancashire, M40 3HZ (Manchester, Greater Manchester)
- **Price:** £295,000 _(£295,000)_
- **Size:** 1,751 sq. ft. (1,751 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Breakey & Nuttall, Royton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759691767101680#/?channel=COM_BUY

### Broughton St, Cheetham Hill, Manchester M8 — £110,000

- **Address:** Broughton St, Cheetham Hill, Manchester M8 (Manchester, Greater Manchester)
- **Price:** £110,000 _(£110,000)_
- **Size:** 3,500 sq. ft. (3,500 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Citrus Commercial Circle, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 3500 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/739217249077104#/?channel=COM_BUY

### Unit D2, Meadowbank Business Park, Tweedle Way, Oldham, OL9 8EH — £1,000,000

- **Address:** Unit D2, Meadowbank Business Park, Tweedle Way, Oldham, OL9 8EH (Manchester, Greater Manchester)
- **Price:** £1,000,000 _(£1,000,000)_
- **Size:** 7,615 sq. ft. (7,615 sq ft)
- **Type:** Distribution Warehouse · [object Object]
- **Agent:** MBRE, Stockport
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 1000000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/170286875#/?channel=COM_BUY

### Brunswick Mill, Manchester, M40 — £965,000

- **Address:** Brunswick Mill, Manchester, M40 (Manchester, Greater Manchester)
- **Price:** £965,000 _(£965,000)_
- **Size:** 3,976 sq. ft. (3,976 sq ft)
- **Type:** Cafe · [object Object]
- **Agent:** JBrown International, London
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 965000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/172429643#/?channel=COM_BUY

### Lapwing Centre, Waters Edge Business Park, Salford, M5 — £950,000 Guide Price

- **Address:** Lapwing Centre, Waters Edge Business Park, Salford, M5 (Manchester, Greater Manchester)
- **Price:** £950,000 Guide Price _(£950,000)_
- **Size:** 13,288 sq. ft. (13,288 sq ft)
- **Type:** Storage · [object Object]
- **Agent:** Bradley Hall, Newcastle Upon Tyne
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 950000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/156459335#/?channel=COM_BUY

### 64-68 Bury Old Road, Manchester — £750,000 Offers in Region of

- **Address:** 64-68 Bury Old Road, Manchester (Manchester, Greater Manchester)
- **Price:** £750,000 Offers in Region of _(£750,000)_
- **Size:** 5,542 sq. ft. (5,542 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** BARKER PROUDLOVE LIMITED, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 750000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/752027355996960#/?channel=COM_BUY

### Brunswick Mill, Manchester, Lancashire, M40 — £662,000

- **Address:** Brunswick Mill, Manchester, Lancashire, M40 (Manchester, Greater Manchester)
- **Price:** £662,000 _(£662,000)_
- **Size:** 2,612 sq. ft. (2,612 sq ft)
- **Type:** Cafe · [object Object]
- **Agent:** JBrown International, London
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 662000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/172438847#/?channel=COM_BUY

### 13 Shaw Road, Heaton Moor, Stockport, SK4 4AG — £650,000

- **Address:** 13 Shaw Road, Heaton Moor, Stockport, SK4 4AG (Manchester, Greater Manchester)
- **Price:** £650,000 _(£650,000)_
- **Size:** 2,252 sq. ft. (2,252 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** MBRE, Stockport
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 650000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/162163484#/?channel=COM_BUY

### 349-359 Palatine Road, Manchester, Greater Manchester, M22 — £650,000

- **Address:** 349-359 Palatine Road, Manchester, Greater Manchester, M22 (Manchester, Greater Manchester)
- **Price:** £650,000 _(£650,000)_
- **Size:** 1,650–3,300 sq. ft. (3,300 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Thomas Willmax Ltd, Sale
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 650000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/754785660356112#/?channel=COM_BUY

### King Street, Manchester, Greater Manchester, M32 — £550,000

- **Address:** King Street, Manchester, Greater Manchester, M32 (Manchester, Greater Manchester)
- **Price:** £550,000 _(£550,000)_
- **Size:** 3,412 sq. ft. (3,412 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** The Heaton Group, Wigan
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 550000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/755860345883616#/?channel=COM_BUY

### Crescent, Salford, M5 — £240,000 Offers Over

- **Address:** Crescent, Salford, M5 (Manchester, Greater Manchester)
- **Price:** £240,000 Offers Over _(£240,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Miller Metcalfe, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/88634688#/?channel=COM_BUY

### 139 Beech Road, Chorlton, Manchester, M21 9EQ — £600,000 Offers in Region of

- **Address:** 139 Beech Road, Chorlton, Manchester, M21 9EQ (Manchester, Greater Manchester)
- **Price:** £600,000 Offers in Region of _(£600,000)_
- **Size:** 1,593 sq. ft. (1,593 sq ft)
- **Type:** Mixed Use · [object Object]
- **Agent:** W T Gunson, Manchester - BPG
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 600000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/763264613506545#/?channel=COM_BUY

### Brunswick Mill, Manchester, Lancashire, M40 — £587,005

- **Address:** Brunswick Mill, Manchester, Lancashire, M40 (Manchester, Greater Manchester)
- **Price:** £587,005 _(£587,005)_
- **Size:** 2,612 sq. ft. (2,612 sq ft)
- **Type:** Cafe · [object Object]
- **Agent:** JBrown International, London
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 587005 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/172428863#/?channel=COM_BUY

### Bradford Road, Manchester, M40 — £555,000

- **Address:** Bradford Road, Manchester, M40 (Manchester, Greater Manchester)
- **Price:** £555,000 _(£555,000)_
- **Size:** 2,477 sq. ft. (2,477 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** JBrown International, London
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 555000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/172436480#/?channel=COM_BUY

### 106 Barlow Moor Road, Didsbury, Manchester, M20 2PN — £550,000 Offers in Region of

- **Address:** 106 Barlow Moor Road, Didsbury, Manchester, M20 2PN (Manchester, Greater Manchester)
- **Price:** £550,000 Offers in Region of _(£550,000)_
- **Size:** 3,056 sq. ft. (3,056 sq ft)
- **Type:** Mixed Use · [object Object]
- **Agent:** W T Gunson, Manchester - BPG
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 550000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/763127959075569#/?channel=COM_BUY

### 4 The Stables, Wilmslow Road, Parrs Wood, East Didsbury, M20 5PG — £525,000

- **Address:** 4 The Stables, Wilmslow Road, Parrs Wood, East Didsbury, M20 5PG (Manchester, Greater Manchester)
- **Price:** £525,000 _(£525,000)_
- **Size:** 1,319 sq. ft. (1,319 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Williams Sillitoe, Cheshire
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 525000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/171599399#/?channel=COM_BUY

### 193 - 195 Littleton Road, Salford, Greater Manchester M7 3TL — £525,000 Guide Price

- **Address:** 193 - 195 Littleton Road, Salford, Greater Manchester M7 3TL (Manchester, Greater Manchester)
- **Price:** £525,000 Guide Price _(£525,000)_ · auction
- **Size:** n/a
- **Type:** Mixed Use · [object Object]
- **Agent:** Auction House North West, Commercial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; price 525000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/96676537#/?channel=COM_BUY

### 6 Lower Byrom Street, Rosetti Place, Manchester, M3 4AP — £475,000

- **Address:** 6 Lower Byrom Street, Rosetti Place, Manchester, M3 4AP (Manchester, Greater Manchester)
- **Price:** £475,000 _(£475,000)_
- **Size:** 1,405 sq. ft. (1,405 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Avison Young (UK) Limited, Offices
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/150991676#/?channel=COM_BUY

### 11 & 11A Shaw Road, Heaton Moor, Stockport SK4 4AG — £450,000

- **Address:** 11 & 11A Shaw Road, Heaton Moor, Stockport SK4 4AG (Manchester, Greater Manchester)
- **Price:** £450,000 _(£450,000)_
- **Size:** 2,229 sq. ft. (2,229 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Impey & Company Limited, Stockport
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 2229 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/761300559490480#/?channel=COM_BUY

### 5 JJ Thomson Mews Manchester — £425,000

- **Address:** 5 JJ Thomson Mews Manchester (Manchester, Greater Manchester)
- **Price:** £425,000 _(£425,000)_
- **Size:** 1,377–1,378 sq. ft. (1,378 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Ivy Business Centre Ltd, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/761094149273553#/?channel=COM_BUY

### J J Thomson Mews, Manchester — £425,000

- **Address:** J J Thomson Mews, Manchester (Manchester, Greater Manchester)
- **Price:** £425,000 _(£425,000)_
- **Size:** 1,377–1,378 sq. ft. (1,378 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Ivy Business Centre Ltd, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/761086429881265#/?channel=COM_BUY

### 5 JJ Thomson mews — £425,000

- **Address:** 5 JJ Thomson mews (Manchester, Greater Manchester)
- **Price:** £425,000 _(£425,000)_
- **Size:** 1,377–1,378 sq. ft. (1,378 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Ivy Business Centre Ltd, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/761092964608033#/?channel=COM_BUY

### White Lion Inn, 52 Old Church Street, Newton Heath, M40 2JF — £395,000

- **Address:** White Lion Inn, 52 Old Church Street, Newton Heath, M40 2JF (Manchester, Greater Manchester)
- **Price:** £395,000 _(£395,000)_
- **Size:** n/a
- **Type:** Pub · [object Object]
- **Agent:** Christie & Co, Pubs & Restaurants
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/743383260360752#/?channel=COM_BUY

### The Birchin - 1 Joiner Street, Manchester, Greater Manchester — £375,000

- **Address:** The Birchin - 1 Joiner Street, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** £375,000 _(£375,000)_
- **Size:** 2,026 sq. ft. (2,026 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Roger Hannah Ltd, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 2026 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/762209502881712#/?channel=COM_BUY

### Unit 13, Broughton Court Business & Creative Park, 32a Broughton Street, Cheetham Hill, Manchester, M8 8NN — £350,000 Offers in Region of

- **Address:** Unit 13, Broughton Court Business & Creative Park, 32a Broughton Street, Cheetham Hill, Manchester, M8 8NN (Manchester, Greater Manchester)
- **Price:** £350,000 Offers in Region of _(£350,000)_
- **Size:** 2,000 sq. ft. (2,000 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** W T Gunson, Manchester - BPG
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 2000 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/759473334067969#/?channel=COM_BUY

### Unit 13, Broughton Court Business & Creative Park, 32a Broughton Street, Cheetham Hill, Manchester, M8 8NN — £350,000 Offers in Region of

- **Address:** Unit 13, Broughton Court Business & Creative Park, 32a Broughton Street, Cheetham Hill, Manchester, M8 8NN (Manchester, Greater Manchester)
- **Price:** £350,000 Offers in Region of _(£350,000)_
- **Size:** 2,000 sq. ft. (2,000 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** W T Gunson, Manchester - BPG
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 2000 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/759471817838288#/?channel=COM_BUY

### Meadow Mill, Water Street, Stockport, Cheshire, SK1 — £350,000 Guide Price

- **Address:** Meadow Mill, Water Street, Stockport, Cheshire, SK1 (Manchester, Greater Manchester)
- **Price:** £350,000 Guide Price _(£350,000)_
- **Size:** 3,836 sq. ft. (3,836 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** JBrown International, London
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 3836 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/90807921#/?channel=COM_BUY

### Leicester Road, Salford — £350,000

- **Address:** Leicester Road, Salford (Manchester, Greater Manchester)
- **Price:** £350,000 _(£350,000)_
- **Size:** 797 sq. ft. (797 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** S&S Property Group, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173188196#/?channel=COM_BUY

### Great Stone Road, Manchester — £325,000

- **Address:** Great Stone Road, Manchester (Manchester, Greater Manchester)
- **Price:** £325,000 _(£325,000)_
- **Size:** n/a
- **Type:** Retail Property (out of town) · [object Object]
- **Agent:** Thomas Willmax Ltd, Sale
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/756911484581264#/?channel=COM_BUY

### Albany Road, Manchester, Greater Manchester, M21 — £295,000

- **Address:** Albany Road, Manchester, Greater Manchester, M21 (Manchester, Greater Manchester)
- **Price:** £295,000 _(£295,000)_
- **Size:** n/a
- **Type:** Commercial Development · [object Object]
- **Agent:** Thomas Willmax Ltd, Sale
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/754785658257888#/?channel=COM_BUY

### Chadwick Road, Eccles, Manchester, Greater Manchester, M30 0WU — £265,000 Guide Price

- **Address:** Chadwick Road, Eccles, Manchester, Greater Manchester, M30 0WU (Manchester, Greater Manchester)
- **Price:** £265,000 Guide Price _(£265,000)_ · auction
- **Size:** 3,046 sq. ft. (3,046 sq ft)
- **Type:** Heavy Industrial · [object Object]
- **Agent:** Pattinsons, Pattinsons Auction- National Auctioneer
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 3046 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/90271293#/?channel=COM_BUY

### 7 Burton Place, Manchester, M15 4PT — POA

- **Address:** 7 Burton Place, Manchester, M15 4PT (Manchester, Greater Manchester)
- **Price:** POA _(£260,000)_
- **Size:** 1,220 sq. ft. (1,220 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Savills, Manchester Offices
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/723058034408753#/?channel=COM_BUY

### Unit, R/o 2a Moss Lane, Swinton M27 9SA — £250,000

- **Address:** Unit, R/o 2a Moss Lane, Swinton M27 9SA (Manchester, Greater Manchester)
- **Price:** £250,000 _(£250,000)_
- **Size:** 1,400 sq. ft. (1,400 sq ft)
- **Type:** Light Industrial · [object Object]
- **Agent:** To Let, To Let Bolton
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/88362378#/?channel=COM_BUY

### Unit  137 Fairfield Street  Manchester  M12 6FJ  United Kingdom — POA

- **Address:** Unit  137 Fairfield Street  Manchester  M12 6FJ  United Kingdom (Manchester, Greater Manchester)
- **Price:** POA _(£250,000)_
- **Size:** 2,634 sq. ft. (2,634 sq ft)
- **Type:** Industrial Park · [object Object]
- **Agent:** Colliers International, Industrial - Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 2634 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/168980207#/?channel=COM_BUY

### Post Office/General Store in Salford, Manchester — £245,000

- **Address:** Post Office/General Store in Salford, Manchester (Manchester, Greater Manchester)
- **Price:** £245,000 _(£245,000)_
- **Size:** n/a
- **Type:** Post Office · [object Object]
- **Agent:** Harvey Silver Hodgkinson, Hale
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/171635576#/?channel=COM_BUY

### 7 Burton Place, Castlefield, Manchester, M15 4PT — £245,000 Offers in Region of

- **Address:** 7 Burton Place, Castlefield, Manchester, M15 4PT (Manchester, Greater Manchester)
- **Price:** £245,000 Offers in Region of _(£245,000)_
- **Size:** 1,070 sq. ft. (1,070 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Canning O'Neill, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/89607567#/?channel=COM_BUY

### Grimshaw Street, Manchester, M35 — £240,000

- **Address:** Grimshaw Street, Manchester, M35 (Manchester, Greater Manchester)
- **Price:** £240,000 _(£240,000)_
- **Size:** 1,454 sq. ft. (1,454 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Kirkham Property, Chadderton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/173091599#/?channel=COM_BUY

### Bolton Road, Manchester — £225,000

- **Address:** Bolton Road, Manchester (Manchester, Greater Manchester)
- **Price:** £225,000 _(£225,000)_
- **Size:** n/a
- **Type:** Shop · [object Object]
- **Agent:** Thomas Willmax Ltd, Sale
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/762030468968897#/?channel=COM_BUY

### Cafe/Dessert Bar in Manchester, Manchester — £199,000

- **Address:** Cafe/Dessert Bar in Manchester, Manchester (Manchester, Greater Manchester)
- **Price:** £199,000 _(£199,000)_
- **Size:** n/a
- **Type:** Restaurant · [object Object]
- **Agent:** Harvey Silver Hodgkinson, Hale
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/171635807#/?channel=COM_BUY

### 32 Beech Road, Chorlton-cum-Hardy, Manchester, M21 9EL — £165,000 Offers in Region of

- **Address:** 32 Beech Road, Chorlton-cum-Hardy, Manchester, M21 9EL (Manchester, Greater Manchester)
- **Price:** £165,000 Offers in Region of _(£165,000)_
- **Size:** 3,127 sq. ft. (3,127 sq ft)
- **Type:** Leisure Facility · [object Object]
- **Agent:** Regional Property Solutions, Cheshire
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" matches Educating Excellence; size 3127 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/87880203#/?channel=COM_BUY

### Brief Street, Tonge Moor, BL2 — £45,000 Guide Price

- **Address:** Brief Street, Tonge Moor, BL2 (Bolton, Greater Manchester)
- **Price:** £45,000 Guide Price _(£45,000)_ · auction
- **Size:** 1,044 sq. ft. (1,044 sq ft)
- **Type:** Residential Development · [object Object]
- **Agent:** Miller Metcalfe, Bolton
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/89914305#/?channel=COM_BUY

### Grocery Store With Food Takeaway & Accommodation [BL1 7DA] — £499,995

- **Address:** Grocery Store With Food Takeaway & Accommodation [BL1 7DA] (Bolton, Greater Manchester)
- **Price:** £499,995 _(£499,995)_
- **Size:** n/a
- **Type:** Convenience Store · [object Object]
- **Agent:** Blacks Business Brokers, Bury
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/754386742101056#/?channel=COM_BUY

### Bark Street East, Bolton, BL1 — £185,000 Guide Price

- **Address:** Bark Street East, Bolton, BL1 (Bolton, Greater Manchester)
- **Price:** £185,000 Guide Price _(£185,000)_ · auction
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Miller Metcalfe, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/88634079#/?channel=COM_BUY

### Bradshaw Road, Bolton, BL2 — £4,000,000 Offers in Region of

- **Address:** Bradshaw Road, Bolton, BL2 (Bolton, Greater Manchester)
- **Price:** £4,000,000 Offers in Region of _(£4,000,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Miller Metcalfe, Bolton
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/88640241#/?channel=COM_BUY

### The Cherry Tree Restaurant & Bar, A6 Chorley Road, Blackrod, Bolton, Lancashire — £1,950,000 Offers Over

- **Address:** The Cherry Tree Restaurant & Bar, A6 Chorley Road, Blackrod, Bolton, Lancashire (Bolton, Greater Manchester)
- **Price:** £1,950,000 Offers Over _(£1,950,000)_
- **Size:** n/a
- **Type:** Restaurant · [object Object]
- **Agent:** Graham & Sibbald, Hotels
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; price 1950000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/170561762#/?channel=COM_BUY

### 225 Folds Road, Bolton, Lancashire, BL1 — £1,950,000

- **Address:** 225 Folds Road, Bolton, Lancashire, BL1 (Bolton, Greater Manchester)
- **Price:** £1,950,000 _(£1,950,000)_
- **Size:** 74,960 sq. ft. (74,960 sq ft)
- **Type:** Commercial Development · [object Object]
- **Agent:** Fletcher CRE LTD, Bolton
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; price 1950000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/763058824350608#/?channel=COM_BUY

### Restaurant & Property in Horwich, Lancashire — £750,000

- **Address:** Restaurant & Property in Horwich, Lancashire (Bolton, Greater Manchester)
- **Price:** £750,000 _(£750,000)_
- **Size:** n/a
- **Type:** Restaurant · [object Object]
- **Agent:** Harvey Silver Hodgkinson, Hale
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; price 750000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/171635024#/?channel=COM_BUY

### NW-524523 - Millstone & Bank Street Bar & Pub , 12 Crown Street, Bolton BL1 2RU — £425,000

- **Address:** NW-524523 - Millstone & Bank Street Bar & Pub , 12 Crown Street, Bolton BL1 2RU (Bolton, Greater Manchester)
- **Price:** £425,000 _(£425,000)_
- **Size:** n/a
- **Type:** Pub · [object Object]
- **Agent:** Fleurets Limited, North West
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/170845592#/?channel=COM_BUY

### Shady Lane, Bolton, BL7 — £375,000 Guide Price

- **Address:** Shady Lane, Bolton, BL7 (Bolton, Greater Manchester)
- **Price:** £375,000 Guide Price _(£375,000)_ · auction
- **Size:** n/a
- **Type:** Commercial Development · [object Object]
- **Agent:** Miller Metcalfe, Bolton
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/88637187#/?channel=COM_BUY

### Belmont Road, Bolton — £225,000

- **Address:** Belmont Road, Bolton (Bolton, Greater Manchester)
- **Price:** £225,000 _(£225,000)_
- **Size:** 1,035–1,036 sq. ft. (1,036 sq ft)
- **Type:** Trade Counter · [object Object]
- **Agent:** Portfolio Lets Limited, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/744650347032512#/?channel=COM_BUY

### 37-39 Market Street, Westhoughton, Bolton, BL5 3AG — £325,000

- **Address:** 37-39 Market Street, Westhoughton, Bolton, BL5 3AG (Bolton, Greater Manchester)
- **Price:** £325,000 _(£325,000)_
- **Size:** n/a
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760715487650753#/?channel=COM_BUY

### 39 New Hall Lane, Bolton, Lancashire, BL1 5LW — £285,000

- **Address:** 39 New Hall Lane, Bolton, Lancashire, BL1 5LW (Bolton, Greater Manchester)
- **Price:** £285,000 _(£285,000)_
- **Size:** 995 sq. ft. (995 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760715250726545#/?channel=COM_BUY

### Carlton Street, Bolton, Greater Manchester, BL2 1BT — £280,000 Guide Price

- **Address:** Carlton Street, Bolton, Greater Manchester, BL2 1BT (Bolton, Greater Manchester)
- **Price:** £280,000 Guide Price _(£280,000)_ · auction
- **Size:** n/a
- **Type:** Land · [object Object]
- **Agent:** Pattinsons, Pattinsons Auction- National Auctioneer
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/89878686#/?channel=COM_BUY

### 432 Halliwell Road, Bolton — £165,000

- **Address:** 432 Halliwell Road, Bolton (Bolton, Greater Manchester)
- **Price:** £165,000 _(£165,000)_
- **Size:** 1,065 sq. ft. (1,065 sq ft)
- **Type:** Retail Property (high street) · [object Object]
- **Agent:** Roger Hannah Ltd, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/760768253954929#/?channel=COM_BUY

### Travis Perkins  Bark Street  Bolton  BL1 2BB  United Kingdom — POA

- **Address:** Travis Perkins  Bark Street  Bolton  BL1 2BB  United Kingdom (Bolton, Greater Manchester)
- **Price:** POA _(£1)_
- **Size:** 8,793 sq. ft. (8,793 sq ft)
- **Type:** Industrial Park · [object Object]
- **Agent:** Colliers International, Industrial - Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; size 8793 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/173634371#/?channel=COM_BUY

### Land & Building Bolton Road Mill Bolton Road Westhoughton BL5 3JQ *Purchase of the business is subject to negotiation* — POA

- **Address:** Land & Building Bolton Road Mill Bolton Road Westhoughton BL5 3JQ *Purchase of the business is subject to negotiation* (Bolton, Greater Manchester)
- **Price:** POA _(£530,000)_
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Adore Properties, Bolton
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; price 530000 within budget 500000-2000000
- **Listing:** https://www.rightmove.co.uk/properties/169010453#/?channel=COM_BUY

### 51-53 Church Street, Little Lever, Bolton, Lancashire, BL3 — £275,000 Guide Price

- **Address:** 51-53 Church Street, Little Lever, Bolton, Lancashire, BL3 (Bolton, Greater Manchester)
- **Price:** £275,000 Guide Price _(£275,000)_ · auction
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** EweMove, Hyde & Dukinfield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/162858287#/?channel=COM_BUY

### Church Street, Westhoughton, BL5 3SF — £210,000 Guide Price

- **Address:** Church Street, Westhoughton, BL5 3SF (Bolton, Greater Manchester)
- **Price:** £210,000 Guide Price _(£210,000)_ · auction
- **Size:** n/a
- **Type:** Commercial Property · [object Object]
- **Agent:** Adore Properties, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/90697782#/?channel=COM_BUY

### Deane Road, Bolton — £205,000

- **Address:** Deane Road, Bolton (Bolton, Greater Manchester)
- **Price:** £205,000 _(£205,000)_
- **Size:** 570 sq. ft. (570 sq ft)
- **Type:** Office · [object Object]
- **Agent:** Open House Estate Agents, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/88802187#/?channel=COM_BUY

### New Hall Lane, Bolton, Greater Manchester, BL1 — £195,000

- **Address:** New Hall Lane, Bolton, Greater Manchester, BL1 (Bolton, Greater Manchester)
- **Price:** £195,000 _(£195,000)_
- **Size:** n/a
- **Type:** Office · [object Object]
- **Agent:** Regency Estates, Horwich
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Citywide Investors; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/89901873#/?channel=COM_BUY

### Higher Bridge Street, Bolton City Centre (Double Fronted Commercial Unit) — £185,000 Guide Price

- **Address:** Higher Bridge Street, Bolton City Centre (Double Fronted Commercial Unit) (Bolton, Greater Manchester)
- **Price:** £185,000 Guide Price _(£185,000)_ · auction
- **Size:** 2,400 sq. ft. (2,400 sq ft)
- **Type:** Commercial Property · [object Object]
- **Agent:** Hunters, Darwen
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" matches Educating Excellence; size 2400 >= min 2000
- **Listing:** https://www.rightmove.co.uk/properties/89968065#/?channel=COM_BUY

## Scraped but did not pass Stage-0

219 listings scored below the bar. (Summarised rather than listed row-by-row — the Barnsdales report had 2 failures; this pull has hundreds.)

| Best score | Listings | Typical shortfall |
|---|---|---|
| 1/2 | 219 | geography only — price outside/unknown, size below/unknown, no keyword |

