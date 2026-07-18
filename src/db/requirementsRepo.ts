/**
 * Requirements Register repo — reads/writes the `requirements` table (spec §6 /
 * 0001_base.sql) via the shared persistent PGlite store (src/db/pglite.ts).
 *
 * This is what makes a custom search created from the dashboard "just work"
 * everywhere: the two seed requirements and any custom ones created via
 * `insertRequirement` all live in the same table, and every report script
 * (Barnsdales / Rightmove / discovered agents) now reads the active set from
 * here instead of importing a hardcoded TS list — so a new row participates in
 * Stage-0 filtering on the next run of any of them, with no code change.
 */

import type { Harness } from './pglite.js';
import type { Requirement } from '../types.js';
import { SEED_REQUIREMENTS } from '../requirements/seeds.js';

interface RequirementRow {
  id: string;
  name: string;
  active: boolean;
  geographies: string[];
  min_size: number | null;
  budget_min: string | number | null;
  budget_max: string | number | null;
  keywords: string[];
}

function rowToRequirement(row: RequirementRow): Requirement {
  const budgetMin = row.budget_min == null ? null : Number(row.budget_min);
  const budgetMax = row.budget_max == null ? null : Number(row.budget_max);
  return {
    id: row.id,
    name: row.name,
    active: row.active,
    geographies: row.geographies ?? [],
    minSize: row.min_size ?? undefined,
    budgetRange: budgetMin != null && budgetMax != null ? [budgetMin, budgetMax] : undefined,
    keywords: row.keywords ?? [],
  };
}

/** Normalise dashboard-form / CLI free text into a clean lowercase array. */
export function splitCsv(input: string | string[] | undefined): string[] {
  const parts = Array.isArray(input) ? input : (input ?? '').split(',');
  return [...new Set(parts.map((s) => s.trim().toLowerCase()).filter(Boolean))];
}

export interface NewRequirementInput {
  name: string;
  geographies: string[];
  keywords?: string[];
  minSize?: number;
  budgetMin?: number;
  budgetMax?: number;
}

/** Insert a new Requirements Register row (dashboard "New search" panel). */
export async function insertRequirement(
  h: Harness,
  input: NewRequirementInput,
): Promise<Requirement> {
  const name = input.name.trim();
  if (!name) throw new Error('name is required');
  const geographies = input.geographies.map((g) => g.trim().toLowerCase()).filter(Boolean);
  if (geographies.length === 0) throw new Error('at least one geography is required');
  const keywords = (input.keywords ?? []).map((k) => k.trim().toLowerCase()).filter(Boolean);

  const res = await h.asAdminBypass<RequirementRow>(
    `insert into requirements (name, active, geographies, min_size, budget_min, budget_max, keywords)
     values ($1, true, $2, $3, $4, $5, $6)
     returning id, name, active, geographies, min_size, budget_min, budget_max, keywords`,
    [
      name,
      geographies,
      input.minSize ?? null,
      input.budgetMin ?? null,
      input.budgetMax ?? null,
      keywords,
    ],
  );
  return rowToRequirement(res.rows[0]!);
}

/** All requirements (seed + custom), most recently created first. */
export async function listRequirements(h: Harness): Promise<Requirement[]> {
  const res = await h.asAdminBypass<RequirementRow>(
    `select id, name, active, geographies, min_size, budget_min, budget_max, keywords
     from requirements order by created_at desc`,
  );
  return res.rows.map(rowToRequirement);
}

/** Active requirements only — what Stage-0 scoring should run against. */
export async function listActiveRequirements(h: Harness): Promise<Requirement[]> {
  return (await listRequirements(h)).filter((r) => r.active);
}

export async function getRequirement(h: Harness, id: string): Promise<Requirement | null> {
  const res = await h.asAdminBypass<RequirementRow>(
    `select id, name, active, geographies, min_size, budget_min, budget_max, keywords
     from requirements where id = $1`,
    [id],
  );
  return res.rows[0] ? rowToRequirement(res.rows[0]) : null;
}

/**
 * Idempotently insert the two original seed requirements (Citywide Investors,
 * Educating Excellence) if the table is empty. Matched by name so re-running
 * this against an already-seeded store is a no-op.
 */
export async function ensureSeeded(h: Harness): Promise<void> {
  const existing = await h.asAdminBypass<{ n: number }>(`select count(*)::int n from requirements`);
  if (existing.rows[0]!.n > 0) return;
  for (const r of SEED_REQUIREMENTS) {
    const [budgetMin, budgetMax] = r.budgetRange ?? [null, null];
    await h.asAdminBypass(
      `insert into requirements (name, active, geographies, min_size, budget_min, budget_max, keywords)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [r.name, r.active, r.geographies, r.minSize ?? null, budgetMin, budgetMax, r.keywords ?? []],
    );
  }
}
