-- lessventures.us: Venture Studio & Portfolio Discipline
-- Migration: 00002_ventures
-- Tables: ventures, stage_gates, capital_allocations, validation_checks

-- Ventures
create table if not exists public.ventures (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id),
  name text not null,
  domain text,
  tier integer check (tier in (1, 2, 3)),
  stage text default 'idea' check (stage in ('idea', 'validation', 'build', 'scale', 'sunset')),
  status text default 'active' check (status in ('active', 'paused', 'killed')),
  thesis text,
  owner_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Stage gates track venture progression decisions
create table if not exists public.stage_gates (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references public.ventures(id) on delete cascade,
  stage text not null,
  checklist jsonb default '[]',
  decision text check (decision in ('proceed', 'pivot', 'kill')),
  decision_by uuid references auth.users(id),
  decided_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

-- Capital allocations for budget, spend, and forecast tracking
create table if not exists public.capital_allocations (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references public.ventures(id) on delete cascade,
  amount_cents integer not null,
  allocation_type text check (allocation_type in ('budget', 'spend', 'forecast')),
  period text,
  approved_by uuid references auth.users(id),
  notes text,
  created_at timestamptz default now()
);

-- Validation checks for venture hypothesis testing
create table if not exists public.validation_checks (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references public.ventures(id) on delete cascade,
  check_type text not null,
  status text default 'pending' check (status in ('pending', 'passed', 'failed', 'skipped')),
  evidence_url text,
  reviewer_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.ventures enable row level security;
alter table public.stage_gates enable row level security;
alter table public.capital_allocations enable row level security;
alter table public.validation_checks enable row level security;

-- RLS Policies
create policy "Org members can manage ventures"
  on public.ventures for all
  using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Venture access for stage gates"
  on public.stage_gates for all
  using (
    venture_id in (
      select id from public.ventures
      where org_id in (select org_id from public.profiles where id = auth.uid())
    )
  );

create policy "Venture access for capital"
  on public.capital_allocations for all
  using (
    venture_id in (
      select id from public.ventures
      where org_id in (select org_id from public.profiles where id = auth.uid())
    )
  );

create policy "Venture access for validation"
  on public.validation_checks for all
  using (
    venture_id in (
      select id from public.ventures
      where org_id in (select org_id from public.profiles where id = auth.uid())
    )
  );
