/**
 * Self-contained Postgres harness for RLS tests.
 *
 * Boots an in-process PGlite (real Postgres, WASM — no external server or
 * docker needed, so the RLS tests run anywhere `npm test` does), stubs the
 * Supabase `auth.uid()` seam, applies the real migration files, and provides a
 * way to run queries "as" a given app user with RLS enforced.
 *
 * RLS is enforced by running queries under a non-owner role (`authenticated`,
 * matching Supabase's request role) via SET ROLE. The bootstrap superuser
 * bypasses RLS and is used only for setup/seeding.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';

const here = dirname(fileURLToPath(import.meta.url));
const migrationsDir = resolve(here, '../../supabase/migrations');

export interface Harness {
  db: PGlite;
  /** Run a query as the app user with the given auth uid (RLS enforced). */
  asUser<T = Record<string, unknown>>(
    authUid: string,
    sql: string,
    params?: unknown[],
  ): Promise<{ rows: T[]; affectedRows: number }>;
  /** Run a query as the bootstrap superuser (RLS bypassed) — setup/seeding only. */
  asAdminBypass<T = Record<string, unknown>>(
    sql: string,
    params?: unknown[],
  ): Promise<{ rows: T[] }>;
  close(): Promise<void>;
}

export async function createHarness(): Promise<Harness> {
  const db = new PGlite({ extensions: { pgcrypto } });

  // Supabase seam: auth.uid() reads the JWT subject from a session GUC. Must
  // exist before the migrations, because current_app_role() references it and
  // Postgres validates SQL function bodies at creation time.
  await db.exec(`
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
  `);

  for (const file of ['0001_base.sql', '0002_source_onboarding.sql']) {
    await db.exec(await readFile(resolve(migrationsDir, file), 'utf8'));
  }

  // Request role that RLS applies to (Supabase's `authenticated`). Grant the
  // same table privileges Supabase grants; RLS then narrows them per policy.
  await db.exec(`
    do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
    grant usage on schema public to authenticated;
    grant select, insert, update, delete on all tables in schema public to authenticated;
  `);

  async function asUser<T = Record<string, unknown>>(
    authUid: string,
    sql: string,
    params: unknown[] = [],
  ): Promise<{ rows: T[]; affectedRows: number }> {
    // set_config with is_local=false so it survives across the SET ROLE in this
    // session; reset afterwards to isolate tests.
    await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [authUid]);
    await db.exec(`set role authenticated;`);
    try {
      const res = await db.query<T>(sql, params);
      return { rows: res.rows, affectedRows: res.affectedRows ?? 0 };
    } finally {
      await db.exec(`reset role;`);
      await db.query(`select set_config('request.jwt.claim.sub', '', false)`);
    }
  }

  async function asAdminBypass<T = Record<string, unknown>>(
    sql: string,
    params: unknown[] = [],
  ): Promise<{ rows: T[] }> {
    const res = await db.query<T>(sql, params);
    return { rows: res.rows };
  }

  return {
    db,
    asUser,
    asAdminBypass,
    async close() {
      await db.close();
    },
  };
}
