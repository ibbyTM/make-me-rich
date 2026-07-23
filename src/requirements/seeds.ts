/**
 * Seed Requirements Register entries used by the report scripts.
 * (In production these live in the `requirements` table; the scripts use this
 * module so a live pull can run without a database.)
 */

import type { Requirement } from '../types.js';

export const CITYWIDE: Requirement = {
  id: 'citywide',
  name: 'Residential Conversion',
  active: true,
  geographies: ['yorkshire', 'greater manchester'],
  budgetRange: [500000, 2000000],
  keywords: ['vacant', 'c2r', 'commercial to residential'],
};

/**
 * Renamed/retargeted 2026-07-22: the strategy is specifically converting a
 * property into a SCHOOL, ready with little work — not "any change of use"
 * for a former religious building. Keywords keep the former-church/chapel
 * angle (a common, spacious, community-oriented source of school-conversion
 * stock in the UK) but add direct school/education wording so a listing
 * already labelled that way matches too. "Little work needed" isn't
 * something Stage-0's keyword gate can assess — that's
 * src/scoring/schoolReadiness.ts, a separate signal scored from the
 * listing's own marketing text after Stage-0, same pattern as Data Centre
 * Fit / Value-Add.
 *
 * Extended further 2026-07-22, same day, per the user's follow-up ("what
 * other things can we use to identify a school"):
 *   - UK planning use class terms (D1 — the pre-Sept-2020 classification,
 *     F1/F.1 — "Learning and non-residential institutions" post-reform).
 *     This is the single strongest signal available: a property already in
 *     that use class needs far less planning work to become a school than
 *     one zoned pure retail/office, and agents do sometimes state it
 *     directly in listing text.
 *   - Broadened "similar bones" building types — community centres,
 *     libraries, leisure centres, gyms, day nurseries — which share the
 *     large-open-space layout church/chapel conversions do and are often
 *     already D1/F1-adjacent in planning terms.
 *   - Outdoor space wording ("playground", "outdoor space", "grounds") —
 *     schools need it, most commercial units don't advertise it, so a hit
 *     is a genuinely distinctive signal. Deliberately did NOT add "car
 *     park" — too generic (most commercial listings mention parking
 *     regardless of use) to carry any real signal.
 * Same caveat as School Readiness: these are still just better keyword
 * matching on text agents may or may not have written — real, free, and
 * an improvement, not a claim of certainty.
 *
 * Geography fixed 2026-07-22, same day: the original city-level list
 * (manchester/bolton/sheffield/bradford/huddersfield) silently EXCLUDED
 * Leeds and Doncaster — 2 of the 7 cities Rightmove Commercial actually
 * scrapes (see CITYWIDE_CITIES in src/scrapers/rightmoveCommercial.ts) —
 * even though this requirement is geo-prescoped: a geography mismatch
 * disqualifies a requirement entirely before its keywords are even checked
 * (src/filter/stageZero.ts). Caught via a real listing literally named
 * "Fulneck School" whose marketing text said "former school estate...
 * Substantial former educational accommodation" — a textbook School
 * Conversion match — but it's in Leeds, so it was hard-excluded and fell
 * through to Data Centre Development instead purely on a stale geography
 * list, nothing to do with keyword relevance. Switched to the same
 * region-level matching Residential Conversion and Data Centre Development
 * already use, so a future new scraped city doesn't silently create this
 * gap again.
 */
export const EDUCATING: Requirement = {
  id: 'educating',
  name: 'School Conversion',
  active: true,
  geographies: ['yorkshire', 'greater manchester'],
  minSize: 2000,
  keywords: [
    'school',
    'former school',
    'academy',
    'college',
    'educational',
    'former place of worship',
    'church',
    'chapel',
    'former church',
    'class d1',
    'use class d1',
    'd1 use',
    'class f1',
    'class f.1',
    'use class f1',
    'f1 use',
    'non-residential institution',
    'community centre',
    'community center',
    'library',
    'leisure centre',
    'leisure center',
    'gym',
    'gymnasium',
    'day nursery',
    'nursery',
    'playground',
    'outdoor space',
    'grounds',
  ],
};

/**
 * Added 2026-07-19: unlike Citywide/Educating (residential and school
 * conversion respectively), this exists so Stage-0 also scores the full raw
 * pull for large industrial/warehouse/land stock suited to data-centre
 * siting — without it, a listing too big or wrongly-worded for the other two
 * requirements never surfaces anywhere, even if it happens to be an ideal
 * data-centre site (see docs/data-centre-fit-2026-07-19.md and
 * docs/data-centre-requirement-2026-07-19.md). No budget cap — deliberately
 * unscoped, since real DC-scale sites can price far above Citywide's band.
 * Geography matches every region this pipeline currently has a live source
 * in (see the extended region() mapping in scripts/discovered-agents-
 * report.ts) — narrower than "everywhere" but as wide as the actual sources
 * cover, not just Yorkshire/Greater Manchester.
 *
 * Name changed 2026-07-22 (Citywide Investors/Educating Excellence/Data
 * Centre Sites -> Residential Conversion/Church & Chapel Conversion/Data
 * Centre Development) at the user's request: the dashboard's requirement
 * tag should read as the STRATEGY for a property (what we'd do with it),
 * not the brand name of the saved search that found it.
 *
 * Geography extended 2026-07-22, same day, at the user's direction ("only
 * expand search for data centres, look around the north for sites near
 * stations"): added Liverpool/Merseyside and Lancashire — genuinely
 * uncovered ground (no existing geography term or agent source touches it)
 * with real legacy grid capacity from former heavy industry/docks.
 *
 * Added 'liverpool'/'merseyside'/'lancashire' specifically, not just a
 * broad 'north west' — tried the broad term alone first and it silently
 * found nothing: the discovery search provider (src/discovery/
 * searchProviders.ts's curated-directory fallback, used whenever
 * BING_SEARCH_API_KEY isn't set) matches by "does the query string CONTAIN
 * this entry's tag" — the directory's real North West entries are tagged
 * with actual city/region names ('liverpool', 'merseyside', 'wirral',
 * 'lancashire', 'blackburn', 'chorley'), never the literal string "north
 * west", so a query built from the broad term alone matched zero of them
 * even though real candidates exist in the directory.
 *
 * Kept 'north west' too, alongside the specific names: for THIS discovery
 * query mechanism, specific place names are what actually match; but for
 * future Stage-0 matching once a north-west agent is scraped, the broader
 * regional suffix scripts/discovered-agents-report.ts's region() appends
 * (e.g. a Preston-based agent's geography becomes "Preston North West")
 * is more robust than requiring one of these exact 3 words to appear —
 * same pattern already used for every other region here (West Midlands,
 * East Midlands, North East all rely on that suffix, not individual town
 * names). Discovery's MAX_QUERIES cap (8) means 'north west' likely won't
 * get its own query in a single run with 8 other entries ahead of it, but
 * it stays available for Stage-0 geography matching regardless (that check
 * iterates the full list, unsliced).
 *
 * This only widens the search net (discovery queries + future Stage-0
 * matching); it doesn't change what makes a site a good data-centre fit —
 * that's still substation proximity, scored per-listing once real
 * candidates are found (src/geo/substations.ts).
 */
export const DATA_CENTRE: Requirement = {
  id: 'data-centre',
  name: 'Data Centre Development',
  active: true,
  geographies: [
    'yorkshire',
    'greater manchester',
    'west midlands',
    'east midlands',
    'north east',
    'liverpool',
    'merseyside',
    'lancashire',
    'north west',
  ],
  minSize: 20000,
  keywords: ['industrial', 'warehouse', 'distribution', 'logistics', 'development site', 'power', 'substation', 'grid'],
};

export const SEED_REQUIREMENTS: Requirement[] = [CITYWIDE, EDUCATING, DATA_CENTRE];
