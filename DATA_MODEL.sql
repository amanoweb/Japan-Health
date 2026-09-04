-- Optional Supabase/Postgres schema for v2

create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  company_name text,
  product_name text not null,
  short_description text,
  intended_use text,
  product_type text,
  specialty text,
  ai_ml boolean default false,
  risk_level text,
  suspected_product_code text,
  created_at timestamptz default now()
);

create table fda_search_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  query jsonb not null,
  classifications jsonb,
  clearances_510k jsonb,
  pma_records jsonb,
  generated_at timestamptz default now()
);

create table readiness_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  search_run_id uuid references fda_search_runs(id) on delete set null,
  score int,
  likely_route text,
  product_code text,
  device_class text,
  regulation_number text,
  evidence_gaps jsonb,
  next_actions jsonb,
  analysis_json jsonb,
  created_at timestamptz default now()
);

create table expert_review_leads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete set null,
  email text,
  name text,
  company text,
  requested_service text,
  status text default 'new',
  created_at timestamptz default now()
);
