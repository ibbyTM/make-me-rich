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

export const SEED_REQUIREMENTS: Requirement[] = [CITYWIDE, EDUCATING];
