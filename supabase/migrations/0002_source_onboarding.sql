-- 0002_source_onboarding.sql
-- Day A of the Source Onboarding sprint (spec §2 + §7 Day A).
--   * add classification columns to `sources`
--   * create `site_audits` and `discovery_queue`
--   * apply three-tier RLS (admin / analyst / va) to both new tables AND to
--     `sources` (spec §2.1: `sources` currently ships with RLS disabled — fix it
--     here, don't defer further).

-- ---------------------------------------------------------------------------
-- Enums (spec §2.1 / §2.2 / §2.3)
-- ---------------------------------------------------------------------------
do $$ begin
  create type classification as enum (
    'embedded_json', 'api_endpoint', 'static_html', 'js_rendered',
    'manual_entry_only', 'needs_review', 'unclassified'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type discovered_via as enum (
    'manual', 'excel_import', 'search_discovery', 'portal_integration'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type audit_decision as enum ('auto_approved', 'queued_for_review');
exception when duplicate_object then null; end $$;

do $$ begin
  create type discovery_status as enum ('pending', 'classified', 'rejected');
exception when duplicate_object then null; end $$;

-- Extend source_status with pending_review (spec §2.1). ALTER TYPE ... ADD VALUE
-- cannot run in a txn block with usage in the same statement, so guard it.
do $$ begin
  alter type source_status add value if not exists 'pending_review';
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- sources — new columns (spec §2.1)
-- ---------------------------------------------------------------------------
alter table sources
  add column if not exists classification classification not null default 'unclassified',
  add column if not exists classification_confidence numeric
    check (classification_confidence is null
           or (classification_confidence >= 0 and classification_confidence <= 1)),
  add column if not exists scraper_strategy text,
  add column if not exists discovered_via discovered_via not null default 'manual',
  add column if not exists tos_flag boolean not null default false,
  add column if not exists last_classified_at timestamptz;

-- ---------------------------------------------------------------------------
-- site_audits (spec §2.2)
-- ---------------------------------------------------------------------------
create table if not exists site_audits (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete cascade,
  run_at timestamptz not null default now(),
  detected_structure text,
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  decision audit_decision not null,
  reviewed_by uuid references app_users(id),
  review_decision text
);
create index if not exists site_audits_source_id_idx on site_audits(source_id);

-- ---------------------------------------------------------------------------
-- discovery_queue (spec §2.3)
-- ---------------------------------------------------------------------------
create table if not exists discovery_queue (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  discovered_via discovered_via not null,
  discovered_at timestamptz not null default now(),
  status discovery_status not null default 'pending',
  source_id uuid references sources(id) on delete set null
);
create index if not exists discovery_queue_status_idx on discovery_queue(status);

-- ---------------------------------------------------------------------------
-- RLS — three-tier policy (spec §2.4). Applied to sources + both new tables.
--   admin   : full read/write
--   analyst : read all; write (reviews, status changes)
--   va      : read only (manual-entry workflow surfaces read the register)
-- Service-role connections bypass RLS entirely, which is how the onboarding
-- jobs write these tables (see src/db/supabase.ts).
-- ---------------------------------------------------------------------------
alter table sources enable row level security;
alter table site_audits enable row level security;
alter table discovery_queue enable row level security;

-- sources
drop policy if exists sources_read on sources;
create policy sources_read on sources
  for select using (current_app_role() in ('admin', 'analyst', 'va'));

drop policy if exists sources_write on sources;
create policy sources_write on sources
  for all
  using (current_app_role() in ('admin', 'analyst'))
  with check (current_app_role() in ('admin', 'analyst'));

-- site_audits — read is three-tier; write is split so that FLAGGED audits
-- (parent source has tos_flag=true OR classification='needs_review') are
-- admin-only, while analysts keep write/review rights on ordinary (non-flagged)
-- audits. This is a security-relevant default: the ToS/legal angle on flagged
-- items warrants an explicit human decision at the admin tier (spec §4/§8).
-- site_audits has no tos_flag column of its own, so "flagged" is derived from
-- the parent `sources` row via the EXISTS sub-select below.
drop policy if exists site_audits_read on site_audits;
create policy site_audits_read on site_audits
  for select using (current_app_role() in ('admin', 'analyst', 'va'));

-- Admin: full write on every audit row, flagged or not.
drop policy if exists site_audits_write on site_audits;          -- retire prior combined policy
drop policy if exists site_audits_write_admin on site_audits;
create policy site_audits_write_admin on site_audits
  for all
  using (current_app_role() = 'admin')
  with check (current_app_role() = 'admin');

-- Analyst: write only on audits whose source is NOT flagged. Flagged audits
-- (tos_flag OR needs_review) fall through to admin-only. Analyst review rights
-- on ordinary staged deals are unchanged — this restricts flagged rows only.
drop policy if exists site_audits_write_analyst on site_audits;
create policy site_audits_write_analyst on site_audits
  for all
  using (
    current_app_role() = 'analyst'
    and not exists (
      select 1 from sources s
      where s.id = site_audits.source_id
        and (s.tos_flag = true or s.classification = 'needs_review')
    )
  )
  with check (
    current_app_role() = 'analyst'
    and not exists (
      select 1 from sources s
      where s.id = site_audits.source_id
        and (s.tos_flag = true or s.classification = 'needs_review')
    )
  );

-- discovery_queue
drop policy if exists discovery_queue_read on discovery_queue;
create policy discovery_queue_read on discovery_queue
  for select using (current_app_role() in ('admin', 'analyst', 'va'));

drop policy if exists discovery_queue_write on discovery_queue;
create policy discovery_queue_write on discovery_queue
  for all
  using (current_app_role() in ('admin', 'analyst'))
  with check (current_app_role() in ('admin', 'analyst'));
