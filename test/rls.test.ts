/**
 * RLS policy tests for site_audits reviewer tiering (spec §2.4 + §8).
 *
 * Runs the real migrations against an in-process Postgres (PGlite) and exercises
 * the write policies as an analyst and an admin under enforced RLS. Covers:
 *   - analyst reviewing a tos_flag=true audit  → rejected (no-op)
 *   - analyst reviewing a needs_review audit    → rejected (no-op)
 *   - admin reviewing a tos_flag=true audit     → succeeds
 *   - analyst reviewing an ordinary audit       → unaffected (succeeds)
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createHarness, type Harness } from './helpers/pgHarness.js';

const ADMIN = '11111111-1111-1111-1111-111111111111';
const ANALYST = '22222222-2222-2222-2222-222222222222';

// audit ids for each fixture source
let auditTos = '';
let auditNeedsReview = '';
let auditOrdinary = '';

let h: Harness;

beforeAll(async () => {
  h = await createHarness();

  // app_users: one admin, one analyst
  await h.asAdminBypass(
    `insert into app_users (auth_uid, email, role) values
       ($1, 'admin@cais.test', 'admin'),
       ($2, 'analyst@cais.test', 'analyst')`,
    [ADMIN, ANALYST],
  );

  // Three sources: tos-flagged, needs_review, and ordinary (active, non-flagged).
  const sources = await h.asAdminBypass<{ id: string; kind: string }>(
    `insert into sources (url, name, status, classification, tos_flag) values
       ('https://flagged.example.com/',  'Flagged',  'pending_review', 'embedded_json', true),
       ('https://review.example.com/',   'Review',   'pending_review', 'needs_review',  false),
       ('https://ordinary.example.com/', 'Ordinary', 'active',         'static_html',   false)
     returning id, name as kind`,
  );
  const idByKind = Object.fromEntries(sources.rows.map((r) => [r.kind, r.id]));

  const audits = await h.asAdminBypass<{ id: string; kind: string }>(
    `insert into site_audits (source_id, detected_structure, confidence, decision)
     values
       ($1, 'tos gate tripped',        0.9, 'queued_for_review'),
       ($2, 'no signal',               0.2, 'queued_for_review'),
       ($3, 'clean embedded listings', 0.9, 'auto_approved')
     returning id, (select name from sources s where s.id = site_audits.source_id) as kind`,
    [idByKind['Flagged'], idByKind['Review'], idByKind['Ordinary']],
  );
  const auditByKind = Object.fromEntries(audits.rows.map((r) => [r.kind, r.id]));
  auditTos = auditByKind['Flagged']!;
  auditNeedsReview = auditByKind['Review']!;
  auditOrdinary = auditByKind['Ordinary']!;
});

afterAll(async () => {
  await h.close();
});

async function reviewedValue(auditId: string): Promise<string | null> {
  const res = await h.asAdminBypass<{ review_decision: string | null }>(
    `select review_decision from site_audits where id = $1`,
    [auditId],
  );
  return res.rows[0]?.review_decision ?? null;
}

describe('site_audits reviewer-tier RLS', () => {
  it('analyst can still READ a flagged (tos_flag) audit', async () => {
    const res = await h.asUser(ANALYST, `select id from site_audits where id = $1`, [auditTos]);
    expect(res.rows).toHaveLength(1);
  });

  it('analyst reviewing a tos_flag=true audit is rejected (no rows affected, value unchanged)', async () => {
    const res = await h.asUser(
      ANALYST,
      `update site_audits set review_decision = 'analyst-approved', reviewed_by = $2 where id = $1`,
      [auditTos, ANALYST],
    );
    expect(res.affectedRows).toBe(0);
    expect(await reviewedValue(auditTos)).toBeNull();
  });

  it('analyst reviewing a needs_review audit is rejected (no rows affected)', async () => {
    const res = await h.asUser(
      ANALYST,
      `update site_audits set review_decision = 'analyst-approved' where id = $1`,
      [auditNeedsReview],
    );
    expect(res.affectedRows).toBe(0);
    expect(await reviewedValue(auditNeedsReview)).toBeNull();
  });

  it('admin reviewing a tos_flag=true audit succeeds', async () => {
    const res = await h.asUser(
      ADMIN,
      `update site_audits set review_decision = 'admin-approved', reviewed_by =
         (select id from app_users where auth_uid = $2) where id = $1`,
      [auditTos, ADMIN],
    );
    expect(res.affectedRows).toBe(1);
    expect(await reviewedValue(auditTos)).toBe('admin-approved');
  });

  it('analyst reviewing an ordinary (non-flagged) audit is unaffected — still succeeds', async () => {
    const res = await h.asUser(
      ANALYST,
      `update site_audits set review_decision = 'analyst-approved', reviewed_by =
         (select id from app_users where auth_uid = $2) where id = $1`,
      [auditOrdinary, ANALYST],
    );
    expect(res.affectedRows).toBe(1);
    expect(await reviewedValue(auditOrdinary)).toBe('analyst-approved');
  });
});
