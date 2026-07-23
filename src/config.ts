/** Runtime configuration, sourced from env with spec-derived defaults. */

function num(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const config = {
  /** Spec §3 step 10 / §8 — auto-approve at or above this confidence. */
  approvalThreshold: num('APPROVAL_THRESHOLD', 0.8),
  /** Spec §6 — Stage-0 pass mark. */
  stageZeroMinimumBar: num('STAGE_ZERO_MINIMUM_BAR', 2),
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
};

export type Config = typeof config;
