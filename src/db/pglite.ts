/**
 * Shared PGlite bootstrap — the production-facing counterpart of
 * `test/helpers/pgHarness.ts` (which now just re-exports this).
 *
 * Two modes, selected by whether `dataDir` is passed:
 *   - no dataDir → in-memory, wiped on process exit (used by tests and the
 *     one-off dry-run scripts like scripts/trial.ts).
 *   - dataDir set → a real on-disk PGlite store that PERSISTS across separate
 *     `npx tsx ...` invocations, e.g. `.data/cais-db`. This is what makes the
 *     Requirements Register durable: the dashboard server's `/requirements`
 *     endpoint and every report script open the *same* directory and see each
 *     other's writes on the next run. PGlite is an embedded (SQLite-like)
 *     engine, not a server — callers must not open the same dataDir from two
 *     processes concurrently, which is why the dashboard server never runs
 *     more than one report/discovery job at a time (see scripts/serve-dashboard.ts).
 */

import { readFile, mkdir } from 'node:fs/promises';
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

export interface CreateHarnessOptions {
  /** Directory for an on-disk store. Omit for an ephemeral in-memory instance. */
  dataDir?: string;
}

/**
 * Migration files are written to be safely re-appliable (create-if-not-exists /
 * exception-guarded enum creation / drop-then-create policies throughout), so
 * re-running both files against an already-migrated dataDir on every process
 * start is intentional — no separate schema-version tracking is needed at this
 * scale.
 */
export async function createHarness(opts: CreateHarnessOptions = {}): Promise<Harness> {
  if (opts.dataDir) await mkdir(opts.dataDir, { recursive: true });
  const db = new PGlite({ dataDir: opts.dataDir, extensions: { pgcrypto } });

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

/** Default location for the persistent store used by the dashboard + report scripts. */
export const DEFAULT_DATA_DIR = resolve(here, '../../.data/cais-db');

export async function createPersistentHarness(dataDir: string = DEFAULT_DATA_DIR): Promise<Harness> {
  return createHarness({ dataDir });
}
