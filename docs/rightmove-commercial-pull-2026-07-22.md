# Rightmove Commercial — live for-sale pull + Stage-0 filter

**Date:** 2026-07-22 · **Source:** rightmove.co.uk commercial-property-for-sale (search pages, `__NEXT_DATA__` plain JSON) · **Mode:** read-only live pull

Searched **7 cities** (Citywide footprint: Yorkshire + Greater Manchester). Portal reports **864** matching results across those searches; fetched a capped **555** (max 5 pages/city, 1.5 s between requests), **555** after cross-city dedupe. **97** business-for-sale going concerns excluded by subtype, leaving **458** investable listings. Stage-0 (minimum bar **2**, geography excluded from scoring — see below) passed **201**.

## Corrections applied in this run (vs the first 2026-07-14 pull)

The first pull passed **335 of 554 (60%)** — inflated, because the searches were already geo-scoped, so every listing collected the geography point for free and the effective bar collapsed to a single keyword hit (all 219 failures scored exactly 1, geography-only). Two fixes applied for this run:

1. **Portal-aware Stage-0 (`geoPrescoped`)** — geography earns no point on a geo-scoped pull; it acts as a precondition instead (a listing outside a requirement's territory cannot match that requirement at all). The 2-point bar now applies to price/size/keywords only.
2. **Going-concern subtype filter** — business-for-sale listings (cafés, restaurants, takeaways, salons, convenience stores, guest houses/B&Bs, ...) are excluded before scoring. Premises and development stock (offices, industrial, retail property, mixed use, commercial/residential development, land) are kept — **as are pubs, bars/nightclubs and hotels** (decision 2026-07-14: at Citywide's price band a large freehold pub/hotel is genuine C2R conversion stock, and the price+keyword bar filters small trading businesses anyway).

Excluded by subtype:

| Subtype | Excluded |
|---|---|
| Restaurant | 39 |
| Cafe | 30 |
| Takeaway | 19 |
| Convenience Store | 7 |
| Hairdresser / Barber Shop | 1 |
| Post Office | 1 |

| City | Region | Portal results | Fetched (deduped) |
|---|---|---|---|
| Leeds | Yorkshire | 217 | 117 |
| Sheffield | Yorkshire | 167 | 114 |
| Bradford | Yorkshire | 80 | 61 |
| Huddersfield | Yorkshire | 58 | 44 |
| Doncaster | Yorkshire | 47 | 44 |
| Manchester | Greater Manchester | 220 | 120 |
| Bolton | Greater Manchester | 75 | 55 |

> robots.txt (checked at pull time) does **not** disallow the commercial `find.html` search path (only contact/map/photo/full-description paths). Portal ToS may still restrict automated collection — in the CAIS pipeline Rightmove remains a route-to-review portal source (spec §4/§5); this was an explicit low-volume read-only pull.

## Agent coverage

**151 distinct agents/branches** appear in the 555 fetched listings (counted before the subtype filter — coverage is a property of the portal, not of our filtering) — vs one agent per bespoke source. 87 distinct agents appear in the Stage-0-passed set.

Top agents by listing count:

| Agent / branch | Listings |
|---|---|
| Ernest Wilson & Co Limited, EW Leeds | 105 |
| BTG Eddisons Property Auctions, Commercial Nationwide | 22 |
| Crosthwaite Commercial Limited, Sheffield | 18 |
| Harvey Silver Hodgkinson, Hale | 18 |
| Knight Frank, Sheffield | 13 |
| Alan J Picken, Ilkley | 12 |
| Eddisons Commercial Limited, Sheffield | 12 |
| Carter Towler, Leeds | 10 |
| Christie & Co, Pubs & Restaurants | 10 |
| W T Gunson, Manchester - BPG | 9 |
| JBrown International, London | 9 |
| BRAMLEYS LLP, Huddersfield | 8 |
| PPH Commercial Limited, Doncaster | 8 |
| Eddisons Commercial Limited, Bradford | 7 |
| Knight Frank, Leeds - Commercial | 7 |

## Passed the filter

### Post Office, High Street, Wetherby, Leeds — £595,000 Guide Price

- **Address:** Post Office, High Street, Wetherby, Leeds (Leeds, Yorkshire)
- **Price:** £595,000 Guide Price _(£595,000)_
- **Size:** 2,141 sq. ft. (2,141 sq ft)
- **Type:** Mixed Use · FREEHOLD
- **Agent:** Malcolm Stuart Property Consultants LLP, Tadcaster
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 2141 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/762347564791921#/?channel=COM_BUY

### Central House, 47 St Paul's Street, Leeds, LS1 2TE — £2,855,000 Offers in Excess of

- **Address:** Central House, 47 St Paul's Street, Leeds, LS1 2TE (Leeds, Yorkshire)
- **Price:** £2,855,000 Offers in Excess of _(£2,855,000)_
- **Size:** 10,006 sq. ft. (10,006 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Northcap, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 10006 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90125895#/?channel=COM_BUY

### Carlton Trading Estate, Pickering Street, Armley, Leeds — £1,660,000 Offers in Region of

- **Address:** Carlton Trading Estate, Pickering Street, Armley, Leeds (Leeds, Yorkshire)
- **Price:** £1,660,000 Offers in Region of _(£1,660,000)_
- **Size:** 57,675 sq. ft. (57,675 sq ft)
- **Type:** Industrial Park · FREEHOLD
- **Agent:** Northcap, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Data Centre Development territory (prescoped — not scored); size 57675 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/747888028746705#/?channel=COM_BUY

### 1-2 Deanhurst Park, Gelderd Road, Gildersome, Morley, Leeds — £725,000

- **Address:** 1-2 Deanhurst Park, Gelderd Road, Gildersome, Morley, Leeds (Leeds, Yorkshire)
- **Price:** £725,000 _(£725,000)_
- **Size:** 5,242 sq. ft. (5,242 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Crans Property Consultants, Huddersfield
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Residential Conversion territory (prescoped — not scored); price 725000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/747152224116992#/?channel=COM_BUY

### Block E Kirkstall Place, Leeds, LS5 3AS — £320,000 Offers in Excess of

- **Address:** Block E Kirkstall Place, Leeds, LS5 3AS (Leeds, Yorkshire)
- **Price:** £320,000 Offers in Excess of _(£320,000)_
- **Size:** 2,287 sq. ft. (2,287 sq ft)
- **Type:** Retail Property (high street) · LEASEHOLD
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 2287 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/746775993034384#/?channel=COM_BUY

### Fulneck School, Fulneck, Pudsey, Leeds — POA

- **Address:** Fulneck School, Fulneck, Pudsey, Leeds (Leeds, Yorkshire)
- **Price:** POA _(£3,000,000)_
- **Size:** 88,670 sq. ft. (88,670 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Hilco Global Real Estate Advisory, London
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 88670 >= min 2000; keyword hit "school"
- **Listing:** https://www.rightmove.co.uk/properties/740658350981712#/?channel=COM_BUY

### Edison Business Centre, Ring Road, Leeds, LS13 4ET — £2,950,000

- **Address:** Edison Business Centre, Ring Road, Leeds, LS13 4ET (Leeds, Yorkshire)
- **Price:** £2,950,000 _(£2,950,000)_
- **Size:** 48,943 sq. ft. (48,943 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Data Centre Development territory (prescoped — not scored); size 48943 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/173317376#/?channel=COM_BUY

### Units 1, 2, 3 & 4, Spence Lane, Leeds, LS12 1EF — £2,500,000 Offers in Region of

- **Address:** Units 1, 2, 3 & 4, Spence Lane, Leeds, LS12 1EF (Leeds, Yorkshire)
- **Price:** £2,500,000 Offers in Region of _(£2,500,000)_
- **Size:** 9,831 sq. ft. (9,831 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 9831 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/761850891905793#/?channel=COM_BUY

### 14 Manor Street, Leeds, LS7 1PZ — POA

- **Address:** 14 Manor Street, Leeds, LS7 1PZ (Leeds, Yorkshire)
- **Price:** POA _(£2,500,000)_
- **Size:** 4,419–40,808 sq. ft. (40,808 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Newmark, Industrial - Manchester
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Data Centre Development territory (prescoped — not scored); size 40808 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/754922371454161#/?channel=COM_BUY

### Tannery Square, Meanwood, Leeds, LS6 4LT — £2,000,000 Offers in Region of

- **Address:** Tannery Square, Meanwood, Leeds, LS6 4LT (Leeds, Yorkshire)
- **Price:** £2,000,000 Offers in Region of _(£2,000,000)_
- **Size:** 7,811 sq. ft. (7,811 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Fox Lloyd Jones, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 7811 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/751133814140048#/?channel=COM_BUY

### Laurel House 146-148 Garnet Road, Leeds, LS11 5HP — £2,000,000 Offers in Region of

- **Address:** Laurel House 146-148 Garnet Road, Leeds, LS11 5HP (Leeds, Yorkshire)
- **Price:** £2,000,000 Offers in Region of _(£2,000,000)_
- **Size:** 575–53,252 sq. ft. (53,252 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Data Centre Development territory (prescoped — not scored); size 53252 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/698587804331425#/?channel=COM_BUY

### Haigh House, The Grange, Three Cottages, Barn, Stables, Lake and 14 Acres of Land, Wakefield Road, Rothwell Haigh, LS26 — £1,850,000 Offers in Region of

- **Address:** Haigh House, The Grange, Three Cottages, Barn, Stables, Lake and 14 Acres of Land, Wakefield Road, Rothwell Haigh, LS26 (Leeds, Yorkshire)
- **Price:** £1,850,000 Offers in Region of _(£1,850,000)_
- **Size:** n/a
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Simon Blyth Estate Agents, Holmfirth
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Residential Conversion territory (prescoped — not scored); price 1850000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/89659935#/?channel=COM_BUY

### 43 Park Place, Leeds, LS1 2RY — £1,800,000

- **Address:** 43 Park Place, Leeds, LS1 2RY (Leeds, Yorkshire)
- **Price:** £1,800,000 _(£1,800,000)_
- **Size:** 8,997 sq. ft. (8,997 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Knight Frank, Leeds - Commercial
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Residential Conversion territory (prescoped — not scored); price 1800000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/154042034#/?channel=COM_BUY

### 26-27 Park Square West, Leeds, LS1 2PL — £1,500,000 Offers in Excess of

- **Address:** 26-27 Park Square West, Leeds, LS1 2PL (Leeds, Yorkshire)
- **Price:** £1,500,000 Offers in Excess of _(£1,500,000)_
- **Size:** 5,856 sq. ft. (5,856 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 5856 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/698589182145520#/?channel=COM_BUY

### 26/27 Park Square West, Leeds, LS1 2PL — £1,500,000 Offers in Excess of

- **Address:** 26/27 Park Square West, Leeds, LS1 2PL (Leeds, Yorkshire)
- **Price:** £1,500,000 Offers in Excess of _(£1,500,000)_
- **Size:** 5,856 sq. ft. (5,856 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Fox Lloyd Jones, Leeds
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Residential Conversion territory (prescoped — not scored); price 1500000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/721600241041920#/?channel=COM_BUY

### Haulage, West Yorkshire, West Yorkshire — £1,500,000

- **Address:** Haulage, West Yorkshire, West Yorkshire (Leeds, Yorkshire)
- **Price:** £1,500,000 _(£1,500,000)_
- **Size:** n/a
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Residential Conversion territory (prescoped — not scored); price 1500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/153559232#/?channel=COM_BUY

### United House, 170 Elland Road, Leeds, LS11 8BU — £1,450,000

- **Address:** United House, 170 Elland Road, Leeds, LS11 8BU (Leeds, Yorkshire)
- **Price:** £1,450,000 _(£1,450,000)_
- **Size:** 9,765 sq. ft. (9,765 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 9765 >= min 2000; keyword hit "gym"
- **Listing:** https://www.rightmove.co.uk/properties/90605949#/?channel=COM_BUY

### Building/Home Improvement, West Yorkshire, West Yorkshire — £1,400,000

- **Address:** Building/Home Improvement, West Yorkshire, West Yorkshire (Leeds, Yorkshire)
- **Price:** £1,400,000 _(£1,400,000)_
- **Size:** n/a
- **Type:** Residential Development · FREEHOLD
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Residential Conversion territory (prescoped — not scored); price 1400000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/170335808#/?channel=COM_BUY

### 13-14 Park Place, Leeds, LS1 2SJ — £1,013,000 Offers in Excess of

- **Address:** 13-14 Park Place, Leeds, LS1 2SJ (Leeds, Yorkshire)
- **Price:** £1,013,000 Offers in Excess of _(£1,013,000)_
- **Size:** 5,858 sq. ft. (5,858 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Northcap, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 5858 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90125763#/?channel=COM_BUY

### Industrial / Warehouse Unit  Cross Chancellor Street  Leeds West Yorkshire — POA

- **Address:** Industrial / Warehouse Unit  Cross Chancellor Street  Leeds West Yorkshire (Leeds, Yorkshire)
- **Price:** POA _(£1,000,000)_
- **Size:** 18,818 sq. ft. (18,818 sq ft)
- **Type:** Industrial Park · FREEHOLD
- **Agent:** Colliers International, Industrial
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 18818 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/169014953#/?channel=COM_BUY

### Romero House 8 Airport West, Lancaster Way, Yeadon, Leeds, West Yorkshire, LS19 — £1,000,000 Offers in Excess of

- **Address:** Romero House 8 Airport West, Lancaster Way, Yeadon, Leeds, West Yorkshire, LS19 (Leeds, Yorkshire)
- **Price:** £1,000,000 Offers in Excess of _(£1,000,000)_
- **Size:** 12,447 sq. ft. (12,447 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Carter Jonas, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 12447 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/763663953304416#/?channel=COM_BUY

### 1 City West Gelderd Road, Leeds, LS12 6NJ — £995,000 Offers in Region of

- **Address:** 1 City West Gelderd Road, Leeds, LS12 6NJ (Leeds, Yorkshire)
- **Price:** £995,000 Offers in Region of _(£995,000)_
- **Size:** 550–9,210 sq. ft. (9,210 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 9210 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/762214045440304#/?channel=COM_BUY

### Pavilion Court, Green Lane, Garforth, Leeds, LS25 2AF — £900,000

- **Address:** Pavilion Court, Green Lane, Garforth, Leeds, LS25 2AF (Leeds, Yorkshire)
- **Price:** £900,000 _(£900,000)_
- **Size:** 6,055 sq. ft. (6,055 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 6055 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/91093677#/?channel=COM_BUY

### Hawthorn Park, Coal Road, Whinmoor, Leeds — £900,000

- **Address:** Hawthorn Park, Coal Road, Whinmoor, Leeds (Leeds, Yorkshire)
- **Price:** £900,000 _(£900,000)_
- **Size:** 6,800 sq. ft. (6,800 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** NABARRO MCALLISTER & CO LIMITED, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 6800 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/758741004284305#/?channel=COM_BUY

### Oxford Chambers, Oxford Place, Leeds, LS1 3AX — £850,000

- **Address:** Oxford Chambers, Oxford Place, Leeds, LS1 3AX (Leeds, Yorkshire)
- **Price:** £850,000 _(£850,000)_
- **Size:** n/a
- **Type:** Land · FREEHOLD
- **Agent:** Knight Frank, Leeds - Commercial
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Residential Conversion territory (prescoped — not scored); price 850000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/169402238#/?channel=COM_BUY

### Valley Mills, Meanwood, Leeds — £800,000 Offers in Excess of

- **Address:** Valley Mills, Meanwood, Leeds (Leeds, Yorkshire)
- **Price:** £800,000 Offers in Excess of _(£800,000)_
- **Size:** n/a
- **Type:** Industrial Park
- **Agent:** NABARRO MCALLISTER & CO LIMITED, Leeds
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Residential Conversion territory (prescoped — not scored); price 800000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742243428792497#/?channel=COM_BUY

### 60 Wellington Street, Leeds, LS1 2EE — £795,000 Offers in Region of

- **Address:** 60 Wellington Street, Leeds, LS1 2EE (Leeds, Yorkshire)
- **Price:** £795,000 Offers in Region of _(£795,000)_
- **Size:** 3,003 sq. ft. (3,003 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 3003 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90853236#/?channel=COM_BUY

### 3365 The Pentagon, Century Way, Thorpe Park, Leeds, LS15 8ZB — £775,000 Offers in Region of

- **Address:** 3365 The Pentagon, Century Way, Thorpe Park, Leeds, LS15 8ZB (Leeds, Yorkshire)
- **Price:** £775,000 Offers in Region of _(£775,000)_
- **Size:** 3,887 sq. ft. (3,887 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Knight Frank, Leeds - Commercial
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 3887 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/170303204#/?channel=COM_BUY

### 6-8 The Headrow, Leeds, LS1 6PT — £725,000 Offers in Region of

- **Address:** 6-8 The Headrow, Leeds, LS1 6PT (Leeds, Yorkshire)
- **Price:** £725,000 Offers in Region of _(£725,000)_
- **Size:** 5,275 sq. ft. (5,275 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 5275 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173139890#/?channel=COM_BUY

### Unit 7 Weaver Street, Leeds, West Yorkshire, LS4 2AU — £695,000 From

- **Address:** Unit 7 Weaver Street, Leeds, West Yorkshire, LS4 2AU (Leeds, Yorkshire)
- **Price:** £695,000 From _(£695,000)_
- **Size:** 7,244–14,488 sq. ft. (14,488 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** GV&Co, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 14488 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760579420307808#/?channel=COM_BUY

### 2 Moorland Road, Hyde Park, Leeds, LS6 1AL — £650,000 Offers in Region of

- **Address:** 2 Moorland Road, Hyde Park, Leeds, LS6 1AL (Leeds, Yorkshire)
- **Price:** £650,000 Offers in Region of _(£650,000)_
- **Size:** 3,779 sq. ft. (3,779 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Residential Conversion territory (prescoped — not scored); price 650000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/722868246358240#/?channel=COM_BUY

### Former Dixons Automotives, Wakefield Road, Rothwell, Leeds, West Yorkshire, LS26 0SB — £625,000 Offers in Region of

- **Address:** Former Dixons Automotives, Wakefield Road, Rothwell, Leeds, West Yorkshire, LS26 0SB (Leeds, Yorkshire)
- **Price:** £625,000 Offers in Region of _(£625,000)_
- **Size:** 9,596 sq. ft. (9,596 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 9596 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760575595098784#/?channel=COM_BUY

### 82 York Road, Leeds, LS9 9AA — £595,000

- **Address:** 82 York Road, Leeds, LS9 9AA (Leeds, Yorkshire)
- **Price:** £595,000 _(£595,000)_
- **Size:** 5,982 sq. ft. (5,982 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 5982 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/89173143#/?channel=COM_BUY

### 22-26 Town Street, Farsley, Leeds, LS28 5LD & No's 1 &2 Gambles Hill, Farsley, LS28 5SW — £525,000 Guide Price

- **Address:** 22-26 Town Street, Farsley, Leeds, LS28 5LD & No's 1 &2 Gambles Hill, Farsley, LS28 5SW (Leeds, Yorkshire)
- **Price:** £525,000 Guide Price _(£525,000)_
- **Size:** n/a
- **Type:** Leisure Facility
- **Agent:** ATKINSON ASSOCIATES, Ilkley
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Residential Conversion territory (prescoped — not scored); price 525000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/753319440769232#/?channel=COM_BUY

### Madeley House, John Charles Way, Leeds, LS12 6QA — £475,000

- **Address:** Madeley House, John Charles Way, Leeds, LS12 6QA (Leeds, Yorkshire)
- **Price:** £475,000 _(£475,000)_
- **Size:** 3,865 sq. ft. (3,865 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 3865 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90065235#/?channel=COM_BUY

### Lidgett House, 56 Lidgett Lane, Leeds, LS25 1LL — £450,000 Offers in Region of

- **Address:** Lidgett House, 56 Lidgett Lane, Leeds, LS25 1LL (Leeds, Yorkshire)
- **Price:** £450,000 Offers in Region of _(£450,000)_
- **Size:** 3,445 sq. ft. (3,445 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 3445 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/160139987#/?channel=COM_BUY

### Cottingley Community Church, Cottingley Approach, Cottingley, Leeds — £450,000

- **Address:** Cottingley Community Church, Cottingley Approach, Cottingley, Leeds (Leeds, Yorkshire)
- **Price:** £450,000 _(£450,000)_
- **Size:** 6,020 sq. ft. (6,020 sq ft)
- **Type:** Commercial Development
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 6020 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/760934249808369#/?channel=COM_BUY

### Delacey House, Abbey Road, Leeds, LS5 3HS — £375,000 Offers in Region of

- **Address:** Delacey House, Abbey Road, Leeds, LS5 3HS (Leeds, Yorkshire)
- **Price:** £375,000 Offers in Region of _(£375,000)_
- **Size:** 4,620 sq. ft. (4,620 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 4620 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/751715844897377#/?channel=COM_BUY

### The Venerable Bede Wyther Houghley Lane, Leeds, LS13 4AU — £350,000 Offers in Region of

- **Address:** The Venerable Bede Wyther Houghley Lane, Leeds, LS13 4AU (Leeds, Yorkshire)
- **Price:** £350,000 Offers in Region of _(£350,000)_
- **Size:** 11,870 sq. ft. (11,870 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 11870 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/733005147134577#/?channel=COM_BUY

### Micklethwaite House, 70 Cross Green Lane, Leeds, LS9 0DG — £350,000 Offers in Excess of

- **Address:** Micklethwaite House, 70 Cross Green Lane, Leeds, LS9 0DG (Leeds, Yorkshire)
- **Price:** £350,000 Offers in Excess of _(£350,000)_
- **Size:** 36,791 sq. ft. (36,791 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Data Centre Development territory (prescoped — not scored); size 36791 >= min 20000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/752427605792256#/?channel=COM_BUY

### 20 & 22, St Michael's Road, Leeds, LS6 3AW — £325,000 Offers in Excess of

- **Address:** 20 & 22, St Michael's Road, Leeds, LS6 3AW (Leeds, Yorkshire)
- **Price:** £325,000 Offers in Excess of _(£325,000)_
- **Size:** 2,333 sq. ft. (2,333 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in School Conversion territory (prescoped — not scored); size 2333 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/87844530#/?channel=COM_BUY

### Poplar Products, Ramshead Approach, Seacroft, Leeds — £300,000 From

- **Address:** Poplar Products, Ramshead Approach, Seacroft, Leeds (Leeds, Yorkshire)
- **Price:** £300,000 From _(£300,000)_
- **Size:** 30,742 sq. ft. (30,742 sq ft)
- **Type:** Light Industrial · LEASEHOLD
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Leeds Yorkshire" in Data Centre Development territory (prescoped — not scored); size 30742 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/760934272987537#/?channel=COM_BUY

### 24 Meadowhall Road, Sheffield, South Yorkshire, S9 1BS — POA

- **Address:** 24 Meadowhall Road, Sheffield, South Yorkshire, S9 1BS (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 6,286 sq. ft. (6,286 sq ft)
- **Type:** Showroom
- **Agent:** Flint Real Estate, Doncaster
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 6286 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760551129667441#/?channel=COM_BUY

### WILSON CARLILE CENTRE, 50 CAVENDISH STREET, SHEFFIELD, YORKSHIRE, S3 — £3,000,000 Guide Price

- **Address:** WILSON CARLILE CENTRE, 50 CAVENDISH STREET, SHEFFIELD, YORKSHIRE, S3 (Sheffield, Yorkshire)
- **Price:** £3,000,000 Guide Price _(£3,000,000)_
- **Size:** 22,881 sq. ft. (22,881 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Bruton Knowles, Gloucester
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 22881 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/760730285095312#/?channel=COM_BUY

### Lifestyle House 2 Melbourne Avenue, Sheffield, S10 2QH — £1,500,000 Offers in Excess of

- **Address:** Lifestyle House 2 Melbourne Avenue, Sheffield, S10 2QH (Sheffield, Yorkshire)
- **Price:** £1,500,000 Offers in Excess of _(£1,500,000)_
- **Size:** 17,685 sq. ft. (17,685 sq ft)
- **Type:** Residential Development · FREEHOLD
- **Agent:** Sanderson Weatherall, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 17685 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/698589255316017#/?channel=COM_BUY

### Unit 3 Waterside Court, Bold Street, Sheffield, South Yorkshire, S9 2LR — £650,000 Guide Price

- **Address:** Unit 3 Waterside Court, Bold Street, Sheffield, South Yorkshire, S9 2LR (Sheffield, Yorkshire)
- **Price:** £650,000 Guide Price _(£650,000)_ · auction
- **Size:** n/a
- **Type:** Office · FREEHOLD
- **Agent:** Auction Estates Ltd, Nottingham
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Residential Conversion territory (prescoped — not scored); price 650000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90471561#/?channel=COM_BUY

### Aspect Court, Pond Street, Sheffield, S1 2BG — £6,000,000

- **Address:** Aspect Court, Pond Street, Sheffield, S1 2BG (Sheffield, Yorkshire)
- **Price:** £6,000,000 _(£6,000,000)_
- **Size:** 57,842 sq. ft. (57,842 sq ft)
- **Type:** Office
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 57842 >= min 20000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/760571878944801#/?channel=COM_BUY

### Pheasant Works, Surbiton Street, Sheffield, South Yorkshire, S9 5AQ — £2,800,000

- **Address:** Pheasant Works, Surbiton Street, Sheffield, South Yorkshire, S9 5AQ (Sheffield, Yorkshire)
- **Price:** £2,800,000 _(£2,800,000)_
- **Size:** 35,523 sq. ft. (35,523 sq ft)
- **Type:** Light Industrial
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 35523 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/762397808152992#/?channel=COM_BUY

### Glossop Road, Sheffield — POA

- **Address:** Glossop Road, Sheffield (Sheffield, Yorkshire)
- **Price:** POA _(£2,600,000)_
- **Size:** 1,222–22,259 sq. ft. (22,259 sq ft)
- **Type:** Residential Development · FREEHOLD
- **Agent:** Fowler Sandford LLP, Sheffield
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 22259 >= min 20000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760773543125345#/?channel=COM_BUY

### Queen Street, Sheffield — £2,250,000

- **Address:** Queen Street, Sheffield (Sheffield, Yorkshire)
- **Price:** £2,250,000 _(£2,250,000)_
- **Size:** 4,521 sq. ft. (4,521 sq ft)
- **Type:** Hotel · FREEHOLD
- **Agent:** GPS Commercial, Eastbourne
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 4521 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760545966541872#/?channel=COM_BUY

### Group of Dental Investments, UK Wide — £2,000,000 Guide Price

- **Address:** Group of Dental Investments, UK Wide (Sheffield, Yorkshire)
- **Price:** £2,000,000 Guide Price _(£2,000,000)_
- **Size:** n/a
- **Type:** Healthcare Facility · FREEHOLD
- **Agent:** Christie & Co, Dental
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Residential Conversion territory (prescoped — not scored); price 2000000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760779631160737#/?channel=COM_BUY

### Sheffield Cold Stores, Roman Ridge Road, Sheffield, S9 — £1,950,000

- **Address:** Sheffield Cold Stores, Roman Ridge Road, Sheffield, S9 (Sheffield, Yorkshire)
- **Price:** £1,950,000 _(£1,950,000)_
- **Size:** 44,910 sq. ft. (44,910 sq ft)
- **Type:** Warehouse
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 44910 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/754599909254481#/?channel=COM_BUY

### 197 Holme Lane, Sheffield, S6 — £1,800,000 Offers in Region of

- **Address:** 197 Holme Lane, Sheffield, S6 (Sheffield, Yorkshire)
- **Price:** £1,800,000 Offers in Region of _(£1,800,000)_
- **Size:** 28,497 sq. ft. (28,497 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 28497 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/165618794#/?channel=COM_BUY

### Poplar Way, Rotherham — £1,500,000 Offers in Region of

- **Address:** Poplar Way, Rotherham (Sheffield, Yorkshire)
- **Price:** £1,500,000 Offers in Region of _(£1,500,000)_
- **Size:** 97,574 sq. ft. (97,574 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** BARKER PROUDLOVE LIMITED, Manchester
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Residential Conversion territory (prescoped — not scored); price 1500000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/760015858866432#/?channel=COM_BUY

### 386 Coleridge Road, Sheffield, S9 — POA

- **Address:** 386 Coleridge Road, Sheffield, S9 (Sheffield, Yorkshire)
- **Price:** POA _(£1,250,000)_
- **Size:** 12,656 sq. ft. (12,656 sq ft)
- **Type:** Light Industrial
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Residential Conversion territory (prescoped — not scored); price 1250000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/754599957448257#/?channel=COM_BUY

### 38-40, 42, 44 And 480 Howard Street, Sheffield, South Yorkshire, S1 2LX — £1,250,000

- **Address:** 38-40, 42, 44 And 480 Howard Street, Sheffield, South Yorkshire, S1 2LX (Sheffield, Yorkshire)
- **Price:** £1,250,000 _(£1,250,000)_
- **Size:** 6,992 sq. ft. (6,992 sq ft)
- **Type:** Shop · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 6992 >= min 2000; keyword hit "educational"
- **Listing:** https://www.rightmove.co.uk/properties/760571799238961#/?channel=COM_BUY

### Waverley Works, Effingham Street, Sheffield,  Waverley Works, Effingham Street, Sheffield — £1,000,000 Guide Price

- **Address:** Waverley Works, Effingham Street, Sheffield,  Waverley Works, Effingham Street, Sheffield (Sheffield, Yorkshire)
- **Price:** £1,000,000 Guide Price _(£1,000,000)_ · auction
- **Size:** 35,000 sq. ft. (35,000 sq ft)
- **Type:** Mixed Use · LEASEHOLD
- **Agent:** Savills, Savills Auctions- Commercial
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 35000 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/746606427835057#/?channel=COM_BUY

### Brightside Lane, Sheffield, S9 — £975,000 Offers in Region of

- **Address:** Brightside Lane, Sheffield, S9 (Sheffield, Yorkshire)
- **Price:** £975,000 Offers in Region of _(£975,000)_
- **Size:** 10,387 sq. ft. (10,387 sq ft)
- **Type:** Office
- **Agent:** Commercial Property Rotherham, Rotherham
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Residential Conversion territory (prescoped — not scored); price 975000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/754397739487104#/?channel=COM_BUY

### Lion Works, 91-103 Spital Hill, Sheffield, South Yorkshire S4 7LD — £975,000 Guide Price

- **Address:** Lion Works, 91-103 Spital Hill, Sheffield, South Yorkshire S4 7LD (Sheffield, Yorkshire)
- **Price:** £975,000 Guide Price _(£975,000)_ · auction
- **Size:** n/a
- **Type:** Commercial Property · FREEHOLD
- **Agent:** BTG Eddisons Property Auctions, Commercial Nationwide
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Residential Conversion territory (prescoped — not scored); price 975000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173041451#/?channel=COM_BUY

### Units 1 To 3, Bold Street, Sheffield, S9 2LR — £950,000 Offers in Excess of

- **Address:** Units 1 To 3, Bold Street, Sheffield, S9 2LR (Sheffield, Yorkshire)
- **Price:** £950,000 Offers in Excess of _(£950,000)_
- **Size:** 10,836 sq. ft. (10,836 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 10836 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760571314744881#/?channel=COM_BUY

### 607-613 Penistone Road, Sheffield, S6 2GA — £900,000

- **Address:** 607-613 Penistone Road, Sheffield, S6 2GA (Sheffield, Yorkshire)
- **Price:** £900,000 _(£900,000)_
- **Size:** 11,403 sq. ft. (11,403 sq ft)
- **Type:** Leisure Facility
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 11403 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/754599953229873#/?channel=COM_BUY

### Woodside Works, Rugby Street, Sheffield, S3 9QH — £895,000

- **Address:** Woodside Works, Rugby Street, Sheffield, S3 9QH (Sheffield, Yorkshire)
- **Price:** £895,000 _(£895,000)_
- **Size:** 44,179 sq. ft. (44,179 sq ft)
- **Type:** Light Industrial
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 44179 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/754599932281041#/?channel=COM_BUY

### Advantage House, Poplar Way, Catcliffe, Rotherham — POA

- **Address:** Advantage House, Poplar Way, Catcliffe, Rotherham (Sheffield, Yorkshire)
- **Price:** POA _(£750,000)_
- **Size:** 19,873 sq. ft. (19,873 sq ft)
- **Type:** Serviced Office · FREEHOLD
- **Agent:** BARKER PROUDLOVE LIMITED, Leeds
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Residential Conversion territory (prescoped — not scored); price 750000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/764544201473408#/?channel=COM_BUY

### 605 Ecclesall Road, Sheffield, South Yorkshire S11 8PT — £750,000 Guide Price

- **Address:** 605 Ecclesall Road, Sheffield, South Yorkshire S11 8PT (Sheffield, Yorkshire)
- **Price:** £750,000 Guide Price _(£750,000)_ · auction
- **Size:** n/a
- **Type:** Commercial Development
- **Agent:** BTG Eddisons Property Auctions, Commercial Nationwide
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Residential Conversion territory (prescoped — not scored); price 750000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/89364471#/?channel=COM_BUY

### Egerton Lane & Land at Evans Street, Sheffield S1 4JX — £695,000

- **Address:** Egerton Lane & Land at Evans Street, Sheffield S1 4JX (Sheffield, Yorkshire)
- **Price:** £695,000 _(£695,000)_
- **Size:** 5,022 sq. ft. (5,022 sq ft)
- **Type:** Residential Development · FREEHOLD
- **Agent:** Blue Alpine, London
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Residential Conversion territory (prescoped — not scored); price 695000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/747098253913009#/?channel=COM_BUY

### 110-114 Mansfield Road, Sheffield S12 2AP — £650,000

- **Address:** 110-114 Mansfield Road, Sheffield S12 2AP (Sheffield, Yorkshire)
- **Price:** £650,000 _(£650,000)_
- **Size:** 4,580 sq. ft. (4,580 sq ft)
- **Type:** Mixed Use · FREEHOLD
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 4580 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/752251579336977#/?channel=COM_BUY

### Kayedee Premises, Stamford Street, Newhall Road Trading Estate, Sheffield, S9 2TX — £500,000

- **Address:** Kayedee Premises, Stamford Street, Newhall Road Trading Estate, Sheffield, S9 2TX (Sheffield, Yorkshire)
- **Price:** £500,000 _(£500,000)_
- **Size:** 21,489 sq. ft. (21,489 sq ft)
- **Type:** Warehouse
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 21489 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/760571990026673#/?channel=COM_BUY

### Five Rivers House,  Savile Street, Sheffield S4 7UD — £475,000 Offers in Excess of

- **Address:** Five Rivers House,  Savile Street, Sheffield S4 7UD (Sheffield, Yorkshire)
- **Price:** £475,000 Offers in Excess of _(£475,000)_
- **Size:** 8,196 sq. ft. (8,196 sq ft)
- **Type:** Office
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 8196 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/757307324194945#/?channel=COM_BUY

### 16-18 & 20 Dixon Lane, Sheffield, S1 2AL — £400,000

- **Address:** 16-18 & 20 Dixon Lane, Sheffield, S1 2AL (Sheffield, Yorkshire)
- **Price:** £400,000 _(£400,000)_
- **Size:** 5,765 sq. ft. (5,765 sq ft)
- **Type:** Commercial Development
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 5765 >= min 2000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/754599940713777#/?channel=COM_BUY

### Unit 1, Daisy Spring Works, Dun Street, Sheffield, S3 8DW — £399,000

- **Address:** Unit 1, Daisy Spring Works, Dun Street, Sheffield, S3 8DW (Sheffield, Yorkshire)
- **Price:** £399,000 _(£399,000)_
- **Size:** 5,500 sq. ft. (5,500 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 5500 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/112995386#/?channel=COM_BUY

### Unit 2B, Junction 34 Industrial Estate, Greasbro Road, Tinsley, Sheffield, S9 1TN — £390,000

- **Address:** Unit 2B, Junction 34 Industrial Estate, Greasbro Road, Tinsley, Sheffield, S9 1TN (Sheffield, Yorkshire)
- **Price:** £390,000 _(£390,000)_
- **Size:** 4,820 sq. ft. (4,820 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 4820 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/762568495545041#/?channel=COM_BUY

### Printhouse, The Printhouse, North Church Street, Sheffield — POA

- **Address:** Printhouse, The Printhouse, North Church Street, Sheffield (Sheffield, Yorkshire)
- **Price:** POA _(£330,000)_
- **Size:** 4,390 sq. ft. (4,390 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Fowler Sandford LLP, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 4390 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/759323486182768#/?channel=COM_BUY

### Alliance House, Roman Ridge Road, Sheffield S9 1GB — £325,000

- **Address:** Alliance House, Roman Ridge Road, Sheffield S9 1GB (Sheffield, Yorkshire)
- **Price:** £325,000 _(£325,000)_
- **Size:** 5,743 sq. ft. (5,743 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 5743 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/744622056476753#/?channel=COM_BUY

### 21 Station Road, Kiveton Park, Sheffield, S26 6QP — £299,950

- **Address:** 21 Station Road, Kiveton Park, Sheffield, S26 6QP (Sheffield, Yorkshire)
- **Price:** £299,950 _(£299,950)_
- **Size:** 2,783 sq. ft. (2,783 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** SMC Brownill Vickers, South Yorkshire
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 2783 >= min 2000; keyword hit "school"
- **Listing:** https://www.rightmove.co.uk/properties/719250187282449#/?channel=COM_BUY

### Land at Green Lane, Ecclesfield, Sheffield S35 9WY — £275,000

- **Address:** Land at Green Lane, Ecclesfield, Sheffield S35 9WY (Sheffield, Yorkshire)
- **Price:** £275,000 _(£275,000)_
- **Size:** 20,042 sq. ft. (20,042 sq ft)
- **Type:** Residential Development · FREEHOLD
- **Agent:** Crosthwaite Commercial Limited, Sheffield
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 20042 >= min 20000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/743551758137296#/?channel=COM_BUY

### 1 Beton House, Park Hill, Rhodes Street, Sheffield, South Yorkshire, S2 5DT — £270,000

- **Address:** 1 Beton House, Park Hill, Rhodes Street, Sheffield, South Yorkshire, S2 5DT (Sheffield, Yorkshire)
- **Price:** £270,000 _(£270,000)_
- **Size:** 2,655 sq. ft. (2,655 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 2655 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/759297143771872#/?channel=COM_BUY

### 145 Attercliffe Common, Sheffield — £195,000 Offers in Region of

- **Address:** 145 Attercliffe Common, Sheffield (Sheffield, Yorkshire)
- **Price:** £195,000 Offers in Region of _(£195,000)_
- **Size:** 2,602 sq. ft. (2,602 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** BARKER PROUDLOVE LIMITED, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 2602 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/758018570995760#/?channel=COM_BUY

### Terry Street, Sheffield — POA

- **Address:** Terry Street, Sheffield (Sheffield, Yorkshire)
- **Price:** POA _(£10)_
- **Size:** 46,139 sq. ft. (46,139 sq ft)
- **Type:** Light Industrial
- **Agent:** CBRE, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 46139 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/744042179075025#/?channel=COM_BUY

### Milton Street, Sheffield, S3 7UF — POA

- **Address:** Milton Street, Sheffield, S3 7UF (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 275,000–350,000 sq. ft. (350,000 sq ft)
- **Type:** Residential Development
- **Agent:** Commercial Property Partners Ltd, Sheffield
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 350000 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/759292704103920#/?channel=COM_BUY

### 13 Birley Vale Avenue, Sheffield S12 — POA

- **Address:** 13 Birley Vale Avenue, Sheffield S12 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 17,630 sq. ft. (17,630 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 17630 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/87778536#/?channel=COM_BUY

### Unit 3, President Way, President Park Sheffield, S4 7UR — POA

- **Address:** Unit 3, President Way, President Park Sheffield, S4 7UR (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 12,413 sq. ft. (12,413 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 12413 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/171086972#/?channel=COM_BUY

### 160 Solly Street, Sheffield, S1 4BF — POA

- **Address:** 160 Solly Street, Sheffield, S1 4BF (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 11,421 sq. ft. (11,421 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 11421 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/164601068#/?channel=COM_BUY

### 50, Broadfield Road, Sheffield, S8 0XJ — POA

- **Address:** 50, Broadfield Road, Sheffield, S8 0XJ (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 3,546 sq. ft. (3,546 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 3546 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/174802055#/?channel=COM_BUY

### 50, Broadfield Road, Sheffield, S8 0XJ — POA

- **Address:** 50, Broadfield Road, Sheffield, S8 0XJ (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 3,546 sq. ft. (3,546 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 3546 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/174801437#/?channel=COM_BUY

### Highfield at Waverley, Highfield Spring, Waverley, Rotherham, S60 — POA

- **Address:** Highfield at Waverley, Highfield Spring, Waverley, Rotherham, S60 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 10,000–80,000 sq. ft. (80,000 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 80000 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/168968804#/?channel=COM_BUY

### Yards C And D, Old Station Drive, Millhouses, Sheffield, S7 2PY — POA

- **Address:** Yards C And D, Old Station Drive, Millhouses, Sheffield, S7 2PY (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 10,890 sq. ft. (10,890 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 10890 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760571922917472#/?channel=COM_BUY

### South West Centre, Troutbeck Road, Sheffield, S8 0JR — POA

- **Address:** South West Centre, Troutbeck Road, Sheffield, S8 0JR (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 42,195 sq. ft. (42,195 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Avison Young (UK) Limited, Land & Development
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 42195 >= min 20000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/88345509#/?channel=COM_BUY

### Pennine House, 35a Business Park, Churchill Way, Ecclesfield, Sheffield, S35 — POA

- **Address:** Pennine House, 35a Business Park, Churchill Way, Ecclesfield, Sheffield, S35 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 9,360 sq. ft. (9,360 sq ft)
- **Type:** Office
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in School Conversion territory (prescoped — not scored); size 9360 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/157397378#/?channel=COM_BUY

### 1 Amberley Street, Sheffield, S9 YO26 — POA

- **Address:** 1 Amberley Street, Sheffield, S9 YO26 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 77,330 sq. ft. (77,330 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 77330 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/151292600#/?channel=COM_BUY

### Plot 10 R-evolution 4 at Advanced Manufacturing Park, Rotherham S60 — POA

- **Address:** Plot 10 R-evolution 4 at Advanced Manufacturing Park, Rotherham S60 (Sheffield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 20,000 sq. ft. (20,000 sq ft)
- **Type:** Industrial Development · FREEHOLD
- **Agent:** Knight Frank, Sheffield
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Sheffield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 20000 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/170842886#/?channel=COM_BUY

### No.1 Midpoint Business Park, 1 Mid Point, Thornbury, Bradford, BD3 7AY — £4,000,000 Offers in Excess of

- **Address:** No.1 Midpoint Business Park, 1 Mid Point, Thornbury, Bradford, BD3 7AY (Bradford, Yorkshire)
- **Price:** £4,000,000 Offers in Excess of _(£4,000,000)_
- **Size:** 39,178 sq. ft. (39,178 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Northcap, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Data Centre Development territory (prescoped — not scored); size 39178 >= min 20000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/89501259#/?channel=COM_BUY

### Land at Hartington Terrace, Bradford — £40,000 Guide Price

- **Address:** Land at Hartington Terrace, Bradford (Bradford, Yorkshire)
- **Price:** £40,000 Guide Price _(£40,000)_ · auction
- **Size:** 2,476 sq. ft. (2,476 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Palace Auctions, London
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in School Conversion territory (prescoped — not scored); size 2476 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/754780241191488#/?channel=COM_BUY

### Futures Way, Off Bolling Road, Bradford, West Yorkshire, BD4 7EB — £4,500,000 Offers in Region of

- **Address:** Futures Way, Off Bolling Road, Bradford, West Yorkshire, BD4 7EB (Bradford, Yorkshire)
- **Price:** £4,500,000 Offers in Region of _(£4,500,000)_
- **Size:** 72,564 sq. ft. (72,564 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Data Centre Development territory (prescoped — not scored); size 72564 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/760556347259392#/?channel=COM_BUY

### West Riding House, 31 Cheapside, Bradford, West Riding House, 31 Cheapside, Bradford — £2,650,000 Guide Price

- **Address:** West Riding House, 31 Cheapside, Bradford, West Riding House, 31 Cheapside, Bradford (Bradford, Yorkshire)
- **Price:** £2,650,000 Guide Price _(£2,650,000)_
- **Size:** 29,351 sq. ft. (29,351 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Savills, City Offices
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Data Centre Development territory (prescoped — not scored); size 29351 >= min 20000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/750945672314128#/?channel=COM_BUY

### Unit 1 -10  Thorncliffe Square, Thorncliffe Road, Bradford, Unit 1, Thorncliffe Square, Thorncliffe Road, Bradford — £1,950,000 Guide Price

- **Address:** Unit 1 -10  Thorncliffe Square, Thorncliffe Road, Bradford, Unit 1, Thorncliffe Square, Thorncliffe Road, Bradford (Bradford, Yorkshire)
- **Price:** £1,950,000 Guide Price _(£1,950,000)_
- **Size:** 12,623 sq. ft. (12,623 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Savills, City Offices
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in School Conversion territory (prescoped — not scored); size 12623 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/763457220195440#/?channel=COM_BUY

### Units D & E, Bradford Business Park, Canal Road, Bradford, BD1 4SJ — £1,750,000 Offers in Region of

- **Address:** Units D & E, Bradford Business Park, Canal Road, Bradford, BD1 4SJ (Bradford, Yorkshire)
- **Price:** £1,750,000 Offers in Region of _(£1,750,000)_
- **Size:** 16,266 sq. ft. (16,266 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in School Conversion territory (prescoped — not scored); size 16266 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760557054121681#/?channel=COM_BUY

### Pasture Lane, Clayton, Bradford, BD14 6LU — POA

- **Address:** Pasture Lane, Clayton, Bradford, BD14 6LU (Bradford, Yorkshire)
- **Price:** POA _(£995,000)_
- **Size:** 11,814 sq. ft. (11,814 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Residential Conversion territory (prescoped — not scored); price 995000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/722868265035712#/?channel=COM_BUY

### 19 Bridge Street, Bradford, BD1 1JE — £750,000

- **Address:** 19 Bridge Street, Bradford, BD1 1JE (Bradford, Yorkshire)
- **Price:** £750,000 _(£750,000)_
- **Size:** 11,356 sq. ft. (11,356 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** Christo & Co, London, London
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in School Conversion territory (prescoped — not scored); size 11356 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/89729277#/?channel=COM_BUY

### Onward House, 2 Baptist Place, Bradford, West Yorkshire — £595,000 Offers in Region of

- **Address:** Onward House, 2 Baptist Place, Bradford, West Yorkshire (Bradford, Yorkshire)
- **Price:** £595,000 Offers in Region of _(£595,000)_
- **Size:** 11,194 sq. ft. (11,194 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in School Conversion territory (prescoped — not scored); size 11194 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760934224753408#/?channel=COM_BUY

### Little Lane Church, Little Lane, Bradford — £395,000 Offers in Region of

- **Address:** Little Lane Church, Little Lane, Bradford (Bradford, Yorkshire)
- **Price:** £395,000 Offers in Region of _(£395,000)_
- **Size:** 9,015 sq. ft. (9,015 sq ft)
- **Type:** Commercial Development
- **Agent:** Walker Singleton (Commercial), Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in School Conversion territory (prescoped — not scored); size 9015 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/760934262388241#/?channel=COM_BUY

### 343 Wakefield Road, Bradford, BD4 7NB — £375,000 Offers in Region of

- **Address:** 343 Wakefield Road, Bradford, BD4 7NB (Bradford, Yorkshire)
- **Price:** £375,000 Offers in Region of _(£375,000)_
- **Size:** 3,297 sq. ft. (3,297 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in School Conversion territory (prescoped — not scored); size 3297 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760557448387104#/?channel=COM_BUY

### Queensbury Baptist Church, Chapel Lane, Queensbury, Bradford, Yorkshire, BD13 2PZ — POA

- **Address:** Queensbury Baptist Church, Chapel Lane, Queensbury, Bradford, Yorkshire, BD13 2PZ (Bradford, Yorkshire)
- **Price:** POA _(£250,000)_
- **Size:** 3,083 sq. ft. (3,083 sq ft)
- **Type:** Commercial Development
- **Agent:** Lambert Smith Hampton, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in School Conversion territory (prescoped — not scored); size 3083 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/760771181578336#/?channel=COM_BUY

### Wharfedale Road, Bradford — POA

- **Address:** Wharfedale Road, Bradford (Bradford, Yorkshire)
- **Price:** POA _(£10)_
- **Size:** 28,079 sq. ft. (28,079 sq ft)
- **Type:** Light Industrial
- **Agent:** CBRE, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Data Centre Development territory (prescoped — not scored); size 28079 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/746607883263889#/?channel=COM_BUY

### Unit 3 Interchange 26, Junction 26 M62, Cliff Hollins Lane, Cleckheaton, Bradford, BD12 7EZ — POA

- **Address:** Unit 3 Interchange 26, Junction 26 M62, Cliff Hollins Lane, Cleckheaton, Bradford, BD12 7EZ (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 50,000–105,000 sq. ft. (105,000 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Data Centre Development territory (prescoped — not scored); size 105000 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/722867839314801#/?channel=COM_BUY

### 4-11 Station Mills, Station Road, Wyke, Bradford, BD12 8LA — POA

- **Address:** 4-11 Station Mills, Station Road, Wyke, Bradford, BD12 8LA (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 53,884–69,415 sq. ft. (69,415 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Dove Haigh Phillips LLP, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Data Centre Development territory (prescoped — not scored); size 69415 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/722867770130913#/?channel=COM_BUY

### Hillam Road, Off Canal Road, Bradford, BD2 1QL — POA

- **Address:** Hillam Road, Off Canal Road, Bradford, BD2 1QL (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 20,405 sq. ft. (20,405 sq ft)
- **Type:** Warehouse · LEASEHOLD
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in Data Centre Development territory (prescoped — not scored); size 20405 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/760557131759280#/?channel=COM_BUY

### 221 Sunbridge Road, Bradford, BD1 2LG — POA

- **Address:** 221 Sunbridge Road, Bradford, BD1 2LG (Bradford, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 16,165 sq. ft. (16,165 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in School Conversion territory (prescoped — not scored); size 16165 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760557421122001#/?channel=COM_BUY

### King Street Works, King Street, Drighlington — £225,000 Guide Price

- **Address:** King Street Works, King Street, Drighlington (Bradford, Yorkshire)
- **Price:** £225,000 Guide Price _(£225,000)_
- **Size:** 2,546 sq. ft. (2,546 sq ft)
- **Type:** Mixed Use · FREEHOLD
- **Agent:** Drighlington Properties, Drighlington
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bradford Yorkshire" in School Conversion territory (prescoped — not scored); size 2546 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90972912#/?channel=COM_BUY

### Beech Street, Huddersfield, West Yorkshire, HD1 — £450,000

- **Address:** Beech Street, Huddersfield, West Yorkshire, HD1 (Huddersfield, Yorkshire)
- **Price:** £450,000 _(£450,000)_
- **Size:** 14,128 sq. ft. (14,128 sq ft)
- **Type:** Leisure Facility · FREEHOLD
- **Agent:** Portfolio Lets Limited, Manchester
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in School Conversion territory (prescoped — not scored); size 14128 >= min 2000; keyword hit "school"
- **Listing:** https://www.rightmove.co.uk/properties/752945269010833#/?channel=COM_BUY

### Final Plot - Trinity West, Trinity Street, Huddersfield, HD1 4DL — POA

- **Address:** Final Plot - Trinity West, Trinity Street, Huddersfield, HD1 4DL (Huddersfield, Yorkshire)
- **Price:** POA _(£2,550,000)_
- **Size:** 67,082 sq. ft. (67,082 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Fox Lloyd Jones, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 67082 >= min 20000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/764373711221313#/?channel=COM_BUY

### Apartments 1-10,  16-20, Cloth Hall Street, Huddersfield — £800,000

- **Address:** Apartments 1-10,  16-20, Cloth Hall Street, Huddersfield (Huddersfield, Yorkshire)
- **Price:** £800,000 _(£800,000)_
- **Size:** 452–3,616 sq. ft. (3,616 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** LCP, Commercial
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in School Conversion territory (prescoped — not scored); size 3616 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/88202013#/?channel=COM_BUY

### 24 Zetland Street, Huddersfield, HD1 2RA — £595,000

- **Address:** 24 Zetland Street, Huddersfield, HD1 2RA (Huddersfield, Yorkshire)
- **Price:** £595,000 _(£595,000)_
- **Size:** 5,813 sq. ft. (5,813 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** Carter Towler, Leeds
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in School Conversion territory (prescoped — not scored); size 5813 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173895635#/?channel=COM_BUY

### Investment Property, Almondbury, West Yorkshire — £525,000

- **Address:** Investment Property, Almondbury, West Yorkshire (Huddersfield, Yorkshire)
- **Price:** £525,000 _(£525,000)_
- **Size:** n/a
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Residential Conversion territory (prescoped — not scored); price 525000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/142703828#/?channel=COM_BUY

### 1 Lord Street, Huddersfield, West Yorkshire, HD1 1QA — £500,000

- **Address:** 1 Lord Street, Huddersfield, West Yorkshire, HD1 1QA (Huddersfield, Yorkshire)
- **Price:** £500,000 _(£500,000)_
- **Size:** 5,422 sq. ft. (5,422 sq ft)
- **Type:** Commercial Development
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in School Conversion territory (prescoped — not scored); size 5422 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742090498310208#/?channel=COM_BUY

### 31 - 33 Towngate, Huddersfield, HD4 6JR — £350,000

- **Address:** 31 - 33 Towngate, Huddersfield, HD4 6JR (Huddersfield, Yorkshire)
- **Price:** £350,000 _(£350,000)_
- **Size:** 2,415 sq. ft. (2,415 sq ft)
- **Type:** Retail Property (out of town) · FREEHOLD
- **Agent:** eXp UK, Commercial
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in School Conversion territory (prescoped — not scored); size 2415 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/750772690783889#/?channel=COM_BUY

### Former Bowling Club, King Cliffe Road, West Yorkshire, HD2 2RR — £295,000

- **Address:** Former Bowling Club, King Cliffe Road, West Yorkshire, HD2 2RR (Huddersfield, Yorkshire)
- **Price:** £295,000 _(£295,000)_
- **Size:** 3,448 sq. ft. (3,448 sq ft)
- **Type:** Commercial Development
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in School Conversion territory (prescoped — not scored); size 3448 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742077927848224#/?channel=COM_BUY

### Land to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE — £200,000 Offers in Excess of

- **Address:** Land to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE (Huddersfield, Yorkshire)
- **Price:** £200,000 Offers in Excess of _(£200,000)_
- **Size:** 11,761 sq. ft. (11,761 sq ft)
- **Type:** Residential Development
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in School Conversion territory (prescoped — not scored); size 11761 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742063304407872#/?channel=COM_BUY

### Development Site to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE — £200,000 Offers in Excess of

- **Address:** Development Site to rear of 72 & 74 New North Road, Huddersfield, West Yorkshire, HD1 5NE (Huddersfield, Yorkshire)
- **Price:** £200,000 Offers in Excess of _(£200,000)_
- **Size:** 11,761 sq. ft. (11,761 sq ft)
- **Type:** Residential Development
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in School Conversion territory (prescoped — not scored); size 11761 >= min 2000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/742063384158624#/?channel=COM_BUY

### Land Adjacent To 84, Longwood Gate, Longwood, Huddersfield, West Yorkshire, HD3 4US — £160,000

- **Address:** Land Adjacent To 84, Longwood Gate, Longwood, Huddersfield, West Yorkshire, HD3 4US (Huddersfield, Yorkshire)
- **Price:** £160,000 _(£160,000)_
- **Size:** 161,172 sq. ft. (161,172 sq ft)
- **Type:** Residential Development · FREEHOLD
- **Agent:** BRAMLEYS LLP, Huddersfield
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 161172 >= min 20000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/742063671410129#/?channel=COM_BUY

### Former Revolution, 28 Cross Church Street, Huddersfield, HD1 2PT — POA

- **Address:** Former Revolution, 28 Cross Church Street, Huddersfield, HD1 2PT (Huddersfield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 10,698 sq. ft. (10,698 sq ft)
- **Type:** Bar / Nightclub · FREEHOLD
- **Agent:** Savills, Margaret Street - Licensed Leisure
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in School Conversion territory (prescoped — not scored); size 10698 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/749299705809233#/?channel=COM_BUY

### Longwood Edge Road, Huddersfield, West Yorkshire HD3 3UU — POA

- **Address:** Longwood Edge Road, Huddersfield, West Yorkshire HD3 3UU (Huddersfield, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 605,048 sq. ft. (605,048 sq ft)
- **Type:** Leisure Facility
- **Agent:** Eddisons Commercial Limited, Bradford
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in School Conversion territory (prescoped — not scored); size 605048 >= min 2000; keyword hit "school"
- **Listing:** https://www.rightmove.co.uk/properties/760556127239345#/?channel=COM_BUY

### Morley Lane, Huddersfield — £650,000 Offers in Region of

- **Address:** Morley Lane, Huddersfield (Huddersfield, Yorkshire)
- **Price:** £650,000 Offers in Region of _(£650,000)_
- **Size:** n/a
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Boultons, Huddersfield
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Residential Conversion territory (prescoped — not scored); price 650000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90737562#/?channel=COM_BUY

### Land to Rear of 72 & 74 New North Road, Huddersfield — £200,000 Offers Over

- **Address:** Land to Rear of 72 & 74 New North Road, Huddersfield (Huddersfield, Yorkshire)
- **Price:** £200,000 Offers Over _(£200,000)_
- **Size:** 11,761 sq. ft. (11,761 sq ft)
- **Type:** Land · FREEHOLD
- **Agent:** Bramleys, Huddersfield
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in School Conversion territory (prescoped — not scored); size 11761 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173745665#/?channel=COM_BUY

### Land adjacent to 84 Longwood Gate, Longwood, Huddersfield — £160,000

- **Address:** Land adjacent to 84 Longwood Gate, Longwood, Huddersfield (Huddersfield, Yorkshire)
- **Price:** £160,000 _(£160,000)_
- **Size:** 161,172 sq. ft. (161,172 sq ft)
- **Type:** Land · FREEHOLD
- **Agent:** Bramleys, Huddersfield
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Huddersfield Yorkshire" in Data Centre Development territory (prescoped — not scored); size 161172 >= min 20000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173625812#/?channel=COM_BUY

### Grand St Leger Hotel, Bennetthorpe, Doncaster, South Yorkshire, DN2 6AX — POA

- **Address:** Grand St Leger Hotel, Bennetthorpe, Doncaster, South Yorkshire, DN2 6AX (Doncaster, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 57,064 sq. ft. (57,064 sq ft)
- **Type:** Shop
- **Agent:** Flint Real Estate, Doncaster
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Data Centre Development territory (prescoped — not scored); size 57064 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/760550448149856#/?channel=COM_BUY

### Pillar House, 19-21 South Parade, Doncaster, South Yorkshire, DN1 2DJ — £695,000 Offers in Region of

- **Address:** Pillar House, 19-21 South Parade, Doncaster, South Yorkshire, DN1 2DJ (Doncaster, Yorkshire)
- **Price:** £695,000 Offers in Region of _(£695,000)_
- **Size:** 12,389 sq. ft. (12,389 sq ft)
- **Type:** Office
- **Agent:** Flint Real Estate, Doncaster
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in School Conversion territory (prescoped — not scored); size 12389 >= min 2000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/760550506814305#/?channel=COM_BUY

### Q90, Quest Park, Silk Road, Wheatley, Doncaster — POA

- **Address:** Q90, Quest Park, Silk Road, Wheatley, Doncaster (Doncaster, Yorkshire)
- **Price:** POA _(£9,500,000)_
- **Size:** 92,440 sq. ft. (92,440 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** TFC, Deansgate
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Data Centre Development territory (prescoped — not scored); size 92440 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/749490007600321#/?channel=COM_BUY

### Synergy House, Heavens Walk, Doncaster, South Yorkshire, DN4 5HZ — £1,250,000 Guide Price

- **Address:** Synergy House, Heavens Walk, Doncaster, South Yorkshire, DN4 5HZ (Doncaster, Yorkshire)
- **Price:** £1,250,000 Guide Price _(£1,250,000)_
- **Size:** 9,768 sq. ft. (9,768 sq ft)
- **Type:** Commercial Property
- **Agent:** PPH Commercial Limited, Doncaster
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in School Conversion territory (prescoped — not scored); size 9768 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/762163510247120#/?channel=COM_BUY

### 1 South Parade, Doncaster, DN1 2DY — £850,000 Offers in Excess of

- **Address:** 1 South Parade, Doncaster, DN1 2DY (Doncaster, Yorkshire)
- **Price:** £850,000 Offers in Excess of _(£850,000)_
- **Size:** 11,038 sq. ft. (11,038 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Savills, Nottingham
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in School Conversion territory (prescoped — not scored); size 11038 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/723050998393024#/?channel=COM_BUY

### 11-19 Printing Office Street, Doncaster, South Yorkshire, DN1 1TJ — £725,000 Offers in Region of

- **Address:** 11-19 Printing Office Street, Doncaster, South Yorkshire, DN1 1TJ (Doncaster, Yorkshire)
- **Price:** £725,000 Offers in Region of _(£725,000)_
- **Size:** 5,241 sq. ft. (5,241 sq ft)
- **Type:** Commercial Property
- **Agent:** PPH Commercial Limited, Doncaster
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in School Conversion territory (prescoped — not scored); size 5241 >= min 2000; keyword hit "school"
- **Listing:** https://www.rightmove.co.uk/properties/759461342496401#/?channel=COM_BUY

### Licenced Trade, Pubs & Clubs, South Yorkshire — £700,000 Offers in Excess of

- **Address:** Licenced Trade, Pubs & Clubs, South Yorkshire (Doncaster, Yorkshire)
- **Price:** £700,000 Offers in Excess of _(£700,000)_
- **Size:** n/a
- **Type:** Pub · FREEHOLD
- **Agent:** Ernest Wilson & Co Limited, EW Leeds
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Residential Conversion territory (prescoped — not scored); price 700000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/164177699#/?channel=COM_BUY

### 40-44 Silver Street, Doncaster, DN1 1HQ — £575,000

- **Address:** 40-44 Silver Street, Doncaster, DN1 1HQ (Doncaster, Yorkshire)
- **Price:** £575,000 _(£575,000)_
- **Size:** 12,000 sq. ft. (12,000 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** Barnsdales Ltd - Commercial, Doncaster
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Residential Conversion territory (prescoped — not scored); price 575000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/167469245#/?channel=COM_BUY

### Slug  Lettuce, 54 Hall Gate, Doncaster, DN1 3PB — £500,000 Offers in Excess of

- **Address:** Slug  Lettuce, 54 Hall Gate, Doncaster, DN1 3PB (Doncaster, Yorkshire)
- **Price:** £500,000 Offers in Excess of _(£500,000)_
- **Size:** 11,326 sq. ft. (11,326 sq ft)
- **Type:** Pub · FREEHOLD
- **Agent:** Savills, Manchester - Licensed Leisure
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in School Conversion territory (prescoped — not scored); size 11326 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/723056780266769#/?channel=COM_BUY

### 42 Duke Street, Doncaster, DN1 3EA — £425,000 Offers in Region of

- **Address:** 42 Duke Street, Doncaster, DN1 3EA (Doncaster, Yorkshire)
- **Price:** £425,000 Offers in Region of _(£425,000)_
- **Size:** 2,776 sq. ft. (2,776 sq ft)
- **Type:** Mixed Use · FREEHOLD
- **Agent:** Barnsdales Ltd - Commercial, Doncaster
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in School Conversion territory (prescoped — not scored); size 2776 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/172345310#/?channel=COM_BUY

### Yates, 58-59 Hall Gate, Doncaster, DN1 3PB — £375,000 Offers in Excess of

- **Address:** Yates, 58-59 Hall Gate, Doncaster, DN1 3PB (Doncaster, Yorkshire)
- **Price:** £375,000 Offers in Excess of _(£375,000)_
- **Size:** 521–10,996 sq. ft. (10,996 sq ft)
- **Type:** Pub · FREEHOLD
- **Agent:** Savills, Manchester - Licensed Leisure
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in School Conversion territory (prescoped — not scored); size 10996 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/723056784562097#/?channel=COM_BUY

### Dennison House, Dennison HouseSouth Parade, Doncaster — £300,000 Guide Price

- **Address:** Dennison House, Dennison HouseSouth Parade, Doncaster (Doncaster, Yorkshire)
- **Price:** £300,000 Guide Price _(£300,000)_
- **Size:** 15,000 sq. ft. (15,000 sq ft)
- **Type:** Leisure Facility · FREEHOLD
- **Agent:** Savills, City Offices
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in School Conversion territory (prescoped — not scored); size 15000 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/751004728136896#/?channel=COM_BUY

### 114/116 Urban Road, Hexthorpe, Doncaster, South Yorkshire, DN4 0EP — £175,000 Guide Price

- **Address:** 114/116 Urban Road, Hexthorpe, Doncaster, South Yorkshire, DN4 0EP (Doncaster, Yorkshire)
- **Price:** £175,000 Guide Price _(£175,000)_
- **Size:** 2,863 sq. ft. (2,863 sq ft)
- **Type:** Retail Property (high street)
- **Agent:** PPH Commercial Limited, Doncaster
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in School Conversion territory (prescoped — not scored); size 2863 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/762393335135152#/?channel=COM_BUY

### Doncaster 130, Balby Carr Bank, Doncaster — POA

- **Address:** Doncaster 130, Balby Carr Bank, Doncaster (Doncaster, Yorkshire)
- **Price:** POA _(£10)_
- **Size:** 131,041 sq. ft. (131,041 sq ft)
- **Type:** Light Industrial
- **Agent:** CBRE, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Data Centre Development territory (prescoped — not scored); size 131041 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/760585636207552#/?channel=COM_BUY

### Phase 2, Total Park, Balby Carr Bank, Doncaster — POA

- **Address:** Phase 2, Total Park, Balby Carr Bank, Doncaster (Doncaster, Yorkshire)
- **Price:** POA _(£10)_
- **Size:** 46,238–250,000 sq. ft. (250,000 sq ft)
- **Type:** Light Industrial
- **Agent:** CBRE, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Data Centre Development territory (prescoped — not scored); size 250000 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/760534555854880#/?channel=COM_BUY

### Unit 1 Total Park, Balby Carr Bank, Doncaster — POA

- **Address:** Unit 1 Total Park, Balby Carr Bank, Doncaster (Doncaster, Yorkshire)
- **Price:** POA _(£10)_
- **Size:** 66,737 sq. ft. (66,737 sq ft)
- **Type:** Light Industrial
- **Agent:** CBRE, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Data Centre Development territory (prescoped — not scored); size 66737 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/760577929236145#/?channel=COM_BUY

### Doncaster 130, Water Vole Way, Doncaster, South Yorkshire, DN4 5JP — POA

- **Address:** Doncaster 130, Water Vole Way, Doncaster, South Yorkshire, DN4 5JP (Doncaster, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 131,041 sq. ft. (131,041 sq ft)
- **Type:** Light Industrial · LEASEHOLD
- **Agent:** GV&Co, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Data Centre Development territory (prescoped — not scored); size 131041 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/760578669344497#/?channel=COM_BUY

### Unit 1 Total Park, Water Vole Way, Doncaster, South Yorkshire, DN4 5JP — POA

- **Address:** Unit 1 Total Park, Water Vole Way, Doncaster, South Yorkshire, DN4 5JP (Doncaster, Yorkshire)
- **Price:** POA _(£1)_
- **Size:** 66,737 sq. ft. (66,737 sq ft)
- **Type:** Light Industrial · LEASEHOLD
- **Agent:** GV&Co, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Data Centre Development territory (prescoped — not scored); size 66737 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/760578690478512#/?channel=COM_BUY

### Hall Gate, Doncaster, DN1 — £1,500,000

- **Address:** Hall Gate, Doncaster, DN1 (Doncaster, Yorkshire)
- **Price:** £1,500,000 _(£1,500,000)_
- **Size:** n/a
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Nested, Nationwide
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Doncaster Yorkshire" in Residential Conversion territory (prescoped — not scored); price 1500000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90530232#/?channel=COM_BUY

### Unit 1 and 2, Moho, Arundel Street, Manchester, M15 4JY — £650,000

- **Address:** Unit 1 and 2, Moho, Arundel Street, Manchester, M15 4JY (Manchester, Greater Manchester)
- **Price:** £650,000 _(£650,000)_
- **Size:** 4,047 sq. ft. (4,047 sq ft)
- **Type:** Retail Property (high street) · LEASEHOLD
- **Agent:** Shape and Sate, Manchester
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 650000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/90799932#/?channel=COM_BUY

### Unit D2, Meadowbank Business Park, Tweedle Way, Oldham, OL9 8EH — £1,000,000

- **Address:** Unit D2, Meadowbank Business Park, Tweedle Way, Oldham, OL9 8EH (Manchester, Greater Manchester)
- **Price:** £1,000,000 _(£1,000,000)_
- **Size:** 7,615 sq. ft. (7,615 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** MBRE, Stockport
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 7615 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/170286875#/?channel=COM_BUY

### Sherborne Street, Manchester — POA

- **Address:** Sherborne Street, Manchester (Manchester, Greater Manchester)
- **Price:** POA _(£5,500,000)_
- **Size:** 80,000 sq. ft. (80,000 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Citrus Commercial Circle, Manchester
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Data Centre Development territory (prescoped — not scored); size 80000 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/738315773469473#/?channel=COM_BUY

### Briscoe Lane, Manchester, M40 — £7,000,000 Offers in Excess of

- **Address:** Briscoe Lane, Manchester, M40 (Manchester, Greater Manchester)
- **Price:** £7,000,000 Offers in Excess of _(£7,000,000)_
- **Size:** 186,872 sq. ft. (186,872 sq ft)
- **Type:** Light Industrial
- **Agent:** Citrus Commercial Circle, Manchester
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Data Centre Development territory (prescoped — not scored); size 186872 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/749898455249585#/?channel=COM_BUY

### Wakefield House, 7-13 New Wakefield Street, Manchester, Greater Manchester, M1 5NP — £6,250,000

- **Address:** Wakefield House, 7-13 New Wakefield Street, Manchester, Greater Manchester, M1 5NP (Manchester, Greater Manchester)
- **Price:** £6,250,000 _(£6,250,000)_
- **Size:** 31,330 sq. ft. (31,330 sq ft)
- **Type:** Mixed Use · FREEHOLD
- **Agent:** W T Gunson, Manchester - BPG
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Data Centre Development territory (prescoped — not scored); size 31330 >= min 20000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/759472245651296#/?channel=COM_BUY

### Admiral Business Park, Cawdor Street, Eccles, Manchester, M30 0ZQ — £6,130,000 Offers in Excess of

- **Address:** Admiral Business Park, Cawdor Street, Eccles, Manchester, M30 0ZQ (Manchester, Greater Manchester)
- **Price:** £6,130,000 Offers in Excess of _(£6,130,000)_
- **Size:** 26,275 sq. ft. (26,275 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** Northcap, Leeds
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Data Centre Development territory (prescoped — not scored); size 26275 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/87528609#/?channel=COM_BUY

### The Waterside, Springfield Lane, Manchester, M3 7JQ — £6,000,000 Offers in Excess of

- **Address:** The Waterside, Springfield Lane, Manchester, M3 7JQ (Manchester, Greater Manchester)
- **Price:** £6,000,000 Offers in Excess of _(£6,000,000)_
- **Size:** 65,340 sq. ft. (65,340 sq ft)
- **Type:** Residential Development · FREEHOLD
- **Agent:** Di Properties Ltd, London
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Data Centre Development territory (prescoped — not scored); size 65340 >= min 20000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/161828498#/?channel=COM_BUY

### Seaford Road, Manchester M6 — £5,500,000 Guide Price

- **Address:** Seaford Road, Manchester M6 (Manchester, Greater Manchester)
- **Price:** £5,500,000 Guide Price _(£5,500,000)_
- **Size:** 154,388 sq. ft. (154,388 sq ft)
- **Type:** Residential Development · FREEHOLD
- **Agent:** ESTATE OFFICE INVESTMENTS LIMITED, London
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Data Centre Development territory (prescoped — not scored); size 154388 >= min 20000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/755829050114448#/?channel=COM_BUY

### Victoria House, 252 Great Ancoats Street, Manchester, M4 7DB — £2,175,000 Offers in Excess of

- **Address:** Victoria House, 252 Great Ancoats Street, Manchester, M4 7DB (Manchester, Greater Manchester)
- **Price:** £2,175,000 Offers in Excess of _(£2,175,000)_
- **Size:** 2,914 sq. ft. (2,914 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** Graham & Sibbald, Manchester
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 2914 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760716636883840#/?channel=COM_BUY

### Albion Wharf, 19 Albion Street, Manchester, Greater Manchester — £2,100,000 Offers in Region of

- **Address:** Albion Wharf, 19 Albion Street, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** £2,100,000 Offers in Region of _(£2,100,000)_
- **Size:** 10,430 sq. ft. (10,430 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Roger Hannah Ltd, Manchester
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 10430 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760768065211217#/?channel=COM_BUY

### Former Chapel St & Hope United Reformed Church, 146 Chapel Street, Salford, M3 6AF — £1,500,000 Offers in Excess of

- **Address:** Former Chapel St & Hope United Reformed Church, 146 Chapel Street, Salford, M3 6AF (Manchester, Greater Manchester)
- **Price:** £1,500,000 Offers in Excess of _(£1,500,000)_
- **Size:** 9,766 sq. ft. (9,766 sq ft)
- **Type:** Place of Worship
- **Agent:** W T Gunson, Manchester - BPG
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 9766 >= min 2000; keyword hit "former place of worship"
- **Listing:** https://www.rightmove.co.uk/properties/759473348749040#/?channel=COM_BUY

### Unit 5, Brightgate Way, Trafford Park, M32 0TB — POA

- **Address:** Unit 5, Brightgate Way, Trafford Park, M32 0TB (Manchester, Greater Manchester)
- **Price:** POA _(£1,300,000)_
- **Size:** 6,520 sq. ft. (6,520 sq ft)
- **Type:** Warehouse · FREEHOLD
- **Agent:** B8 Real Estate LLP, Warrington
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 6520 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173747120#/?channel=COM_BUY

### Stretford Road, Hulme, Manchester, M15 — £1,300,000

- **Address:** Stretford Road, Hulme, Manchester, M15 (Manchester, Greater Manchester)
- **Price:** £1,300,000 _(£1,300,000)_
- **Size:** n/a
- **Type:** Residential Development
- **Agent:** Citrus Commercial Circle, Manchester
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 1300000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/751658404128465#/?channel=COM_BUY

### 496, 496a and 496b Wilbraham Road, Manchester, Greater Manchester, M21 — £1,275,000 Offers in Excess of

- **Address:** 496, 496a and 496b Wilbraham Road, Manchester, Greater Manchester, M21 (Manchester, Greater Manchester)
- **Price:** £1,275,000 Offers in Excess of _(£1,275,000)_
- **Size:** n/a
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** BARKER PROUDLOVE LIMITED, Manchester
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 1275000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/754397735518577#/?channel=COM_BUY

### Land At New Viaduct Street And 266 Bradford Road, Manchester, Greater Manchester — £1,045,000

- **Address:** Land At New Viaduct Street And 266 Bradford Road, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** £1,045,000 _(£1,045,000)_
- **Size:** 47,916 sq. ft. (47,916 sq ft)
- **Type:** Commercial Property
- **Agent:** Roger Hannah Ltd, Manchester
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Data Centre Development territory (prescoped — not scored); size 47916 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/760768027462464#/?channel=COM_BUY

### Ground Floor (East Wing) Victoria Mill, 10 Lower Vickers Street, Manchester, Manchester, M40 7LH — £1,000,000 Offers in Region of

- **Address:** Ground Floor (East Wing) Victoria Mill, 10 Lower Vickers Street, Manchester, Manchester, M40 7LH (Manchester, Greater Manchester)
- **Price:** £1,000,000 Offers in Region of _(£1,000,000)_
- **Size:** n/a
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Landwood Group, Manchester
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 1000000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/167035448#/?channel=COM_BUY

### 498-500 Wilbraham Road, Manchester, M21 9AP — £985,000

- **Address:** 498-500 Wilbraham Road, Manchester, M21 9AP (Manchester, Greater Manchester)
- **Price:** £985,000 _(£985,000)_
- **Size:** 5,266 sq. ft. (5,266 sq ft)
- **Type:** Leisure Facility · FREEHOLD
- **Agent:** Shape and Sate, Manchester
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 5266 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90799563#/?channel=COM_BUY

### Units 1-4, Hadfield House, Gordon Street, Stockport, SK4 1RR — £975,000

- **Address:** Units 1-4, Hadfield House, Gordon Street, Stockport, SK4 1RR (Manchester, Greater Manchester)
- **Price:** £975,000 _(£975,000)_
- **Size:** 21,507 sq. ft. (21,507 sq ft)
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Fairhurst Buckley, Stockport
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Data Centre Development territory (prescoped — not scored); size 21507 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/759312467830369#/?channel=COM_BUY

### Lyons Road, Trafford Park, Manchester, Greater Manchester — £895,000

- **Address:** Lyons Road, Trafford Park, Manchester, Greater Manchester (Manchester, Greater Manchester)
- **Price:** £895,000 _(£895,000)_
- **Size:** 9,107 sq. ft. (9,107 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Roger Hannah Ltd, Manchester
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 9107 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/760767924826705#/?channel=COM_BUY

### The Rat and Pigeon, 33 Back Piccadilly, Manchester, M1 1HP — £885,000 Offers in Excess of

- **Address:** The Rat and Pigeon, 33 Back Piccadilly, Manchester, M1 1HP (Manchester, Greater Manchester)
- **Price:** £885,000 Offers in Excess of _(£885,000)_
- **Size:** 1,133 sq. ft. (1,133 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Savills, Margaret Street - Licensed Leisure
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 885000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/744108203782992#/?channel=COM_BUY

### Ayres Road, Stretford, Trafford — £850,000 Offers in Excess of

- **Address:** Ayres Road, Stretford, Trafford (Manchester, Greater Manchester)
- **Price:** £850,000 Offers in Excess of _(£850,000)_
- **Size:** 1,992–7,798 sq. ft. (7,798 sq ft)
- **Type:** Warehouse
- **Agent:** Thomas Willmax Ltd, Sale
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 850000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/738114440579633#/?channel=COM_BUY

### BEECH HOUSE BOWLING & SOCIAL CLUB, ROSS AVENUE, LEVENSHULME, MANCHESTER, M19 — £750,000

- **Address:** BEECH HOUSE BOWLING & SOCIAL CLUB, ROSS AVENUE, LEVENSHULME, MANCHESTER, M19 (Manchester, Greater Manchester)
- **Price:** £750,000 _(£750,000)_
- **Size:** 23,522 sq. ft. (23,522 sq ft)
- **Type:** Commercial Property
- **Agent:** Nolan Real Estate, Bury
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Data Centre Development territory (prescoped — not scored); size 23522 >= min 20000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/763840569263440#/?channel=COM_BUY

### 64-68 Bury Old Road, Manchester — £750,000 Offers in Region of

- **Address:** 64-68 Bury Old Road, Manchester (Manchester, Greater Manchester)
- **Price:** £750,000 Offers in Region of _(£750,000)_
- **Size:** 5,542 sq. ft. (5,542 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** BARKER PROUDLOVE LIMITED, Manchester
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 750000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/752027355996960#/?channel=COM_BUY

### 51-53 Richmond Street, Manchester, Lancashire, M1 3WB — £675,000 Offers in Region of

- **Address:** 51-53 Richmond Street, Manchester, Lancashire, M1 3WB (Manchester, Greater Manchester)
- **Price:** £675,000 Offers in Region of _(£675,000)_
- **Size:** n/a
- **Type:** Residential Development · FREEHOLD
- **Agent:** Landwood Group, Manchester
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 675000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/162129293#/?channel=COM_BUY

### Broughton Street, Manchester, Greater Manchester, M8 — £675,000 Offers in Excess of

- **Address:** Broughton Street, Manchester, Greater Manchester, M8 (Manchester, Greater Manchester)
- **Price:** £675,000 Offers in Excess of _(£675,000)_
- **Size:** 8,500 sq. ft. (8,500 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** NQ Commercial Limited, Manchester
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 8500 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/756213044978816#/?channel=COM_BUY

### 13 Shaw Road, Heaton Moor, Stockport, SK4 4AG — £650,000

- **Address:** 13 Shaw Road, Heaton Moor, Stockport, SK4 4AG (Manchester, Greater Manchester)
- **Price:** £650,000 _(£650,000)_
- **Size:** 2,252 sq. ft. (2,252 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** MBRE, Stockport
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 2252 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/162163484#/?channel=COM_BUY

### Whitegate Inn (Beefeater), Broadway, Oldham, OL9 8DW — £640,000

- **Address:** Whitegate Inn (Beefeater), Broadway, Oldham, OL9 8DW (Manchester, Greater Manchester)
- **Price:** £640,000 _(£640,000)_
- **Size:** n/a
- **Type:** Pub · FREEHOLD
- **Agent:** Christie & Co, Pubs & Restaurants
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 640000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/763088377470560#/?channel=COM_BUY

### Ashton New Road, Manchester, Greater Manchester, M11 — £625,000

- **Address:** Ashton New Road, Manchester, Greater Manchester, M11 (Manchester, Greater Manchester)
- **Price:** £625,000 _(£625,000)_
- **Size:** 5,960 sq. ft. (5,960 sq ft)
- **Type:** Commercial Development
- **Agent:** Thomas Willmax Ltd, Sale
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 5960 >= min 2000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/754785658201873#/?channel=COM_BUY

### Manchester Road, Manchester — £600,000 Offers in Region of

- **Address:** Manchester Road, Manchester (Manchester, Greater Manchester)
- **Price:** £600,000 Offers in Region of _(£600,000)_
- **Size:** 1,431–1,432 sq. ft. (1,432 sq ft)
- **Type:** Shop · FREEHOLD
- **Agent:** TFC, Deansgate
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 600000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/755487604418224#/?channel=COM_BUY

### Swinton Hall Road, Swinton, Manchester, Greater Manchester, M27 4UB — £560,000 Guide Price

- **Address:** Swinton Hall Road, Swinton, Manchester, Greater Manchester, M27 4UB (Manchester, Greater Manchester)
- **Price:** £560,000 Guide Price _(£560,000)_ · auction
- **Size:** n/a
- **Type:** Commercial Development · FREEHOLD
- **Agent:** Pattinsons, Pattinsons Auction- National Auctioneer
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 560000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/88587447#/?channel=COM_BUY

### 4 The Stables, Wilmslow Road, Parrs Wood, East Didsbury, M20 5PG — £525,000

- **Address:** 4 The Stables, Wilmslow Road, Parrs Wood, East Didsbury, M20 5PG (Manchester, Greater Manchester)
- **Price:** £525,000 _(£525,000)_
- **Size:** 1,319 sq. ft. (1,319 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Williams Sillitoe, Cheshire
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 525000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/171599399#/?channel=COM_BUY

### 193 - 195 Littleton Road, Salford, Greater Manchester M7 3TL — £525,000 Guide Price

- **Address:** 193 - 195 Littleton Road, Salford, Greater Manchester M7 3TL (Manchester, Greater Manchester)
- **Price:** £525,000 Guide Price _(£525,000)_ · auction
- **Size:** n/a
- **Type:** Mixed Use · FREEHOLD
- **Agent:** Auction House North West, Commercial
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 525000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/96676537#/?channel=COM_BUY

### Riverside Unit at Bridgewater Wharf, 257 Ordsall Lane, Salford, M5 3NG — £500,000 Offers in Excess of

- **Address:** Riverside Unit at Bridgewater Wharf, 257 Ordsall Lane, Salford, M5 3NG (Manchester, Greater Manchester)
- **Price:** £500,000 Offers in Excess of _(£500,000)_
- **Size:** 2,336 sq. ft. (2,336 sq ft)
- **Type:** Retail Property (high street) · LEASEHOLD
- **Agent:** Gifford Dixon Commercial Property, Manchester
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 2336 >= min 2000; keyword hit "gym"
- **Listing:** https://www.rightmove.co.uk/properties/160038089#/?channel=COM_BUY

### 11 & 11A Shaw Road, Heaton Moor, Stockport SK4 4AG — £450,000

- **Address:** 11 & 11A Shaw Road, Heaton Moor, Stockport SK4 4AG (Manchester, Greater Manchester)
- **Price:** £450,000 _(£450,000)_
- **Size:** 2,229 sq. ft. (2,229 sq ft)
- **Type:** Retail Property (high street) · FREEHOLD
- **Agent:** Impey & Company Limited, Stockport
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 2229 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/761300559490480#/?channel=COM_BUY

### Unit 2, Praed Road, Trafford Park, Manchester, M17 1PQ — £395,000

- **Address:** Unit 2, Praed Road, Trafford Park, Manchester, M17 1PQ (Manchester, Greater Manchester)
- **Price:** £395,000 _(£395,000)_
- **Size:** 2,877 sq. ft. (2,877 sq ft)
- **Type:** Warehouse
- **Agent:** Fairhurst Buckley, Stockport
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 2877 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/759312782239104#/?channel=COM_BUY

### Meadow Mill, Water Street, Stockport, Cheshire, SK1 — £350,000 Guide Price

- **Address:** Meadow Mill, Water Street, Stockport, Cheshire, SK1 (Manchester, Greater Manchester)
- **Price:** £350,000 Guide Price _(£350,000)_
- **Size:** 3,836 sq. ft. (3,836 sq ft)
- **Type:** Retail Property (high street) · LEASEHOLD
- **Agent:** JBrown International, London
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 3836 >= min 2000; keyword hit "development opportunity"
- **Listing:** https://www.rightmove.co.uk/properties/90807921#/?channel=COM_BUY

### Belmont Oil Works, Lancashire Hill, Stockport, SK4 1RP — POA

- **Address:** Belmont Oil Works, Lancashire Hill, Stockport, SK4 1RP (Manchester, Greater Manchester)
- **Price:** POA _(£300,000)_
- **Size:** 6,824 sq. ft. (6,824 sq ft)
- **Type:** Distribution Warehouse · FREEHOLD
- **Agent:** MBRE, Stockport
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 6824 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/158222384#/?channel=COM_BUY

### Meadow Industrial Estate, Water Street, Manchester — £280,000

- **Address:** Meadow Industrial Estate, Water Street, Manchester (Manchester, Greater Manchester)
- **Price:** £280,000 _(£280,000)_
- **Size:** 2,400–2,450 sq. ft. (2,450 sq ft)
- **Type:** Light Industrial · FREEHOLD
- **Agent:** Portfolio Lets Limited, Manchester
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 2450 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/763457499288288#/?channel=COM_BUY

### Chadwick Road, Eccles, Manchester, Greater Manchester, M30 0WU — £265,000 Guide Price

- **Address:** Chadwick Road, Eccles, Manchester, Greater Manchester, M30 0WU (Manchester, Greater Manchester)
- **Price:** £265,000 Guide Price _(£265,000)_ · auction
- **Size:** 3,046 sq. ft. (3,046 sq ft)
- **Type:** Heavy Industrial · FREEHOLD
- **Agent:** Pattinsons, Pattinsons Auction- National Auctioneer
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 3046 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90271293#/?channel=COM_BUY

### Unit  137 Fairfield Street  Manchester  M12 6FJ  United Kingdom — POA

- **Address:** Unit  137 Fairfield Street  Manchester  M12 6FJ  United Kingdom (Manchester, Greater Manchester)
- **Price:** POA _(£250,000)_
- **Size:** 2,634 sq. ft. (2,634 sq ft)
- **Type:** Industrial Park · FREEHOLD
- **Agent:** Colliers International, Industrial - Manchester
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 2634 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/168980207#/?channel=COM_BUY

### Ladybarn Lane, Manchester, Greater Manchester, M14 6YU — £150,000 Guide Price

- **Address:** Ladybarn Lane, Manchester, Greater Manchester, M14 6YU (Manchester, Greater Manchester)
- **Price:** £150,000 Guide Price _(£150,000)_ · auction
- **Size:** 2,012 sq. ft. (2,012 sq ft)
- **Type:** Land · FREEHOLD
- **Agent:** Pattinsons, Pattinsons Auction- National Auctioneer
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Manchester Greater Manchester" in School Conversion territory (prescoped — not scored); size 2012 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/159892385#/?channel=COM_BUY

### White Lion Brow, Bolton, BL1 — £325,000 Offers Over

- **Address:** White Lion Brow, Bolton, BL1 (Bolton, Greater Manchester)
- **Price:** £325,000 Offers Over _(£325,000)_
- **Size:** 25,700 sq. ft. (25,700 sq ft)
- **Type:** Commercial Development
- **Agent:** Miller Metcalfe, Bolton
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Data Centre Development territory (prescoped — not scored); size 25700 >= min 20000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/88636776#/?channel=COM_BUY

### The Office Block, Mikar Business Park, Northolt Drive, Great Lever — £525,000

- **Address:** The Office Block, Mikar Business Park, Northolt Drive, Great Lever (Bolton, Greater Manchester)
- **Price:** £525,000 _(£525,000)_
- **Size:** n/a
- **Type:** Office
- **Agent:** Cardwells Commercial & Residential Sales, Lettings and Management, Bolton
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 525000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/91090023#/?channel=COM_BUY

### 225 Folds Road, Bolton, Lancashire, BL1 — £1,950,000

- **Address:** 225 Folds Road, Bolton, Lancashire, BL1 (Bolton, Greater Manchester)
- **Price:** £1,950,000 _(£1,950,000)_
- **Size:** 74,960 sq. ft. (74,960 sq ft)
- **Type:** Commercial Development
- **Agent:** Fletcher CRE LTD, Bolton
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Data Centre Development territory (prescoped — not scored); size 74960 >= min 20000; keyword hit "industrial"
- **Listing:** https://www.rightmove.co.uk/properties/763058824350608#/?channel=COM_BUY

### Bridgeman Place Works, Salop Street, Bolton, Lancashire — £1,800,000

- **Address:** Bridgeman Place Works, Salop Street, Bolton, Lancashire (Bolton, Greater Manchester)
- **Price:** £1,800,000 _(£1,800,000)_
- **Size:** 28,211 sq. ft. (28,211 sq ft)
- **Type:** Commercial Development
- **Agent:** Fletcher CRE LTD, Bolton
- **Matched requirement:** Data Centre Development (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Data Centre Development territory (prescoped — not scored); size 28211 >= min 20000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/759313315085665#/?channel=COM_BUY

### Swan  Barristers, 2-4 Churchgate, Bolton, BL1 1HJ — £1,200,000 Offers in Excess of

- **Address:** Swan  Barristers, 2-4 Churchgate, Bolton, BL1 1HJ (Bolton, Greater Manchester)
- **Price:** £1,200,000 Offers in Excess of _(£1,200,000)_
- **Size:** 11,326 sq. ft. (11,326 sq ft)
- **Type:** Pub · FREEHOLD
- **Agent:** Savills, Manchester - Licensed Leisure
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in School Conversion territory (prescoped — not scored); size 11326 >= min 2000; keyword hit "church"
- **Listing:** https://www.rightmove.co.uk/properties/723062151173152#/?channel=COM_BUY

### The Swan & Barristers, 2-4 Churchgate, Bolton, BL1 1HJ — £1,200,000

- **Address:** The Swan & Barristers, 2-4 Churchgate, Bolton, BL1 1HJ (Bolton, Greater Manchester)
- **Price:** £1,200,000 _(£1,200,000)_
- **Size:** n/a
- **Type:** Pub · FREEHOLD
- **Agent:** Christie & Co, Pubs & Restaurants
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 1200000 within budget 500000-2000000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/730294920018513#/?channel=COM_BUY

### WESTGATE HOUSE, 1 WESTGATE AVENUE, BOLTON, BL1 — £850,000

- **Address:** WESTGATE HOUSE, 1 WESTGATE AVENUE, BOLTON, BL1 (Bolton, Greater Manchester)
- **Price:** £850,000 _(£850,000)_
- **Size:** 7,000 sq. ft. (7,000 sq ft)
- **Type:** Office
- **Agent:** Nolan Real Estate, Bury
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in School Conversion territory (prescoped — not scored); size 7000 >= min 2000; keyword hit "school"
- **Listing:** https://www.rightmove.co.uk/properties/759452932809904#/?channel=COM_BUY

### Red Lion, 1-3 Salford Road, Bolton, BL5 1BJ — £750,000 Offers in Region of

- **Address:** Red Lion, 1-3 Salford Road, Bolton, BL5 1BJ (Bolton, Greater Manchester)
- **Price:** £750,000 Offers in Region of _(£750,000)_
- **Size:** 35,719 sq. ft. (35,719 sq ft)
- **Type:** Pub · FREEHOLD
- **Agent:** Savills, Manchester - Licensed Leisure
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 750000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/757452912626721#/?channel=COM_BUY

### Unit 3 & Car Park, 178/200 Lever Street, Bolton, Bolton, Bolton, Lancashire, BL3 6NZ — £750,000

- **Address:** Unit 3 & Car Park, 178/200 Lever Street, Bolton, Bolton, Bolton, Lancashire, BL3 6NZ (Bolton, Greater Manchester)
- **Price:** £750,000 _(£750,000)_
- **Size:** n/a
- **Type:** Light Industrial
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 750000 within budget 500000-2000000; keyword hit "planning"
- **Listing:** https://www.rightmove.co.uk/properties/760715703659920#/?channel=COM_BUY

### 173 CHORLEY NEW ROAD, BOLTON, GREATER MANCHESTER, BL1 4QZ — £600,000

- **Address:** 173 CHORLEY NEW ROAD, BOLTON, GREATER MANCHESTER, BL1 4QZ (Bolton, Greater Manchester)
- **Price:** £600,000 _(£600,000)_
- **Size:** 4,668 sq. ft. (4,668 sq ft)
- **Type:** Office
- **Agent:** Lamb & Swift Commercial, Bolton
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in School Conversion territory (prescoped — not scored); size 4668 >= min 2000; keyword hit "school"
- **Listing:** https://www.rightmove.co.uk/properties/760714856408001#/?channel=COM_BUY

### The Grand Hotel, 13 Market Street, Radcliffe, Manchester, Lancashire M26 1GF — £385,000 Guide Price

- **Address:** The Grand Hotel, 13 Market Street, Radcliffe, Manchester, Lancashire M26 1GF (Bolton, Greater Manchester)
- **Price:** £385,000 Guide Price _(£385,000)_ · auction
- **Size:** 5,794 sq. ft. (5,794 sq ft)
- **Type:** Hotel · FREEHOLD
- **Agent:** BTG Eddisons Property Auctions, Commercial Nationwide
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in School Conversion territory (prescoped — not scored); size 5794 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/91203564#/?channel=COM_BUY

### 9A Gaskell Court , Churchgate, Bolton, BL1 1HU — £350,000

- **Address:** 9A Gaskell Court , Churchgate, Bolton, BL1 1HU (Bolton, Greater Manchester)
- **Price:** £350,000 _(£350,000)_
- **Size:** 3,645 sq. ft. (3,645 sq ft)
- **Type:** Office · FREEHOLD
- **Agent:** Fletcher CRE LTD, Bolton
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in School Conversion territory (prescoped — not scored); size 3645 >= min 2000; keyword hit "educational"
- **Listing:** https://www.rightmove.co.uk/properties/759313885420993#/?channel=COM_BUY

### New Hall Lane, Bolton — £195,000 Offers in Region of

- **Address:** New Hall Lane, Bolton (Bolton, Greater Manchester)
- **Price:** £195,000 Offers in Region of _(£195,000)_
- **Size:** 1,000–2,000 sq. ft. (2,000 sq ft)
- **Type:** Mixed Use · LEASEHOLD
- **Agent:** Regency Estates, Bolton
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in School Conversion territory (prescoped — not scored); size 2000 >= min 2000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/758269323414560#/?channel=COM_BUY

### Travis Perkins  Bark Street  Bolton  BL1 2BB  United Kingdom — POA

- **Address:** Travis Perkins  Bark Street  Bolton  BL1 2BB  United Kingdom (Bolton, Greater Manchester)
- **Price:** POA _(£1)_
- **Size:** 8,793 sq. ft. (8,793 sq ft)
- **Type:** Industrial Park · FREEHOLD
- **Agent:** Colliers International, Industrial - Manchester
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in School Conversion territory (prescoped — not scored); size 8793 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/173634371#/?channel=COM_BUY

### The Office Block, Mikar Business Park, Northolt Drive, Great Lever — £525,000 Offers in Excess of

- **Address:** The Office Block, Mikar Business Park, Northolt Drive, Great Lever (Bolton, Greater Manchester)
- **Price:** £525,000 Offers in Excess of _(£525,000)_
- **Size:** n/a
- **Type:** Commercial Property · LEASEHOLD
- **Agent:** Cardwells Sales, Lettings, Management & Commercial, Bolton
- **Matched requirement:** Residential Conversion (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in Residential Conversion territory (prescoped — not scored); price 525000 within budget 500000-2000000; keyword hit "vacant"
- **Listing:** https://www.rightmove.co.uk/properties/91088457#/?channel=COM_BUY

### Hardman Street, Bolton, Greater Manchester, BL4 — £365,000 Offers in Region of

- **Address:** Hardman Street, Bolton, Greater Manchester, BL4 (Bolton, Greater Manchester)
- **Price:** £365,000 Offers in Region of _(£365,000)_
- **Size:** 3,000 sq. ft. (3,000 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Josephs Estates, Bolton
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in School Conversion territory (prescoped — not scored); size 3000 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/89191197#/?channel=COM_BUY

### Bolton Road, Kearsley, Bolton, BL4 8NG — £250,000 Guide Price

- **Address:** Bolton Road, Kearsley, Bolton, BL4 8NG (Bolton, Greater Manchester)
- **Price:** £250,000 Guide Price _(£250,000)_ · auction
- **Size:** 4,897 sq. ft. (4,897 sq ft)
- **Type:** Commercial Property · FREEHOLD
- **Agent:** Hyde Estate & Lettings Agents, Manchester
- **Matched requirement:** School Conversion (score 2/2+)
- **Why:** geography "Bolton Greater Manchester" in School Conversion territory (prescoped — not scored); size 4897 >= min 2000; keyword hit "freehold"
- **Listing:** https://www.rightmove.co.uk/properties/90635571#/?channel=COM_BUY

## Scraped but did not pass Stage-0

257 investable listings scored below the bar (geography not scored — these counts reflect price/size/keyword signals only).

| Best score | Listings | Typical shortfall |
|---|---|---|
| 0/2 | 71 | no non-geo signal at all (POA price, no size given, no keyword hit) |
| 1/2 | 186 | one signal only — e.g. keyword but price outside budget / size unknown |

