/**
 * Seed Requirements Register entries used by the report scripts.
 * (In production these live in the `requirements` table; the scripts use this
 * module so a live pull can run without a database.)
 */

import type { Requirement } from '../types.js';

export const CITYWIDE: Requirement = {
  id: 'citywide',
  name: 'Citywide Investors',
  active: true,
  geographies: ['yorkshire', 'greater manchester'],
  budgetRange: [500000, 2000000],
  keywords: ['vacant', 'c2r', 'commercial to residential'],
};

export const EDUCATING: Requirement = {
  id: 'educating',
  name: 'Educating Excellence',
  active: true,
  geographies: ['manchester', 'bolton', 'sheffield', 'bradford', 'huddersfield'],
  minSize: 2000,
  keywords: [
    'former place of worship',
    'church',
    'chapel',
    'religious',
    'office',
    'former church',
  ],
};

/**
 * Added 2026-07-19: unlike Citywide/Educating (C2R residential and church
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
 */
export const DATA_CENTRE: Requirement = {
  id: 'data-centre',
  name: 'Data Centre Sites',
  active: true,
  geographies: ['yorkshire', 'greater manchester', 'west midlands', 'east midlands', 'north east'],
  minSize: 20000,
  keywords: ['industrial', 'warehouse', 'distribution', 'logistics', 'development site', 'power', 'substation', 'grid'],
};

export const SEED_REQUIREMENTS: Requirement[] = [CITYWIDE, EDUCATING, DATA_CENTRE];
