-- 0001_base.sql
-- Minimal base schema that the Source Onboarding spec assumes already exists in
-- the wider CAIS system (18 tables). This scaffold only stands up the few tables
-- the onboarding pipeline touches, so the additive migration (0002) has real
-- tables to extend. In the real project these already exist — treat 0001 as the
-- contract the onboarding code depends on, not a re-creation of all of CAIS.

create extension if not exists "pgcrypto";

-- --- app users + role, backing the three-tier RLS (admin / analyst / va) -------
do $$ begin
  create type user_role as enum ('admin', 'analyst', 'va');
exception when duplicate_object then null; end $$;

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid unique,                 -- maps to auth.users.id in Supabase
  email text unique,
  role user_role not null default 'va',
  created_at timestamptz not null default now()
);

-- Helper: the current request's role, read from the app_users row that matches
-- the JWT subject. SECURITY DEFINER so RLS policies can call it without needing
-- their own read access to app_users.
create or replace function current_app_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from app_users where auth_uid = auth.uid();
$$;

-- --- sources register (base columns; 0002 adds the classification columns) -----
do $$ begin
  create type source_status as enum ('active', 'paused');
exception when duplicate_object then null; end $$;

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  url text unique not null,
  name text,
  status source_status not null default 'active',
  schedule text not null default 'weekly:friday',   -- spec §4 default
  created_at timestamptz not null default now()
);

-- --- requirements register (subset used by the Stage-0 filter, spec §6) --------
create table if not exists requirements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  active boolean not null default true,
  geographies text[] not null default '{}',
  min_size integer,
  budget_min numeric,
  budget_max numeric,
  keywords text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- --- listings (scraped rows; Stage-0 filter runs over these before scoring) ----
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete cascade,
  external_id text not null,
  geography text,
  size integer,
  price numeric,
  listing_text text,
  created_at timestamptz not null default now(),
  unique (source_id, external_id)
);
