# Rightmove Commercial — live for-sale pull + Stage-0 filter

**Date:** 2026-07-17 · **Source:** rightmove.co.uk commercial-property-for-sale (search pages, `__NEXT_DATA__` plain JSON) · **Mode:** read-only live pull

Searched **7 cities** (Citywide footprint: Yorkshire + Greater Manchester). Portal reports **871** matching results across those searches; fetched a capped **557** (max 5 pages/city, 1.5 s between requests), **557** after cross-city dedupe. **93** business-for-sale going concerns excluded by subtype, leaving **464** investable listings. Stage-0 (minimum bar **2**, geography excluded from scoring — see below) passed **187**.

## Changes in this run (vs the corrected 2026-07-14 pull: 123/425 passed)

Two changes since the corrected 07-14 run, both raising the pass count for stated reasons:

- **Pubs, bars/nightclubs and hotels kept in** (decision 2026-07-17): at Citywide's price band a large freehold pub/hotel is genuine C2R conversion stock; the price+keyword bar filters small trading businesses. Effect: ~37 listings back in the pool, **8 of the passes below are pubs/bars/hotels** (e.g. the former Revolution bar in Huddersfield, a £1.2m Bolton pub).
- **Tenure-parsing fix**: Rightmove serves tenure as `{tenureType}` on many listings; a bug rendered it `[object Object]` and dropped it from keyword matching. With the fix, `FREEHOLD` tenure correctly triggers the spec §6 `freehold` keyword — this alone accounts for most of the rise from 127 to **187** passes. If "price-in-band + freehold" feels too permissive as a portal pass, that's a keyword-tuning decision for Ahmed (e.g. remove `freehold` from the global list for geo-prescoped pulls), not a bug.

## Corrections applied in this run (vs the first 2026-07-14 pull)

The first pull passed **335 of 554 (60%)** — inflated, because the searches were already geo-scoped, so every listing collected the geography point for free and the effective bar collapsed to a single keyword hit (all 219 failures scored exactly 1, geography-only). Two fixes applied for this run:

1. **Portal-aware Stage-0 (`geoPrescoped`)** — geography earns no point on a geo-scoped pull; it acts as a precondition instead (a listing outside a requirement's territory cannot match that requirement at all). The 2-point bar now applies to price/size/keywords only.
2. **Going-concern subtype filter** — business-for-sale listings (cafés, restaurants, takeaways, salons, convenience stores, guest houses/B&Bs, ...) are excluded before scoring. Premises and development stock (offices, industrial, retail property, mixed use, commercial/residential development, land) are kept — **as are pubs, bars/nightclubs and hotels** (decision 2026-07-14: at Citywide's price band a large freehold pub/hotel is genuine C2R conversion stock, and the price+keyword bar filters small trading businesses anyway).

Excluded by subtype:

| Subtype | Excluded |
|---|---|
| Restaurant | 36 |
| Cafe | 30 |
| Takeaway | 18 |
| Convenience Store | 7 |
| Hairdresser / Barber Shop | 1 |
| Post Office | 1 |

| City | Region | Portal results | Fetched (deduped) |
|---|---|---|---|
| Leeds | Yorkshire | 224 | 118 |
| Sheffield | Yorkshire | 166 | 114 |
| Bradford | Yorkshire | 77 | 58 |
| Huddersfield | Yorkshire | 58 | 45 |
| Doncaster | Yorkshire | 47 | 45 |
| Manchester | Greater Manchester | 225 | 122 |
| Bolton | Greater Manchester | 74 | 55 |

> robots.txt (checked at pull time) does **not** disallow the commercial `find.html` search path (only contact/map/photo/full-description paths). Portal ToS may still restrict automated collection — in the CAIS pipeline Rightmove remains a route-to-review portal source (spec §4/§5); this was an explicit low-volume read-only pull.

## Agent coverage

**155 distinct agents/branches** appear in the 557 fetched listings (counted before the subtype filter — coverage is a property of the portal, not of our filtering) — vs one agent per bespoke source. 91 distinct agents appear in the Stage-0-passed set.

Top agents by listing count:

| Agent / branch | Listings |
|---|---|
| Ernest Wilson & Co Limited, EW Leeds | 104 |
| BTG Eddisons Property Auctions, Commercial Nationwide | 23 |
| Crosthwaite Commercial Limited, Sheffield | 18 |
| Harvey Silver Hodgkinson, Hale | 15 |
| Alan J Picken, Ilkley | 12 |
| Eddisons Commercial Limited, Sheffield | 12 |
| Knight Frank, Sheffield | 12 |
| Carter Towler, Leeds | 10 |
| Christie & Co, Pubs & Restaurants | 10 |
| W T Gunson, Manchester - BPG | 9 |
| JBrown International, London | 9 |
| BRAMLEYS LLP, Huddersfield | 8 |
| PPH Commercial Limited, Doncaster | 8 |
| Lamb & Swift Commercial, Bolton | 8 |
| Sanderson Weatherall, Leeds | 7 |

## Passed the filter

### 13-14 Park Place, Leeds, LS1 2SJ — £1,013,000 Offers in Excess of

- **Address:** 13-14 Park Place, Leeds, LS1 2SJ (Leeds, Yorkshire)
- **Price:** £1,013,000 Offers in Excess of _(£1,013,000)_
- **Size:** 5,858 sq. ft. (5,858 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Northcap, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1013000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90125763#/?channel=COM_BUY

### 1-2 Deanhurst Park, Gelderd Road, Gildersome, Morley, Leeds — £725,000

- **Address:** 1-2 Deanhurst Park, Gelderd Road, Gildersome, Morley, Leeds (Leeds, Yorkshire)
- **Price:** £725,000 _(£725,000)_
- **Size:** 5,242 sq. ft. (5,242 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Crans Property Consultants, Huddersfield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 725000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/747152224116992#/?channel=COM_BUY

### 1 City West Gelderd Road, Leeds, LS12 6NJ — £995,000 Offers in Region of

- **Address:** 1 City West Gelderd Road, Leeds, LS12 6NJ (Leeds, Yorkshire)
- **Price:** £995,000 Offers in Region of _(£995,000)_
- **Size:** 550–9,210 sq. ft. (9,210 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 995000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/762214045440304#/?channel=COM_BUY

### Laurel House 146-148 Garnet Road, Leeds, LS11 5HP — £2,000,000 Offers in Region of

- **Address:** Laurel House 146-148 Garnet Road, Leeds, LS11 5HP (Leeds, Yorkshire)
- **Price:** £2,000,000 Offers in Region of _(£2,000,000)_
- **Size:** 575–53,252 sq. ft. (53,252 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 2000000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/698587804331425#/?channel=COM_BUY

### Tannery Square, Meanwood, Leeds, LS6 4LT — £2,000,000 Offers in Region of

- **Address:** Tannery Square, Meanwood, Leeds, LS6 4LT (Leeds, Yorkshire)
- **Price:** £2,000,000 Offers in Region of _(£2,000,000)_
- **Size:** 7,811 sq. ft. (7,811 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Fox Lloyd Jones, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 2000000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/751133814140048#/?channel=COM_BUY

### Haigh House, The Grange, Three Cottages, Barn, Stables, Lake and 14 Acres of Land, Wakefield Road, Rothwell Haigh, LS26 — £1,850,000 Offers in Region of

- **Address:** Haigh House, The Grange, Three Cottages, Barn, Stables, Lake and 14 Acres of Land, Wakefield Road, Rothwell Haigh, LS26 (Leeds, Yorkshire)
- **Price:** £1,850,000 Offers in Region of _(£1,850,000)_
- **Size:** n/a
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Simon Blyth Estate Agents, Holmfirth
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1850000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/89659935#/?channel=COM_BUY

### 43 Park Place, Leeds, LS1 2RY — £1,800,000

- **Address:** 43 Park Place, Leeds, LS1 2RY (Leeds, Yorkshire)
- **Price:** £1,800,000 _(£1,800,000)_
- **Size:** 8,997 sq. ft. (8,997 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Knight Frank, Leeds - Commercial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1800000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/154042034#/?channel=COM_BUY

### Carlton Trading Estate, Pickering Street, Armley, Leeds — £1,660,000 Offers in Region of

- **Address:** Carlton Trading Estate, Pickering Street, Armley, Leeds (Leeds, Yorkshire)
- **Price:** £1,660,000 Offers in Region of _(£1,660,000)_
- **Size:** 57,675 sq. ft. (57,675 sq ft)
- **Type:** Industrial Park · FREEHOLD
- **Agent:** Northcap, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1660000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/747888028746705#/?channel=COM_BUY

### Haulage, West Yorkshire, West Yorkshire — £1,500,000

- **Address:** Haulage, West Yorkshire, West Yorkshire (Leeds, Yorkshire)
- **Price:** £1,500,000 _(£1,500,000)_
- **Size:** n/a
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/153559232#/?channel=COM_BUY

### 26-27 Park Square West, Leeds, LS1 2PL — £1,500,000 Offers in Excess of

- **Address:** 26-27 Park Square West, Leeds, LS1 2PL (Leeds, Yorkshire)
- **Price:** £1,500,000 Offers in Excess of _(£1,500,000)_
- **Size:** 5,856 sq. ft. (5,856 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/698589182145520#/?channel=COM_BUY

### 26/27 Park Square West, Leeds, LS1 2PL — £1,500,000 Offers in Excess of

- **Address:** 26/27 Park Square West, Leeds, LS1 2PL (Leeds, Yorkshire)
- **Price:** £1,500,000 Offers in Excess of _(£1,500,000)_
- **Size:** 5,856 sq. ft. (5,856 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Fox Lloyd Jones, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/721600241041920#/?channel=COM_BUY

### United House, 170 Elland Road, Leeds, LS11 8BU — £1,450,000

- **Address:** United House, 170 Elland Road, Leeds, LS11 8BU (Leeds, Yorkshire)
- **Price:** £1,450,000 _(£1,450,000)_
- **Size:** 9,765 sq. ft. (9,765 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1450000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90605949#/?channel=COM_BUY

### Building/Home Improvement, West Yorkshire, West Yorkshire — £1,400,000

- **Address:** Building/Home Improvement, West Yorkshire, West Yorkshire (Leeds, Yorkshire)
- **Price:** £1,400,000 _(£1,400,000)_
- **Size:** n/a
- **Type:** Residential Development · FREEHOLD
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1400000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/170335808#/?channel=COM_BUY

### Romero House 8 Airport West, Lancaster Way, Yeadon, Leeds, West Yorkshire, LS19 — £1,000,000 Offers in Excess of

- **Address:** Romero House 8 Airport West, Lancaster Way, Yeadon, Leeds, West Yorkshire, LS19 (Leeds, Yorkshire)
- **Price:** £1,000,000 Offers in Excess of _(£1,000,000)_
- **Size:** 12,447 sq. ft. (12,447 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Carter Jonas, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1000000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/763663953304416#/?channel=COM_BUY

### Industrial / Warehouse Unit  Cross Chancellor Street  Leeds West Yorkshire — POA

- **Address:** Industrial / Warehouse Unit  Cross Chancellor Street  Leeds West Yorkshire (Leeds, Yorkshire)
- **Price:** POA _(£1,000,000)_
- **Size:** 18,818 sq. ft. (18,818 sq ft)
- **Type:** Industrial Park · FREEHOLD
- **Agent:** Colliers International, Industrial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1000000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/169014953#/?channel=COM_BUY

### Pavilion Court, Green Lane, Garforth, Leeds, LS25 2AF — £900,000

- **Address:** Pavilion Court, Green Lane, Garforth, Leeds, LS25 2AF (Leeds, Yorkshire)
- **Price:** £900,000 _(£900,000)_
- **Size:** 6,055 sq. ft. (6,055 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 900000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/88691562#/?channel=COM_BUY

### Hawthorn Park, Coal Road, Whinmoor, Leeds — £900,000

- **Address:** Hawthorn Park, Coal Road, Whinmoor, Leeds (Leeds, Yorkshire)
- **Price:** £900,000 _(£900,000)_
- **Size:** 6,800 sq. ft. (6,800 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** NABARRO MCALLISTER & CO LIMITED, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 900000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/758741004284305#/?channel=COM_BUY

### Oxford Chambers, Oxford Place, Leeds, LS1 3AX — £850,000

- **Address:** Oxford Chambers, Oxford Place, Leeds, LS1 3AX (Leeds, Yorkshire)
- **Price:** £850,000 _(£850,000)_
- **Size:** n/a
- **Type:** Land · FREEHOLD
- **Agent:** Knight Frank, Leeds - Commercial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 850000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/169402238#/?channel=COM_BUY

### 60 Wellington Street, Leeds, LS1 2EE — £795,000 Offers in Region of

- **Address:** 60 Wellington Street, Leeds, LS1 2EE (Leeds, Yorkshire)
- **Price:** £795,000 Offers in Region of _(£795,000)_
- **Size:** 3,003 sq. ft. (3,003 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 795000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90853236#/?channel=COM_BUY

### 3365 The Pentagon, Century Way, Thorpe Park, Leeds, LS15 8ZB — £775,000 Offers in Region of

- **Address:** 3365 The Pentagon, Century Way, Thorpe Park, Leeds, LS15 8ZB (Leeds, Yorkshire)
- **Price:** £775,000 Offers in Region of _(£775,000)_
- **Size:** 3,887 sq. ft. (3,887 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Knight Frank, Leeds - Commercial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 775000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/170303204#/?channel=COM_BUY

### 6-8 The Headrow, Leeds, LS1 6PT — £725,000 Offers in Region of

- **Address:** 6-8 The Headrow, Leeds, LS1 6PT (Leeds, Yorkshire)
- **Price:** £725,000 Offers in Region of _(£725,000)_
- **Size:** 5,275 sq. ft. (5,275 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 725000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173139890#/?channel=COM_BUY

### Unit 7 Weaver Street, Leeds, West Yorkshire, LS4 2AU — £695,000 From

- **Address:** Unit 7 Weaver Street, Leeds, West Yorkshire, LS4 2AU (Leeds, Yorkshire)
- **Price:** £695,000 From _(£695,000)_
- **Size:** 7,244–14,488 sq. ft. (14,488 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** GV&Co, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 695000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760579420307808#/?channel=COM_BUY

### 2 Moorland Road, Hyde Park, Leeds, LS6 1AL — £650,000 Offers in Region of

- **Address:** 2 Moorland Road, Hyde Park, Leeds, LS6 1AL (Leeds, Yorkshire)
- **Price:** £650,000 Offers in Region of _(£650,000)_
- **Size:** 3,779 sq. ft. (3,779 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 650000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/722868246358240#/?channel=COM_BUY

### Former Dixons Automotives, Wakefield Road, Rothwell, Leeds, West Yorkshire, LS26 0SB — £625,000 Offers in Region of

- **Address:** Former Dixons Automotives, Wakefield Road, Rothwell, Leeds, West Yorkshire, LS26 0SB (Leeds, Yorkshire)
- **Price:** £625,000 Offers in Region of _(£625,000)_
- **Size:** 9,596 sq. ft. (9,596 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 625000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760575595098784#/?channel=COM_BUY

### Post Office, High Street, Wetherby, Leeds — £595,000 Guide Price

- **Address:** Post Office, High Street, Wetherby, Leeds (Leeds, Yorkshire)
- **Price:** £595,000 Guide Price _(£595,000)_
- **Size:** 2,141 sq. ft. (2,141 sq ft)
- **Type:** Mixed Use · FREEHOLD
- **Agent:** Malcolm Stuart Property Consultants LLP, Tadcaster
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 595000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/762347564791921#/?channel=COM_BUY

### 82 York Road, Leeds, LS9 9AA — £595,000

- **Address:** 82 York Road, Leeds, LS9 9AA (Leeds, Yorkshire)
- **Price:** £595,000 _(£595,000)_
- **Size:** 5,982 sq. ft. (5,982 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Citywide Investors territory (prescoped — not scored); price 595000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/89173143#/?channel=COM_BUY

### Lifestyle House 2 Melbourne Avenue, Sheffield, S10 2QH — £1,500,000 Offers in Excess of

- **Address:** Lifestyle House 2 Melbourne Avenue, Sheffield, S10 2QH (Sheffield, Yorkshire)
- **Price:** £1,500,000 Offers in Excess of _(£1,500,000)_
- **Size:** 17,685 sq. ft. (17,685 sq ft)
- **Type:** Residential Development · FREEHOLD
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/698589255316017#/?channel=COM_BUY

### Unit 3 Waterside Court, Bold Street, Sheffield, South Yorkshire, S9 2LR — £650,000 Guide Price

- **Address:** Unit 3 Waterside Court, Bold Street, Sheffield, South Yorkshire, S9 2LR (Sheffield, Yorkshire)
- **Price:** £650,000 Guide Price _(£650,000)_ · auction
- **Size:** n/a
- **Type:** Office · FREEHOLD
- **Agent:** Auction Estates Ltd, Nottingham
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 650000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90471561#/?channel=COM_BUY

### 24 Meadowhall Road, Sheffield, South Yorkshire, S9 1BS — POA

- **Address:** 24 Meadowhall Road, Sheffield, South Yorkshire, S9 1BS (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 6,286 sq. ft. (6,286 sq ft)
- **Type:** Showroom
- **Agent:** Flint Real Estate, Doncaster
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 6286 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760551129667441#/?channel=COM_BUY

### Endeavour, Sheffield Digital Campus, Sheffield, South Yorkshire, S1 — £25,460,000

- **Address:** Endeavour, Sheffield Digital Campus, Sheffield, South Yorkshire, S1 (Sheffield, Yorkshire)
- **Price:** £25,460,000 _(£25,460,000)_
- **Size:** 65,511 sq. ft. (65,511 sq ft)
- **Type:** Office · LEASEHOLD
- **Agent:** Lambert Smith Hampton, Living & Capital Markets
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 65511 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760930151971185#/?channel=COM_BUY

### Parkway Plaza, Prince Of Wales Road , Sheffield, S9 4EU — £6,750,000 From

- **Address:** Parkway Plaza, Prince Of Wales Road , Sheffield, S9 4EU (Sheffield, Yorkshire)
- **Price:** £6,750,000 From _(£6,750,000)_
- **Size:** 40,000–85,000 sq. ft. (85,000 sq ft)
- **Type:** Office
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 85000 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759291330487233#/?channel=COM_BUY

### Aspect Court, Pond Street, Sheffield, S1 2BG — £6,000,000

- **Address:** Aspect Court, Pond Street, Sheffield, S1 2BG (Sheffield, Yorkshire)
- **Price:** £6,000,000 _(£6,000,000)_
- **Size:** 57,842 sq. ft. (57,842 sq ft)
- **Type:** Office
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 57842 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/760571878944801#/?channel=COM_BUY

### WILSON CARLILE CENTRE, 50 CAVENDISH STREET, SHEFFIELD, YORKSHIRE, S3 — £3,000,000 Guide Price

- **Address:** WILSON CARLILE CENTRE, 50 CAVENDISH STREET, SHEFFIELD, YORKSHIRE, S3 (Sheffield, Yorkshire)
- **Price:** £3,000,000 Guide Price _(£3,000,000)_
- **Size:** 22,881 sq. ft. (22,881 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Bruton Knowles, Gloucester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 22881 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760730285095312#/?channel=COM_BUY

### Pheasant Works, Surbiton Street, Sheffield, South Yorkshire, S9 5AQ — £2,800,000

- **Address:** Pheasant Works, Surbiton Street, Sheffield, South Yorkshire, S9 5AQ (Sheffield, Yorkshire)
- **Price:** £2,800,000 _(£2,800,000)_
- **Size:** 35,523 sq. ft. (35,523 sq ft)
- **Type:** Light Industrial
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 35523 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/762397808152992#/?channel=COM_BUY

### Glossop Road, Sheffield — POA

- **Address:** Glossop Road, Sheffield (Sheffield, Yorkshire)
- **Price:** POA _(£2,600,000)_
- **Size:** 1,222–22,259 sq. ft. (22,259 sq ft)
- **Type:** Residential Development · FREEHOLD
- **Agent:** Fowler Sandford LLP, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 22259 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760773543125345#/?channel=COM_BUY

### Queen Street, Sheffield — £2,250,000

- **Address:** Queen Street, Sheffield (Sheffield, Yorkshire)
- **Price:** £2,250,000 _(£2,250,000)_
- **Size:** 4,521 sq. ft. (4,521 sq ft)
- **Type:** Hotel · FREEHOLD
- **Agent:** GPS Commercial, Eastbourne
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 4521 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760545966541872#/?channel=COM_BUY

### Group of Dental Investments, UK Wide — £2,000,000 Guide Price

- **Address:** Group of Dental Investments, UK Wide (Sheffield, Yorkshire)
- **Price:** £2,000,000 Guide Price _(£2,000,000)_
- **Size:** n/a
- **Type:** Healthcare Facility · FREEHOLD
- **Agent:** Christie & Co, Dental
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 2000000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760779631160737#/?channel=COM_BUY

### Sheffield Cold Stores, Roman Ridge Road, Sheffield, S9 — £1,950,000

- **Address:** Sheffield Cold Stores, Roman Ridge Road, Sheffield, S9 (Sheffield, Yorkshire)
- **Price:** £1,950,000 _(£1,950,000)_
- **Size:** 44,910 sq. ft. (44,910 sq ft)
- **Type:** Warehouse
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 44910 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/754599909254481#/?channel=COM_BUY

### 197 Holme Lane, Sheffield, S6 — £1,800,000 Offers in Region of

- **Address:** 197 Holme Lane, Sheffield, S6 (Sheffield, Yorkshire)
- **Price:** £1,800,000 Offers in Region of _(£1,800,000)_
- **Size:** 28,497 sq. ft. (28,497 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1800000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/165618794#/?channel=COM_BUY

### Poplar Way, Rotherham — £1,500,000 Offers in Region of

- **Address:** Poplar Way, Rotherham (Sheffield, Yorkshire)
- **Price:** £1,500,000 Offers in Region of _(£1,500,000)_
- **Size:** 97,574 sq. ft. (97,574 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** BARKER PROUDLOVE LIMITED, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760015858866432#/?channel=COM_BUY

### 38-40, 42, 44 And 480 Howard Street, Sheffield, South Yorkshire, S1 2LX — £1,250,000

- **Address:** 38-40, 42, 44 And 480 Howard Street, Sheffield, South Yorkshire, S1 2LX (Sheffield, Yorkshire)
- **Price:** £1,250,000 _(£1,250,000)_
- **Size:** 6,992 sq. ft. (6,992 sq ft)
- **Type:** Shop · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1250000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760571799238961#/?channel=COM_BUY

### 386 Coleridge Road, Sheffield, S9 — POA

- **Address:** 386 Coleridge Road, Sheffield, S9 (Sheffield, Yorkshire)
- **Price:** POA _(£1,250,000)_
- **Size:** 12,656 sq. ft. (12,656 sq ft)
- **Type:** Light Industrial
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1250000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/754599957448257#/?channel=COM_BUY

### Waverley Works, Effingham Street, Sheffield,  Waverley Works, Effingham Street, Sheffield — £1,000,000 Guide Price

- **Address:** Waverley Works, Effingham Street, Sheffield,  Waverley Works, Effingham Street, Sheffield (Sheffield, Yorkshire)
- **Price:** £1,000,000 Guide Price _(£1,000,000)_ · auction
- **Size:** 35,000 sq. ft. (35,000 sq ft)
- **Type:** Mixed Use · LEASEHOLD
- **Agent:** Savills, Savills Auctions- Commercial
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 35000 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/746606427835057#/?channel=COM_BUY

### Gilbertson Works, Jessell Street, Sheffield, South Yorkshire, S9 3HY — £1,000,000

- **Address:** Gilbertson Works, Jessell Street, Sheffield, South Yorkshire, S9 3HY (Sheffield, Yorkshire)
- **Price:** £1,000,000 _(£1,000,000)_
- **Size:** 13,625 sq. ft. (13,625 sq ft)
- **Type:** Light Industrial
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 13625 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759300316797680#/?channel=COM_BUY

### Lion Works, 91-103 Spital Hill, Sheffield, South Yorkshire S4 7LD — £975,000 Guide Price

- **Address:** Lion Works, 91-103 Spital Hill, Sheffield, South Yorkshire S4 7LD (Sheffield, Yorkshire)
- **Price:** £975,000 Guide Price _(£975,000)_ · auction
- **Size:** n/a
- **Type:** Commercial Property · FREEHOLD
- **Agent:** BTG Eddisons Property Auctions, Commercial Nationwide
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 975000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173041451#/?channel=COM_BUY

### Brightside Lane, Sheffield, S9 — £975,000 Offers in Region of

- **Address:** Brightside Lane, Sheffield, S9 (Sheffield, Yorkshire)
- **Price:** £975,000 Offers in Region of _(£975,000)_
- **Size:** 10,387 sq. ft. (10,387 sq ft)
- **Type:** Office
- **Agent:** Commercial Property Rotherham, Rotherham
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 975000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/754397739487104#/?channel=COM_BUY

### Unit 1, Holbrook Industrial Estate, Holbrook Rise, Holbrook, Sheffield, South Yorkshire, S20 3FG — £960,000

- **Address:** Unit 1, Holbrook Industrial Estate, Holbrook Rise, Holbrook, Sheffield, South Yorkshire, S20 3FG (Sheffield, Yorkshire)
- **Price:** £960,000 _(£960,000)_
- **Size:** 14,175 sq. ft. (14,175 sq ft)
- **Type:** Commercial Property · LEASEHOLD
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 14175 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760571646084384#/?channel=COM_BUY

### Units 1 To 3, Bold Street, Sheffield, S9 2LR — £950,000 Offers in Excess of

- **Address:** Units 1 To 3, Bold Street, Sheffield, S9 2LR (Sheffield, Yorkshire)
- **Price:** £950,000 Offers in Excess of _(£950,000)_
- **Size:** 10,836 sq. ft. (10,836 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 950000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760571314744881#/?channel=COM_BUY

### 607-613 Penistone Road, Sheffield, S6 2GA — £900,000

- **Address:** 607-613 Penistone Road, Sheffield, S6 2GA (Sheffield, Yorkshire)
- **Price:** £900,000 _(£900,000)_
- **Size:** 11,403 sq. ft. (11,403 sq ft)
- **Type:** Leisure Facility
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 900000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/754599953229873#/?channel=COM_BUY

### Woodside Works, Rugby Street, Sheffield, S3 9QH — £895,000

- **Address:** Woodside Works, Rugby Street, Sheffield, S3 9QH (Sheffield, Yorkshire)
- **Price:** £895,000 _(£895,000)_
- **Size:** 44,179 sq. ft. (44,179 sq ft)
- **Type:** Light Industrial
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 895000 within budget 500000-2000000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/754599932281041#/?channel=COM_BUY

### Egerton Lane & Land at Evans Street, Sheffield S1 4JX — £695,000

- **Address:** Egerton Lane & Land at Evans Street, Sheffield S1 4JX (Sheffield, Yorkshire)
- **Price:** £695,000 _(£695,000)_
- **Size:** 5,022 sq. ft. (5,022 sq ft)
- **Type:** Residential Development · FREEHOLD
- **Agent:** Blue Alpine, London
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 695000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/747098253913009#/?channel=COM_BUY

### 110-114 Mansfield Road, Sheffield S12 2AP — £650,000

- **Address:** 110-114 Mansfield Road, Sheffield S12 2AP (Sheffield, Yorkshire)
- **Price:** £650,000 _(£650,000)_
- **Size:** 4,580 sq. ft. (4,580 sq ft)
- **Type:** Mixed Use · FREEHOLD
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 650000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/752251579336977#/?channel=COM_BUY

### Kayedee Premises, Stamford Street, Newhall Road Trading Estate, Sheffield, S9 2TX — £500,000

- **Address:** Kayedee Premises, Stamford Street, Newhall Road Trading Estate, Sheffield, S9 2TX (Sheffield, Yorkshire)
- **Price:** £500,000 _(£500,000)_
- **Size:** 21,489 sq. ft. (21,489 sq ft)
- **Type:** Warehouse
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 21489 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760571990026673#/?channel=COM_BUY

### Unit 1 Metis Building, 2 Solly Street, Sheffield, S1 — £495,000

- **Address:** Unit 1 Metis Building, 2 Solly Street, Sheffield, S1 (Sheffield, Yorkshire)
- **Price:** £495,000 _(£495,000)_
- **Size:** 3,850 sq. ft. (3,850 sq ft)
- **Type:** Office · LEASEHOLD
- **Agent:** Leaworks Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 3850 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/756215561406961#/?channel=COM_BUY

### Five Rivers House,  Savile Street, Sheffield S4 7UD — £475,000 Offers in Excess of

- **Address:** Five Rivers House,  Savile Street, Sheffield S4 7UD (Sheffield, Yorkshire)
- **Price:** £475,000 Offers in Excess of _(£475,000)_
- **Size:** 8,196 sq. ft. (8,196 sq ft)
- **Type:** Office
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 8196 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/757307324194945#/?channel=COM_BUY

### 16-18 & 20 Dixon Lane, Sheffield, S1 2AL — £400,000

- **Address:** 16-18 & 20 Dixon Lane, Sheffield, S1 2AL (Sheffield, Yorkshire)
- **Price:** £400,000 _(£400,000)_
- **Size:** 5,765 sq. ft. (5,765 sq ft)
- **Type:** Commercial Development
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 5765 >= min 2000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/754599940713777#/?channel=COM_BUY

### Unit 1, Daisy Spring Works, Dun Street, Sheffield, S3 8DW — £399,000

- **Address:** Unit 1, Daisy Spring Works, Dun Street, Sheffield, S3 8DW (Sheffield, Yorkshire)
- **Price:** £399,000 _(£399,000)_
- **Size:** 5,500 sq. ft. (5,500 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 5500 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/112995386#/?channel=COM_BUY

### Unit 8, Shepcote Office Village, Shepcote Lane, Sheffield, South Yorkshire, S9 1TG — £395,000

- **Address:** Unit 8, Shepcote Office Village, Shepcote Lane, Sheffield, South Yorkshire, S9 1TG (Sheffield, Yorkshire)
- **Price:** £395,000 _(£395,000)_
- **Size:** 3,022 sq. ft. (3,022 sq ft)
- **Type:** Office · LEASEHOLD
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 3022 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760571300137888#/?channel=COM_BUY

### Unit 2B, Junction 34 Industrial Estate, Greasbro Road, Tinsley, Sheffield, S9 1TN — £390,000

- **Address:** Unit 2B, Junction 34 Industrial Estate, Greasbro Road, Tinsley, Sheffield, S9 1TN (Sheffield, Yorkshire)
- **Price:** £390,000 _(£390,000)_
- **Size:** 4,820 sq. ft. (4,820 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 4820 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/762568495545041#/?channel=COM_BUY

### Unit 2 - Metis Building, 1 Scotland Street, Sheffield, S3 7AT — £335,000 Offers in Region of

- **Address:** Unit 2 - Metis Building, 1 Scotland Street, Sheffield, S3 7AT (Sheffield, Yorkshire)
- **Price:** £335,000 Offers in Region of _(£335,000)_
- **Size:** 2,343 sq. ft. (2,343 sq ft)
- **Type:** Office · LEASEHOLD
- **Agent:** SMC Brownill Vickers, South Yorkshire
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 2343 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/761307952034992#/?channel=COM_BUY

### Printhouse, The Printhouse, North Church Street, Sheffield — POA

- **Address:** Printhouse, The Printhouse, North Church Street, Sheffield (Sheffield, Yorkshire)
- **Price:** POA _(£330,000)_
- **Size:** 4,390 sq. ft. (4,390 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Fowler Sandford LLP, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 4390 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/759323486182768#/?channel=COM_BUY

### Alliance House, Roman Ridge Road, Sheffield S9 1GB — £325,000

- **Address:** Alliance House, Roman Ridge Road, Sheffield S9 1GB (Sheffield, Yorkshire)
- **Price:** £325,000 _(£325,000)_
- **Size:** 5,743 sq. ft. (5,743 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 5743 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/744622056476753#/?channel=COM_BUY

### 44 Bank Street, Sheffield, South Yorkshire, S1 2DS — £300,000

- **Address:** 44 Bank Street, Sheffield, South Yorkshire, S1 2DS (Sheffield, Yorkshire)
- **Price:** £300,000 _(£300,000)_
- **Size:** 2,458 sq. ft. (2,458 sq ft)
- **Type:** Shop · LEASEHOLD
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 2458 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760570951948481#/?channel=COM_BUY

### 21 Station Road, Kiveton Park, Sheffield, S26 6QP — £299,950

- **Address:** 21 Station Road, Kiveton Park, Sheffield, S26 6QP (Sheffield, Yorkshire)
- **Price:** £299,950 _(£299,950)_
- **Size:** 2,783 sq. ft. (2,783 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** SMC Brownill Vickers, South Yorkshire
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 2783 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/719250187282449#/?channel=COM_BUY

### Land at Green Lane, Ecclesfield, Sheffield S35 9WY — £275,000

- **Address:** Land at Green Lane, Ecclesfield, Sheffield S35 9WY (Sheffield, Yorkshire)
- **Price:** £275,000 _(£275,000)_
- **Size:** 20,042 sq. ft. (20,042 sq ft)
- **Type:** Residential Development · FREEHOLD
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 20042 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/743551758137296#/?channel=COM_BUY

### 1 Beton House, Park Hill, Rhodes Street, Sheffield, South Yorkshire, S2 5DT — £270,000

- **Address:** 1 Beton House, Park Hill, Rhodes Street, Sheffield, South Yorkshire, S2 5DT (Sheffield, Yorkshire)
- **Price:** £270,000 _(£270,000)_
- **Size:** 2,655 sq. ft. (2,655 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 2655 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/759297143771872#/?channel=COM_BUY

### 145 Attercliffe Common, Sheffield — £195,000 Offers in Region of

- **Address:** 145 Attercliffe Common, Sheffield (Sheffield, Yorkshire)
- **Price:** £195,000 Offers in Region of _(£195,000)_
- **Size:** 2,602 sq. ft. (2,602 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** BARKER PROUDLOVE LIMITED, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 2602 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/758018570995760#/?channel=COM_BUY

### Advantage House, Poplar Way, Catcliffe, Rotherham, Yorkshire S60 — POA

- **Address:** Advantage House, Poplar Way, Catcliffe, Rotherham, Yorkshire S60 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 19,873 sq. ft. (19,873 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 19873 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/89589720#/?channel=COM_BUY

### Milton Street, Sheffield, S3 7UF — POA

- **Address:** Milton Street, Sheffield, S3 7UF (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 275,000–350,000 sq. ft. (350,000 sq ft)
- **Type:** Residential Development
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 350000 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759292704103920#/?channel=COM_BUY

### CORE Sheffield, Shepcote Lane, Sheffield, South Yorkshire, S9 1TP — POA

- **Address:** CORE Sheffield, Shepcote Lane, Sheffield, South Yorkshire, S9 1TP (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 367,935 sq. ft. (367,935 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 367935 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/759291900865216#/?channel=COM_BUY

### 1 Amberley Street, Sheffield, S9 YO26 — POA

- **Address:** 1 Amberley Street, Sheffield, S9 YO26 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 77,330 sq. ft. (77,330 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 77330 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/151292600#/?channel=COM_BUY

### 13 Birley Vale Avenue, Sheffield S12 — POA

- **Address:** 13 Birley Vale Avenue, Sheffield S12 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 17,630 sq. ft. (17,630 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 17630 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/87778536#/?channel=COM_BUY

### Pennine House, 35a Business Park, Churchill Way, Ecclesfield, Sheffield, S35 — POA

- **Address:** Pennine House, 35a Business Park, Churchill Way, Ecclesfield, Sheffield, S35 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 9,360 sq. ft. (9,360 sq ft)
- **Type:** Office
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 9360 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/157397378#/?channel=COM_BUY

### Yards C And D, Old Station Drive, Millhouses, Sheffield, S7 2PY — POA

- **Address:** Yards C And D, Old Station Drive, Millhouses, Sheffield, S7 2PY (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 10,890 sq. ft. (10,890 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 10890 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760571922917472#/?channel=COM_BUY

### Highfield at Waverley, Highfield Spring, Waverley, Rotherham, S60 — POA

- **Address:** Highfield at Waverley, Highfield Spring, Waverley, Rotherham, S60 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 10,000–80,000 sq. ft. (80,000 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 80000 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/168968804#/?channel=COM_BUY

### Athol House, Heart of The City II, Pinstone Street, Sheffield, S1 2HZ — POA

- **Address:** Athol House, Heart of The City II, Pinstone Street, Sheffield, S1 2HZ (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 968–2,973 sq. ft. (2,973 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Savills, Leeds Offices
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 2973 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/758217253130032#/?channel=COM_BUY

### 50, Broadfield Road, Sheffield, S8 0XJ — POA

- **Address:** 50, Broadfield Road, Sheffield, S8 0XJ (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 3,546 sq. ft. (3,546 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 3546 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/174802055#/?channel=COM_BUY

### No.1 Midpoint Business Park, 1 Mid Point, Thornbury, Bradford, BD3 7AY — £4,000,000 Offers in Excess of

- **Address:** No.1 Midpoint Business Park, 1 Mid Point, Thornbury, Bradford, BD3 7AY (Bradford, Yorkshire)
- **Price:** £4,000,000 Offers in Excess of _(£4,000,000)_
- **Size:** 39,178 sq. ft. (39,178 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Northcap, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 39178 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/89501259#/?channel=COM_BUY

### 19 Bridge Street, Bradford, BD1 1JE — £750,000

- **Address:** 19 Bridge Street, Bradford, BD1 1JE (Bradford, Yorkshire)
- **Price:** £750,000 _(£750,000)_
- **Size:** 11,356 sq. ft. (11,356 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** Christo & Co, London, London
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Citywide Investors territory (prescoped — not scored); price 750000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/89729277#/?channel=COM_BUY

### Land at Hartington Terrace, Bradford — £40,000 Guide Price

- **Address:** Land at Hartington Terrace, Bradford (Bradford, Yorkshire)
- **Price:** £40,000 Guide Price _(£40,000)_ · auction
- **Size:** 2,476 sq. ft. (2,476 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Palace Auctions, London
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 2476 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/754780241191488#/?channel=COM_BUY

### Futures Way, Off Bolling Road, Bradford, West Yorkshire, BD4 7EB — £4,500,000 Offers in Region of

- **Address:** Futures Way, Off Bolling Road, Bradford, West Yorkshire, BD4 7EB (Bradford, Yorkshire)
- **Price:** £4,500,000 Offers in Region of _(£4,500,000)_
- **Size:** 72,564 sq. ft. (72,564 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 72564 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760556347259392#/?channel=COM_BUY

### West Riding House, 31 Cheapside, Bradford, West Riding House, 31 Cheapside, Bradford — £2,650,000 Guide Price

- **Address:** West Riding House, 31 Cheapside, Bradford, West Riding House, 31 Cheapside, Bradford (Bradford, Yorkshire)
- **Price:** £2,650,000 Guide Price _(£2,650,000)_
- **Size:** 29,351 sq. ft. (29,351 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Savills, City Offices
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 29351 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/750945672314128#/?channel=COM_BUY

### Unit 1 -10  Thorncliffe Square, Thorncliffe Road, Bradford, Unit 1, Thorncliffe Square, Thorncliffe Road, Bradford — £1,950,000 Guide Price

- **Address:** Unit 1 -10  Thorncliffe Square, Thorncliffe Road, Bradford, Unit 1, Thorncliffe Square, Thorncliffe Road, Bradford (Bradford, Yorkshire)
- **Price:** £1,950,000 Guide Price _(£1,950,000)_
- **Size:** 12,623 sq. ft. (12,623 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Savills, City Offices
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1950000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/763457220195440#/?channel=COM_BUY

### Units D & E, Bradford Business Park, Canal Road, Bradford, BD1 4SJ — £1,750,000 Offers in Region of

- **Address:** Units D & E, Bradford Business Park, Canal Road, Bradford, BD1 4SJ (Bradford, Yorkshire)
- **Price:** £1,750,000 Offers in Region of _(£1,750,000)_
- **Size:** 16,266 sq. ft. (16,266 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1750000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760557054121681#/?channel=COM_BUY

### Pasture Lane, Clayton, Bradford, BD14 6LU — POA

- **Address:** Pasture Lane, Clayton, Bradford, BD14 6LU (Bradford, Yorkshire)
- **Price:** POA _(£995,000)_
- **Size:** 11,814 sq. ft. (11,814 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Citywide Investors territory (prescoped — not scored); price 995000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/722868265035712#/?channel=COM_BUY

### Onward House, 2 Baptist Place, Bradford, West Yorkshire — £595,000 Offers in Region of

- **Address:** Onward House, 2 Baptist Place, Bradford, West Yorkshire (Bradford, Yorkshire)
- **Price:** £595,000 Offers in Region of _(£595,000)_
- **Size:** 11,194 sq. ft. (11,194 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Citywide Investors territory (prescoped — not scored); price 595000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760934224753408#/?channel=COM_BUY

### Little Lane Church, Little Lane, Bradford — £395,000 Offers in Region of

- **Address:** Little Lane Church, Little Lane, Bradford (Bradford, Yorkshire)
- **Price:** £395,000 Offers in Region of _(£395,000)_
- **Size:** 9,015 sq. ft. (9,015 sq ft)
- **Type:** Commercial Development
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 9015 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/760934262388241#/?channel=COM_BUY

### 343 Wakefield Road, Bradford, BD4 7NB — £375,000 Offers in Region of

- **Address:** 343 Wakefield Road, Bradford, BD4 7NB (Bradford, Yorkshire)
- **Price:** £375,000 Offers in Region of _(£375,000)_
- **Size:** 3,297 sq. ft. (3,297 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 3297 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760557448387104#/?channel=COM_BUY

### Oxford Place, Bradford — £325,000

- **Address:** Oxford Place, Bradford (Bradford, Yorkshire)
- **Price:** £325,000 _(£325,000)_
- **Size:** 5,761 sq. ft. (5,761 sq ft)
- **Type:** Light Industrial
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 5761 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760934153446096#/?channel=COM_BUY

### Queensbury Baptist Church, Chapel Lane, Queensbury, Bradford, Yorkshire, BD13 2PZ — POA

- **Address:** Queensbury Baptist Church, Chapel Lane, Queensbury, Bradford, Yorkshire, BD13 2PZ (Bradford, Yorkshire)
- **Price:** POA _(£250,000)_
- **Size:** 3,083 sq. ft. (3,083 sq ft)
- **Type:** Commercial Development
- **Agent:** Lambert Smith Hampton, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 3083 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/760771181578336#/?channel=COM_BUY

### Wharfedale Road, Bradford — POA

- **Address:** Wharfedale Road, Bradford (Bradford, Yorkshire)
- **Price:** POA _(£10)_
- **Size:** 28,079 sq. ft. (28,079 sq ft)
- **Type:** Light Industrial
- **Agent:** CBRE, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 28079 >= min 2000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/746607883263889#/?channel=COM_BUY

### 4-11 Station Mills, Station Road, Wyke, Bradford, BD12 8LA — POA

- **Address:** 4-11 Station Mills, Station Road, Wyke, Bradford, BD12 8LA (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 53,884–69,415 sq. ft. (69,415 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 69415 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/722867770130913#/?channel=COM_BUY

### Unit 3 Interchange 26, Junction 26 M62, Cliff Hollins Lane, Cleckheaton, Bradford, BD12 7EZ — POA

- **Address:** Unit 3 Interchange 26, Junction 26 M62, Cliff Hollins Lane, Cleckheaton, Bradford, BD12 7EZ (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 50,000–105,000 sq. ft. (105,000 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 105000 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/722867839314801#/?channel=COM_BUY

### 221 Sunbridge Road, Bradford, BD1 2LG — POA

- **Address:** 221 Sunbridge Road, Bradford, BD1 2LG (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 16,165 sq. ft. (16,165 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 16165 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760557421122001#/?channel=COM_BUY

### Hillam Road, Off Canal Road, Bradford, BD2 1QL — POA

- **Address:** Hillam Road, Off Canal Road, Bradford, BD2 1QL (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 20,405 sq. ft. (20,405 sq ft)
- **Type:** Warehouse · LEASEHOLD
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 20405 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760557131759280#/?channel=COM_BUY

### King Street Works, King Street, Drighlington — £225,000 Guide Price

- **Address:** King Street Works, King Street, Drighlington (Bradford, Yorkshire)
- **Price:** £225,000 Guide Price _(£225,000)_
- **Size:** 2,546 sq. ft. (2,546 sq ft)
- **Type:** Mixed Use · FREEHOLD
- **Agent:** Drighlington Properties, Drighlington
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Educating Excellence territory (prescoped — not scored); size 2546 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90972912#/?channel=COM_BUY

### Beech Street, Huddersfield, West Yorkshire, HD1 — £450,000

- **Address:** Beech Street, Huddersfield, West Yorkshire, HD1 (Huddersfield, Yorkshire)
- **Price:** £450,000 _(£450,000)_
- **Size:** 14,128 sq. ft. (14,128 sq ft)
- **Type:** Leisure Facility · FREEHOLD
- **Agent:** Portfolio Lets Limited, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 14128 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/752945269010833#/?channel=COM_BUY

### Final Plot - Trinity West, Trinity Street, Huddersfield, HD1 4DL — POA

- **Address:** Final Plot - Trinity West, Trinity Street, Huddersfield, HD1 4DL (Huddersfield, Yorkshire)
- **Price:** POA _(£2,550,000)_
- **Size:** 67,082 sq. ft. (67,082 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Fox Lloyd Jones, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 67082 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/721600211753729#/?channel=COM_BUY

### Apartments 1-10,  16-20, Cloth Hall Street, Huddersfield — £800,000

- **Address:** Apartments 1-10,  16-20, Cloth Hall Street, Huddersfield (Huddersfield, Yorkshire)
- **Price:** £800,000 _(£800,000)_
- **Size:** 452–3,616 sq. ft. (3,616 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** LCP, Commercial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 800000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/88202013#/?channel=COM_BUY

### 24 Zetland Street, Huddersfield, HD1 2RA — £595,000

- **Address:** 24 Zetland Street, Huddersfield, HD1 2RA (Huddersfield, Yorkshire)
- **Price:** £595,000 _(£595,000)_
- **Size:** 5,813 sq. ft. (5,813 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 595000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173895635#/?channel=COM_BUY

### Investment Property, Almondbury, West Yorkshire — £525,000

- **Address:** Investment Property, Almondbury, West Yorkshire (Huddersfield, Yorkshire)
- **Price:** £525,000 _(£525,000)_
- **Size:** n/a
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 525000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/142703828#/?channel=COM_BUY

### 1 Lord Street, Huddersfield, West Yorkshire, HD1 1QA — £500,000

- **Address:** 1 Lord Street, Huddersfield, West Yorkshire, HD1 1QA (Huddersfield, Yorkshire)
- **Price:** £500,000 _(£500,000)_
- **Size:** 5,422 sq. ft. (5,422 sq ft)
- **Type:** Commercial Development
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 5422 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/742090498310208#/?channel=COM_BUY

### 31 - 33 Towngate, Huddersfield, HD4 6JR — £350,000

- **Address:** 31 - 33 Towngate, Huddersfield, HD4 6JR (Huddersfield, Yorkshire)
- **Price:** £350,000 _(£350,000)_
- **Size:** 2,415 sq. ft. (2,415 sq ft)
- **Type:** Retail Property (out of town) · FREEHOLD
- **Agent:** eXp UK, Commercial
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 2415 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/750772690783889#/?channel=COM_BUY

### Land to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE — £200,000 Offers in Excess of

- **Address:** Land to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE (Huddersfield, Yorkshire)
- **Price:** £200,000 Offers in Excess of _(£200,000)_
- **Size:** 11,761 sq. ft. (11,761 sq ft)
- **Type:** Residential Development
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 11761 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742063304407872#/?channel=COM_BUY

### Development Site to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE — £200,000 Offers in Excess of

- **Address:** Development Site to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE (Huddersfield, Yorkshire)
- **Price:** £200,000 Offers in Excess of _(£200,000)_
- **Size:** 11,761 sq. ft. (11,761 sq ft)
- **Type:** Residential Development
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 11761 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742063384158624#/?channel=COM_BUY

### Land Adjacent To 84, Longwood Gate, Longwood, Huddersfield, West Yorkshire, HD3 4US — £160,000

- **Address:** Land Adjacent To 84, Longwood Gate, Longwood, Huddersfield, West Yorkshire, HD3 4US (Huddersfield, Yorkshire)
- **Price:** £160,000 _(£160,000)_
- **Size:** 161,172 sq. ft. (161,172 sq ft)
- **Type:** Residential Development · FREEHOLD
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 161172 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/742063671410129#/?channel=COM_BUY

### Former Revolution, 28 Cross Church Street, Huddersfield, HD1 2PT — POA

- **Address:** Former Revolution, 28 Cross Church Street, Huddersfield, HD1 2PT (Huddersfield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 10,698 sq. ft. (10,698 sq ft)
- **Type:** Bar / Nightclub · FREEHOLD
- **Agent:** Savills, Margaret Street - Licensed Leisure
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 10698 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/749299705809233#/?channel=COM_BUY

### Morley Lane, Huddersfield — £650,000 Offers in Region of

- **Address:** Morley Lane, Huddersfield (Huddersfield, Yorkshire)
- **Price:** £650,000 Offers in Region of _(£650,000)_
- **Size:** n/a
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Boultons, Huddersfield
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Citywide Investors territory (prescoped — not scored); price 650000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90737562#/?channel=COM_BUY

### Land to Rear of 72 & 74 New North Road, Huddersfield — £200,000 Offers Over

- **Address:** Land to Rear of 72 & 74 New North Road, Huddersfield (Huddersfield, Yorkshire)
- **Price:** £200,000 Offers Over _(£200,000)_
- **Size:** 11,761 sq. ft. (11,761 sq ft)
- **Type:** Land · FREEHOLD
- **Agent:** Bramleys, Huddersfield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 11761 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173745665#/?channel=COM_BUY

### Land adjacent to 84 Longwood Gate, Longwood, Huddersfield — £160,000

- **Address:** Land adjacent to 84 Longwood Gate, Longwood, Huddersfield (Huddersfield, Yorkshire)
- **Price:** £160,000 _(£160,000)_
- **Size:** 161,172 sq. ft. (161,172 sq ft)
- **Type:** Land · FREEHOLD
- **Agent:** Bramleys, Huddersfield
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Educating Excellence territory (prescoped — not scored); size 161172 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173625812#/?channel=COM_BUY

### Pillar House, 19-21 South Parade, Doncaster, South Yorkshire, DN1 2DJ — £695,000 Offers in Region of

- **Address:** Pillar House, 19-21 South Parade, Doncaster, South Yorkshire, DN1 2DJ (Doncaster, Yorkshire)
- **Price:** £695,000 Offers in Region of _(£695,000)_
- **Size:** 12,389 sq. ft. (12,389 sq ft)
- **Type:** Office
- **Agent:** Flint Real Estate, Doncaster
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Citywide Investors territory (prescoped — not scored); price 695000 within budget 500000-2000000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/760550506814305#/?channel=COM_BUY

### 1 South Parade, Doncaster, DN1 2DY — £850,000 Offers in Excess of

- **Address:** 1 South Parade, Doncaster, DN1 2DY (Doncaster, Yorkshire)
- **Price:** £850,000 Offers in Excess of _(£850,000)_
- **Size:** 11,038 sq. ft. (11,038 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Savills, Nottingham
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Citywide Investors territory (prescoped — not scored); price 850000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/723050998393024#/?channel=COM_BUY

### 11-19 Printing Office Street, Doncaster, South Yorkshire, DN1 1TJ — £725,000 Offers in Region of

- **Address:** 11-19 Printing Office Street, Doncaster, South Yorkshire, DN1 1TJ (Doncaster, Yorkshire)
- **Price:** £725,000 Offers in Region of _(£725,000)_
- **Size:** 5,241 sq. ft. (5,241 sq ft)
- **Type:** Commercial Property
- **Agent:** PPH Commercial Limited, Doncaster
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Citywide Investors territory (prescoped — not scored); price 725000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759461342496401#/?channel=COM_BUY

### Licenced Trade, Pubs & Clubs, South Yorkshire — £700,000 Offers in Excess of

- **Address:** Licenced Trade, Pubs & Clubs, South Yorkshire (Doncaster, Yorkshire)
- **Price:** £700,000 Offers in Excess of _(£700,000)_
- **Size:** n/a
- **Type:** Pub · FREEHOLD
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Citywide Investors territory (prescoped — not scored); price 700000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/164177699#/?channel=COM_BUY

### 40-44 Silver Street, Doncaster, DN1 1HQ — £575,000

- **Address:** 40-44 Silver Street, Doncaster, DN1 1HQ (Doncaster, Yorkshire)
- **Price:** £575,000 _(£575,000)_
- **Size:** 12,000 sq. ft. (12,000 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** Barnsdales Ltd - Commercial, Doncaster
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Citywide Investors territory (prescoped — not scored); price 575000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/167469245#/?channel=COM_BUY

### Slug  Lettuce, 54 Hall Gate, Doncaster, DN1 3PB — £500,000 Offers in Excess of

- **Address:** Slug  Lettuce, 54 Hall Gate, Doncaster, DN1 3PB (Doncaster, Yorkshire)
- **Price:** £500,000 Offers in Excess of _(£500,000)_
- **Size:** 11,326 sq. ft. (11,326 sq ft)
- **Type:** Pub · FREEHOLD
- **Agent:** Savills, Manchester - Licensed Leisure
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Citywide Investors territory (prescoped — not scored); price 500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/723056780266769#/?channel=COM_BUY

### Hall Gate, Doncaster, DN1 — £1,500,000

- **Address:** Hall Gate, Doncaster, DN1 (Doncaster, Yorkshire)
- **Price:** £1,500,000 _(£1,500,000)_
- **Size:** n/a
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Nested, Nationwide
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Citywide Investors territory (prescoped — not scored); price 1500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90530232#/?channel=COM_BUY

### 4 The Stables, Wilmslow Road, Parrs Wood, East Didsbury, M20 5PG — £525,000

- **Address:** 4 The Stables, Wilmslow Road, Parrs Wood, East Didsbury, M20 5PG (Manchester, Greater Manchester)
- **Price:** £525,000 _(£525,000)_
- **Size:** 1,319 sq. ft. (1,319 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Williams Sillitoe, Cheshire
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 525000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/171599399#/?channel=COM_BUY

### Briscoe Lane, Manchester, M40 — £7,000,000 Offers in Excess of

- **Address:** Briscoe Lane, Manchester, M40 (Manchester, Greater Manchester)
- **Price:** £7,000,000 Offers in Excess of _(£7,000,000)_
- **Size:** 186,872 sq. ft. (186,872 sq ft)
- **Type:** Light Industrial
- **Agent:** Citrus Commercial Circle, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 186872 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/749898455249585#/?channel=COM_BUY

### Wakefield House, 7-13 New Wakefield Street, Manchester, Greater Manchester, M1 5NP — £6,250,000

- **Address:** Wakefield House, 7-13 New Wakefield Street, Manchester, Greater Manchester, M1 5NP (Manchester, Greater Manchester)
- **Price:** £6,250,000 _(£6,250,000)_
- **Size:** 31,330 sq. ft. (31,330 sq ft)
- **Type:** Mixed Use · FREEHOLD
- **Agent:** W T Gunson, Manchester - BPG
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 31330 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/759472245651296#/?channel=COM_BUY

### Admiral Business Park, Cawdor Street, Eccles, Manchester, M30 0ZQ — £6,130,000 Offers in Excess of

- **Address:** Admiral Business Park, Cawdor Street, Eccles, Manchester, M30 0ZQ (Manchester, Greater Manchester)
- **Price:** £6,130,000 Offers in Excess of _(£6,130,000)_
- **Size:** 26,275 sq. ft. (26,275 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** Northcap, Leeds
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 26275 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/87528609#/?channel=COM_BUY

### The Waterside, Springfield Lane, Manchester, M3 7JQ — £6,000,000 Offers in Excess of

- **Address:** The Waterside, Springfield Lane, Manchester, M3 7JQ (Manchester, Greater Manchester)
- **Price:** £6,000,000 Offers in Excess of _(£6,000,000)_
- **Size:** 65,340 sq. ft. (65,340 sq ft)
- **Type:** Residential Development · FREEHOLD
- **Agent:** Di Properties Ltd, London
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 65340 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/161828498#/?channel=COM_BUY

### Sherborne Street, Manchester — POA

- **Address:** Sherborne Street, Manchester (Manchester, Greater Manchester)
- **Price:** POA _(£5,500,000)_
- **Size:** 80,000 sq. ft. (80,000 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Citrus Commercial Circle, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 80000 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/738315773469473#/?channel=COM_BUY

### Seaford Road, Manchester M6 — £5,500,000 Guide Price

- **Address:** Seaford Road, Manchester M6 (Manchester, Greater Manchester)
- **Price:** £5,500,000 Guide Price _(£5,500,000)_
- **Size:** 154,388 sq. ft. (154,388 sq ft)
- **Type:** Residential Development · FREEHOLD
- **Agent:** ESTATE OFFICE INVESTMENTS LIMITED, London
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 154388 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/755829050114448#/?channel=COM_BUY

### Kiwi Park - Unit 6, Commerce Way, Trafford Park, Manchester, Greater Manchester, M17 — POA

- **Address:** Kiwi Park - Unit 6, Commerce Way, Trafford Park, Manchester, Greater Manchester, M17 (Manchester, Greater Manchester)
- **Price:** POA _(£3,500,000)_
- **Size:** 17,197 sq. ft. (17,197 sq ft)
- **Type:** Distribution Warehouse
- **Agent:** DAVIES HARRISON LIMITED, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 17197 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/754386811315905#/?channel=COM_BUY

### Victoria House, 252 Great Ancoats Street, Manchester, M4 7DB — £2,175,000 Offers in Excess of

- **Address:** Victoria House, 252 Great Ancoats Street, Manchester, M4 7DB (Manchester, Greater Manchester)
- **Price:** £2,175,000 Offers in Excess of _(£2,175,000)_
- **Size:** 2,914 sq. ft. (2,914 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** Graham & Sibbald, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2914 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760716636883840#/?channel=COM_BUY

### Albion Wharf, 19 Albion Street, Manchester, Greater Manchester — £2,100,000 Offers in Region of

- **Address:** Albion Wharf, 19 Albion Street, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** £2,100,000 Offers in Region of _(£2,100,000)_
- **Size:** 10,430 sq. ft. (10,430 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Roger Hannah Ltd, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 10430 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760768065211217#/?channel=COM_BUY

### 17-25 St. Ann Street, Manchester, Greater Manchester, M2 — £2,000,000 Offers Over

- **Address:** 17-25 St. Ann Street, Manchester, Greater Manchester, M2 (Manchester, Greater Manchester)
- **Price:** £2,000,000 Offers Over _(£2,000,000)_
- **Size:** 10,033 sq. ft. (10,033 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** BARKER PROUDLOVE LIMITED, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 2000000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/754397760540369#/?channel=COM_BUY

### Bury Street, Manchester, Greater Manchester, M3 — £1,550,000 Offers in Excess of

- **Address:** Bury Street, Manchester, Greater Manchester, M3 (Manchester, Greater Manchester)
- **Price:** £1,550,000 Offers in Excess of _(£1,550,000)_
- **Size:** 5,814 sq. ft. (5,814 sq ft)
- **Type:** Office
- **Agent:** OBI PROPERTY LIMITED, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 5814 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/754591526994001#/?channel=COM_BUY

### Former Chapel St & Hope United Reformed Church, 146 Chapel Street, Salford, M3 6AF — £1,500,000 Offers in Excess of

- **Address:** Former Chapel St & Hope United Reformed Church, 146 Chapel Street, Salford, M3 6AF (Manchester, Greater Manchester)
- **Price:** £1,500,000 Offers in Excess of _(£1,500,000)_
- **Size:** 9,766 sq. ft. (9,766 sq ft)
- **Type:** Place of Worship
- **Agent:** W T Gunson, Manchester - BPG
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1500000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759473348749040#/?channel=COM_BUY

### Grant House, Units 8 & 9 Washington Centre, Broadway, Salford, M50 2UW — POA

- **Address:** Grant House, Units 8 & 9 Washington Centre, Broadway, Salford, M50 2UW (Manchester, Greater Manchester)
- **Price:** POA _(£1,400,000)_
- **Size:** 15,685 sq. ft. (15,685 sq ft)
- **Type:** Warehouse · LEASEHOLD
- **Agent:** Sixteen Real Estate, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 15685 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/88701666#/?channel=COM_BUY

### Unit 5, Brightgate Way, Trafford Park, M32 0TB — POA

- **Address:** Unit 5, Brightgate Way, Trafford Park, M32 0TB (Manchester, Greater Manchester)
- **Price:** POA _(£1,300,000)_
- **Size:** 6,520 sq. ft. (6,520 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** B8 Real Estate LLP, Warrington
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1300000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173747120#/?channel=COM_BUY

### Stretford Road, Hulme, Manchester, M15 — £1,300,000

- **Address:** Stretford Road, Hulme, Manchester, M15 (Manchester, Greater Manchester)
- **Price:** £1,300,000 _(£1,300,000)_
- **Size:** n/a
- **Type:** Residential Development
- **Agent:** Citrus Commercial Circle, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1300000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/751658404128465#/?channel=COM_BUY

### 496, 496a and 496b Wilbraham Road, Manchester, Greater Manchester, M21 — £1,275,000 Offers in Excess of

- **Address:** 496, 496a and 496b Wilbraham Road, Manchester, Greater Manchester, M21 (Manchester, Greater Manchester)
- **Price:** £1,275,000 Offers in Excess of _(£1,275,000)_
- **Size:** n/a
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** BARKER PROUDLOVE LIMITED, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1275000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/754397735518577#/?channel=COM_BUY

### Unit 2, Fourways Trading Estate, Manchester, M17 1SW — £1,100,000 Offers in Region of

- **Address:** Unit 2, Fourways Trading Estate, Manchester, M17 1SW (Manchester, Greater Manchester)
- **Price:** £1,100,000 Offers in Region of _(£1,100,000)_
- **Size:** 6,352 sq. ft. (6,352 sq ft)
- **Type:** Warehouse · LEASEHOLD
- **Agent:** Williams Sillitoe, Cheshire
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 6352 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/173477042#/?channel=COM_BUY

### Ground Floor (East Wing) Victoria Mill, 10 Lower Vickers Street, Manchester, Manchester, M40 7LH — £1,000,000 Offers in Region of

- **Address:** Ground Floor (East Wing) Victoria Mill, 10 Lower Vickers Street, Manchester, Manchester, M40 7LH (Manchester, Greater Manchester)
- **Price:** £1,000,000 Offers in Region of _(£1,000,000)_
- **Size:** n/a
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Landwood Group, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1000000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/167035448#/?channel=COM_BUY

### Belmont Oil Works, Lancashire Hill, Stockport, SK4 1RP — POA

- **Address:** Belmont Oil Works, Lancashire Hill, Stockport, SK4 1RP (Manchester, Greater Manchester)
- **Price:** POA _(£300,000)_
- **Size:** 6,824 sq. ft. (6,824 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** MBRE, Stockport
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 6824 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/158222384#/?channel=COM_BUY

### Land At New Viaduct Street And 266 Bradford Road, Manchester, Greater Manchester — £1,045,000

- **Address:** Land At New Viaduct Street And 266 Bradford Road, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** £1,045,000 _(£1,045,000)_
- **Size:** 47,916 sq. ft. (47,916 sq ft)
- **Type:** Commercial Property
- **Agent:** Roger Hannah Ltd, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1045000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760768027462464#/?channel=COM_BUY

### Unit D2, Meadowbank Business Park, Tweedle Way, Oldham, OL9 8EH — £1,000,000

- **Address:** Unit D2, Meadowbank Business Park, Tweedle Way, Oldham, OL9 8EH (Manchester, Greater Manchester)
- **Price:** £1,000,000 _(£1,000,000)_
- **Size:** 7,615 sq. ft. (7,615 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** MBRE, Stockport
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1000000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/170286875#/?channel=COM_BUY

### 22 Oxford Court, Manchester, M2 3WQ — £995,150

- **Address:** 22 Oxford Court, Manchester, M2 3WQ (Manchester, Greater Manchester)
- **Price:** £995,150 _(£995,150)_
- **Size:** 3,062 sq. ft. (3,062 sq ft)
- **Type:** Office · LEASEHOLD
- **Agent:** JLL, Manchester - Offices
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 3062 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/158787608#/?channel=COM_BUY

### 500 Styal Road, Manchester, M22 5HQ — £995,000 Offers in Region of

- **Address:** 500 Styal Road, Manchester, M22 5HQ (Manchester, Greater Manchester)
- **Price:** £995,000 Offers in Region of _(£995,000)_
- **Size:** 6,379 sq. ft. (6,379 sq ft)
- **Type:** Office
- **Agent:** Canning O'Neill, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 6379 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/89204469#/?channel=COM_BUY

### Parkway Four Estate, Longbridge Road, Trafford Park, Trafford — POA

- **Address:** Parkway Four Estate, Longbridge Road, Trafford Park, Trafford (Manchester, Greater Manchester)
- **Price:** POA _(£995,000)_
- **Size:** 6,208 sq. ft. (6,208 sq ft)
- **Type:** Warehouse
- **Agent:** DAVIES HARRISON LIMITED, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 6208 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760738990430945#/?channel=COM_BUY

### 498-500 Wilbraham Road, Manchester, M21 9AP — £985,000

- **Address:** 498-500 Wilbraham Road, Manchester, M21 9AP (Manchester, Greater Manchester)
- **Price:** £985,000 _(£985,000)_
- **Size:** 5,266 sq. ft. (5,266 sq ft)
- **Type:** Leisure Facility · FREEHOLD
- **Agent:** Shape and Sate, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 985000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90799563#/?channel=COM_BUY

### Units 1-4, Hadfield House, Gordon Street, Stockport, SK4 1RR — £975,000

- **Address:** Units 1-4, Hadfield House, Gordon Street, Stockport, SK4 1RR (Manchester, Greater Manchester)
- **Price:** £975,000 _(£975,000)_
- **Size:** 21,507 sq. ft. (21,507 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Fairhurst Buckley, Stockport
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 975000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/759312467830369#/?channel=COM_BUY

### Longley Lane, Manchester, Greater Manchester, M22 — Offers Invited

- **Address:** Longley Lane, Manchester, Greater Manchester, M22 (Manchester, Greater Manchester)
- **Price:** Offers Invited _(£949,000)_
- **Size:** 1–11,080 sq. ft. (11,080 sq ft)
- **Type:** Warehouse · LEASEHOLD
- **Agent:** Houldsworth Business and Arts Centre NW Ltd, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 11080 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/169531910#/?channel=COM_BUY

### Lyons Road, Trafford Park, Manchester, Greater Manchester — £895,000

- **Address:** Lyons Road, Trafford Park, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** £895,000 _(£895,000)_
- **Size:** 9,107 sq. ft. (9,107 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Roger Hannah Ltd, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 895000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760767924826705#/?channel=COM_BUY

### The Rat and Pigeon, 33 Back Piccadilly, Manchester, M1 1HP — £885,000 Offers in Excess of

- **Address:** The Rat and Pigeon, 33 Back Piccadilly, Manchester, M1 1HP (Manchester, Greater Manchester)
- **Price:** £885,000 Offers in Excess of _(£885,000)_
- **Size:** 1,133 sq. ft. (1,133 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Savills, Margaret Street - Licensed Leisure
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 885000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/744108203782992#/?channel=COM_BUY

### Ayres Road, Stretford, Trafford — £850,000 Offers in Excess of

- **Address:** Ayres Road, Stretford, Trafford (Manchester, Greater Manchester)
- **Price:** £850,000 Offers in Excess of _(£850,000)_
- **Size:** 1,992–7,798 sq. ft. (7,798 sq ft)
- **Type:** Warehouse
- **Agent:** Thomas Willmax Ltd, Sale
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 850000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/738114440579633#/?channel=COM_BUY

### 64-68 Bury Old Road, Manchester — £750,000 Offers in Region of

- **Address:** 64-68 Bury Old Road, Manchester (Manchester, Greater Manchester)
- **Price:** £750,000 Offers in Region of _(£750,000)_
- **Size:** 5,542 sq. ft. (5,542 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** BARKER PROUDLOVE LIMITED, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 750000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/752027355996960#/?channel=COM_BUY

### Broughton Street, Manchester, Greater Manchester, M8 — £675,000 Offers in Excess of

- **Address:** Broughton Street, Manchester, Greater Manchester, M8 (Manchester, Greater Manchester)
- **Price:** £675,000 Offers in Excess of _(£675,000)_
- **Size:** 8,500 sq. ft. (8,500 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** NQ Commercial Limited, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 675000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/756213044978816#/?channel=COM_BUY

### 51-53 Richmond Street, Manchester, Lancashire, M1 3WB — £675,000 Offers in Region of

- **Address:** 51-53 Richmond Street, Manchester, Lancashire, M1 3WB (Manchester, Greater Manchester)
- **Price:** £675,000 Offers in Region of _(£675,000)_
- **Size:** n/a
- **Type:** Residential Development · FREEHOLD
- **Agent:** Landwood Group, Manchester
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 675000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/162129293#/?channel=COM_BUY

### 13 Shaw Road, Heaton Moor, Stockport, SK4 4AG — £650,000

- **Address:** 13 Shaw Road, Heaton Moor, Stockport, SK4 4AG (Manchester, Greater Manchester)
- **Price:** £650,000 _(£650,000)_
- **Size:** 2,252 sq. ft. (2,252 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** MBRE, Stockport
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 650000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/162163484#/?channel=COM_BUY

### Unit 1 and 2, Moho, Arundel Street, Manchester, M15 4JY — £650,000

- **Address:** Unit 1 and 2, Moho, Arundel Street, Manchester, M15 4JY (Manchester, Greater Manchester)
- **Price:** £650,000 _(£650,000)_
- **Size:** 4,047 sq. ft. (4,047 sq ft)
- **Type:** Retail Property (high street) · LEASEHOLD
- **Agent:** Shape and Sate, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 4047 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/90799932#/?channel=COM_BUY

### Meadow Industrial Estate, Water Street, Manchester — £280,000

- **Address:** Meadow Industrial Estate, Water Street, Manchester (Manchester, Greater Manchester)
- **Price:** £280,000 _(£280,000)_
- **Size:** 2,400–2,450 sq. ft. (2,450 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Portfolio Lets Limited, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2450 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/763457499288288#/?channel=COM_BUY

### 20 St. Anns Square, Manchester, M2 7HG — POA

- **Address:** 20 St. Anns Square, Manchester, M2 7HG (Manchester, Greater Manchester)
- **Price:** POA _(£1)_
- **Size:** 2,289–7,493 sq. ft. (7,493 sq ft)
- **Type:** Retail Property (high street) · LEASEHOLD
- **Agent:** Shape and Sate, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 7493 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/90800277#/?channel=COM_BUY

### Whitegate Inn (Beefeater), Broadway, Oldham, OL9 8DW — £640,000

- **Address:** Whitegate Inn (Beefeater), Broadway, Oldham, OL9 8DW (Manchester, Greater Manchester)
- **Price:** £640,000 _(£640,000)_
- **Size:** n/a
- **Type:** Pub · FREEHOLD
- **Agent:** Christie & Co, Pubs & Restaurants
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 640000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/763088377470560#/?channel=COM_BUY

### 3 Jordan Street, Manchester M15 — £625,000 Offers in Region of

- **Address:** 3 Jordan Street, Manchester M15 (Manchester, Greater Manchester)
- **Price:** £625,000 Offers in Region of _(£625,000)_
- **Size:** 2,242 sq. ft. (2,242 sq ft)
- **Type:** Office · LEASEHOLD
- **Agent:** Knight Frank, Manchester - Commercial
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2242 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/90414237#/?channel=COM_BUY

### Ashton New Road, Manchester, Greater Manchester, M11 — £625,000

- **Address:** Ashton New Road, Manchester, Greater Manchester, M11 (Manchester, Greater Manchester)
- **Price:** £625,000 _(£625,000)_
- **Size:** 5,960 sq. ft. (5,960 sq ft)
- **Type:** Commercial Development
- **Agent:** Thomas Willmax Ltd, Sale
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 625000 within budget 500000-2000000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/754785658201873#/?channel=COM_BUY

### Manchester Road, Manchester — £600,000 Offers in Region of

- **Address:** Manchester Road, Manchester (Manchester, Greater Manchester)
- **Price:** £600,000 Offers in Region of _(£600,000)_
- **Size:** 1,431–1,432 sq. ft. (1,432 sq ft)
- **Type:** Shop · FREEHOLD
- **Agent:** TFC, Deansgate
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 600000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/755487604418224#/?channel=COM_BUY

### Unit 2, Digital Park, Pacific Way, Salford Quays, M50 1DR — £595,000 Offers in Region of

- **Address:** Unit 2, Digital Park, Pacific Way, Salford Quays, M50 1DR (Manchester, Greater Manchester)
- **Price:** £595,000 Offers in Region of _(£595,000)_
- **Size:** 3,245 sq. ft. (3,245 sq ft)
- **Type:** Office
- **Agent:** Canning O'Neill, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 3245 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/90129879#/?channel=COM_BUY

### Swinton Hall Road, Swinton, Manchester, Greater Manchester, M27 4UB — £560,000 Guide Price

- **Address:** Swinton Hall Road, Swinton, Manchester, Greater Manchester, M27 4UB (Manchester, Greater Manchester)
- **Price:** £560,000 Guide Price _(£560,000)_ · auction
- **Size:** n/a
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Pattinsons, Pattinsons Auction- National Auctioneer
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 560000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/88587447#/?channel=COM_BUY

### 193 - 195 Littleton Road, Salford, Greater Manchester M7 3TL — £525,000 Guide Price

- **Address:** 193 - 195 Littleton Road, Salford, Greater Manchester M7 3TL (Manchester, Greater Manchester)
- **Price:** £525,000 Guide Price _(£525,000)_ · auction
- **Size:** n/a
- **Type:** Mixed Use · FREEHOLD
- **Agent:** Auction House North West, Commercial
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 525000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/96676537#/?channel=COM_BUY

### Riverside Unit at Bridgewater Wharf, 257 Ordsall Lane, Salford, M5 3NG — £500,000 Offers in Excess of

- **Address:** Riverside Unit at Bridgewater Wharf, 257 Ordsall Lane, Salford, M5 3NG (Manchester, Greater Manchester)
- **Price:** £500,000 Offers in Excess of _(£500,000)_
- **Size:** 2,336 sq. ft. (2,336 sq ft)
- **Type:** Retail Property (high street) · LEASEHOLD
- **Agent:** Gifford Dixon Commercial Property, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2336 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/160038089#/?channel=COM_BUY

### 11 & 11A Shaw Road, Heaton Moor, Stockport SK4 4AG — £450,000

- **Address:** 11 & 11A Shaw Road, Heaton Moor, Stockport SK4 4AG (Manchester, Greater Manchester)
- **Price:** £450,000 _(£450,000)_
- **Size:** 2,229 sq. ft. (2,229 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** Impey & Company Limited, Stockport
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2229 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/761300559490480#/?channel=COM_BUY

### 12 Arundel Street, Manchester, M15 4JR — £430,000 Guide Price

- **Address:** 12 Arundel Street, Manchester, M15 4JR (Manchester, Greater Manchester)
- **Price:** £430,000 Guide Price _(£430,000)_
- **Size:** 2,076 sq. ft. (2,076 sq ft)
- **Type:** Office
- **Agent:** Canning O'Neill, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2076 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/88243917#/?channel=COM_BUY

### Unit 2, Praed Road, Trafford Park, Manchester, M17 1PQ — £395,000

- **Address:** Unit 2, Praed Road, Trafford Park, Manchester, M17 1PQ (Manchester, Greater Manchester)
- **Price:** £395,000 _(£395,000)_
- **Size:** 2,877 sq. ft. (2,877 sq ft)
- **Type:** Warehouse
- **Agent:** Fairhurst Buckley, Stockport
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2877 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/759312782239104#/?channel=COM_BUY

### Chadwick Road, Eccles, Manchester, Greater Manchester, M30 0WU — £265,000 Guide Price

- **Address:** Chadwick Road, Eccles, Manchester, Greater Manchester, M30 0WU (Manchester, Greater Manchester)
- **Price:** £265,000 Guide Price _(£265,000)_ · auction
- **Size:** 3,046 sq. ft. (3,046 sq ft)
- **Type:** Heavy Industrial · FREEHOLD
- **Agent:** Pattinsons, Pattinsons Auction- National Auctioneer
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 3046 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90271293#/?channel=COM_BUY

### Unit  137 Fairfield Street  Manchester  M12 6FJ  United Kingdom — POA

- **Address:** Unit  137 Fairfield Street  Manchester  M12 6FJ  United Kingdom (Manchester, Greater Manchester)
- **Price:** POA _(£250,000)_
- **Size:** 2,634 sq. ft. (2,634 sq ft)
- **Type:** Industrial Park · FREEHOLD
- **Agent:** Colliers International, Industrial - Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2634 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/168980207#/?channel=COM_BUY

### Ladybarn Lane, Manchester, Greater Manchester, M14 6YU — £150,000 Guide Price

- **Address:** Ladybarn Lane, Manchester, Greater Manchester, M14 6YU (Manchester, Greater Manchester)
- **Price:** £150,000 Guide Price _(£150,000)_ · auction
- **Size:** 2,012 sq. ft. (2,012 sq ft)
- **Type:** Land · FREEHOLD
- **Agent:** Pattinsons, Pattinsons Auction- National Auctioneer
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2012 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/159892385#/?channel=COM_BUY

### New Hall Lane, Bolton — £195,000 Offers in Region of

- **Address:** New Hall Lane, Bolton (Bolton, Greater Manchester)
- **Price:** £195,000 Offers in Region of _(£195,000)_
- **Size:** 1,000–2,000 sq. ft. (2,000 sq ft)
- **Type:** Mixed Use · LEASEHOLD
- **Agent:** Regency Estates, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2000 >= min 2000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/758269323414560#/?channel=COM_BUY

### Bridgeman Place Works, Salop Street, Bolton, Lancashire — £1,800,000

- **Address:** Bridgeman Place Works, Salop Street, Bolton, Lancashire (Bolton, Greater Manchester)
- **Price:** £1,800,000 _(£1,800,000)_
- **Size:** 28,211 sq. ft. (28,211 sq ft)
- **Type:** Commercial Development
- **Agent:** Fletcher CRE LTD, Bolton
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1800000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759313315085665#/?channel=COM_BUY

### Swan  Barristers, 2-4 Churchgate, Bolton, BL1 1HJ — £1,200,000 Offers in Excess of

- **Address:** Swan  Barristers, 2-4 Churchgate, Bolton, BL1 1HJ (Bolton, Greater Manchester)
- **Price:** £1,200,000 Offers in Excess of _(£1,200,000)_
- **Size:** 11,326 sq. ft. (11,326 sq ft)
- **Type:** Pub · FREEHOLD
- **Agent:** Savills, Manchester - Licensed Leisure
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1200000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/723062151173152#/?channel=COM_BUY

### The Swan & Barristers, 2-4 Churchgate, Bolton, BL1 1HJ — £1,200,000

- **Address:** The Swan & Barristers, 2-4 Churchgate, Bolton, BL1 1HJ (Bolton, Greater Manchester)
- **Price:** £1,200,000 _(£1,200,000)_
- **Size:** n/a
- **Type:** Pub · FREEHOLD
- **Agent:** Christie & Co, Pubs & Restaurants
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 1200000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/730294920018513#/?channel=COM_BUY

### WESTGATE HOUSE, 1 WESTGATE AVENUE, BOLTON, BL1 — £850,000

- **Address:** WESTGATE HOUSE, 1 WESTGATE AVENUE, BOLTON, BL1 (Bolton, Greater Manchester)
- **Price:** £850,000 _(£850,000)_
- **Size:** 7,000 sq. ft. (7,000 sq ft)
- **Type:** Office
- **Agent:** Nolan Real Estate, Bury
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 7000 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759452932809904#/?channel=COM_BUY

### Red Lion, 1-3 Salford Road, Bolton, BL5 1BJ — £750,000 Offers in Region of

- **Address:** Red Lion, 1-3 Salford Road, Bolton, BL5 1BJ (Bolton, Greater Manchester)
- **Price:** £750,000 Offers in Region of _(£750,000)_
- **Size:** 35,719 sq. ft. (35,719 sq ft)
- **Type:** Pub · FREEHOLD
- **Agent:** Savills, Manchester - Licensed Leisure
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 750000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/757452912626721#/?channel=COM_BUY

### Unit 3 & Car Park, 178/200 Lever Street, Bolton, Bolton, Bolton, Lancashire, BL3 6NZ — £750,000

- **Address:** Unit 3 & Car Park, 178/200 Lever Street, Bolton, Bolton, Bolton, Lancashire, BL3 6NZ (Bolton, Greater Manchester)
- **Price:** £750,000 _(£750,000)_
- **Size:** n/a
- **Type:** Light Industrial
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Citywide Investors (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Citywide Investors territory (prescoped — not scored); price 750000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/760715703659920#/?channel=COM_BUY

### BEDFORD HOUSE, 60 CHORLEY NEW ROAD , BOLTON, GREATER MANCHESTER, BL1 4DA — £650,000

- **Address:** BEDFORD HOUSE, 60 CHORLEY NEW ROAD , BOLTON, GREATER MANCHESTER, BL1 4DA (Bolton, Greater Manchester)
- **Price:** £650,000 _(£650,000)_
- **Size:** 5,346 sq. ft. (5,346 sq ft)
- **Type:** Office
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 5346 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760714627810529#/?channel=COM_BUY

### 173 CHORLEY NEW ROAD, BOLTON, GREATER MANCHESTER, BL1 4QZ — £600,000

- **Address:** 173 CHORLEY NEW ROAD, BOLTON, GREATER MANCHESTER, BL1 4QZ (Bolton, Greater Manchester)
- **Price:** £600,000 _(£600,000)_
- **Size:** 4,668 sq. ft. (4,668 sq ft)
- **Type:** Office
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 4668 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760714856408001#/?channel=COM_BUY

### Beacon House, 69-73 Manchester Road, Bolton, BL2 1ES — £450,000 Offers in Region of

- **Address:** Beacon House, 69-73 Manchester Road, Bolton, BL2 1ES (Bolton, Greater Manchester)
- **Price:** £450,000 Offers in Region of _(£450,000)_
- **Size:** 5,213 sq. ft. (5,213 sq ft)
- **Type:** Office
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 5213 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760715670176049#/?channel=COM_BUY

### 23 Mawdsley Street, Bolton, BL1 1LL — £375,000 Offers in Region of

- **Address:** 23 Mawdsley Street, Bolton, BL1 1LL (Bolton, Greater Manchester)
- **Price:** £375,000 Offers in Region of _(£375,000)_
- **Size:** 8,288 sq. ft. (8,288 sq ft)
- **Type:** Leisure Facility
- **Agent:** Turner Westwell Commercial Agents, Chorley
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 8288 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760927203609520#/?channel=COM_BUY

### 179 Chorley New Road, Bolton, Lancashire, BL1 4QZ — £365,000

- **Address:** 179 Chorley New Road, Bolton, Lancashire, BL1 4QZ (Bolton, Greater Manchester)
- **Price:** £365,000 _(£365,000)_
- **Size:** 3,625 sq. ft. (3,625 sq ft)
- **Type:** Office
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 3625 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/760715194123232#/?channel=COM_BUY

### 9A Gaskell Court , Churchgate, Bolton, BL1 1HU — £350,000

- **Address:** 9A Gaskell Court , Churchgate, Bolton, BL1 1HU (Bolton, Greater Manchester)
- **Price:** £350,000 _(£350,000)_
- **Size:** 3,645 sq. ft. (3,645 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Fletcher CRE LTD, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 3645 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/759313885420993#/?channel=COM_BUY

### White Lion Brow, Bolton, BL1 — £325,000 Offers Over

- **Address:** White Lion Brow, Bolton, BL1 (Bolton, Greater Manchester)
- **Price:** £325,000 Offers Over _(£325,000)_
- **Size:** 25,700 sq. ft. (25,700 sq ft)
- **Type:** Commercial Development
- **Agent:** Miller Metcalfe, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 25700 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/88636776#/?channel=COM_BUY

### 477 Leigh Road, Westhoughton, Bolton, Lancashire, BL5 — £215,000

- **Address:** 477 Leigh Road, Westhoughton, Bolton, Lancashire, BL5 (Bolton, Greater Manchester)
- **Price:** £215,000 _(£215,000)_
- **Size:** 2,088 sq. ft. (2,088 sq ft)
- **Type:** Office
- **Agent:** Fletcher CRE LTD, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 2088 >= min 2000; keyword hit "office"
- **Listing:** https://www.rightmove.co.uk/properties/759313776288321#/?channel=COM_BUY

### Travis Perkins  Bark Street  Bolton  BL1 2BB  United Kingdom — POA

- **Address:** Travis Perkins  Bark Street  Bolton  BL1 2BB  United Kingdom (Bolton, Greater Manchester)
- **Price:** POA _(£1)_
- **Size:** 8,793 sq. ft. (8,793 sq ft)
- **Type:** Industrial Park · FREEHOLD
- **Agent:** Colliers International, Industrial - Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 8793 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173634371#/?channel=COM_BUY

### Hardman Street, Bolton, Greater Manchester, BL4 — £365,000 Offers in Region of

- **Address:** Hardman Street, Bolton, Greater Manchester, BL4 (Bolton, Greater Manchester)
- **Price:** £365,000 Offers in Region of _(£365,000)_
- **Size:** 3,000 sq. ft. (3,000 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Josephs Estates, Bolton
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 3000 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/89191197#/?channel=COM_BUY

### Bolton Road, Kearsley, Bolton, BL4 8NG — £250,000 Guide Price

- **Address:** Bolton Road, Kearsley, Bolton, BL4 8NG (Bolton, Greater Manchester)
- **Price:** £250,000 Guide Price _(£250,000)_ · auction
- **Size:** 4,897 sq. ft. (4,897 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Hyde Estate & Lettings Agents, Manchester
- **Matched requirement:** Educating Excellence (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Educating Excellence territory (prescoped — not scored); size 4897 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90635571#/?channel=COM_BUY

## Scraped but did not pass Stage-0

277 investable listings scored below the bar (geography not scored — these counts reflect price/size/keyword signals only).

| Best score | Listings | Typical shortfall |
|---|---|---|
| 0/2 | 96 | no non-geo signal at all (POA price, no size given, no keyword hit) |
| 1/2 | 181 | one signal only — e.g. keyword but price outside budget / size unknown |

