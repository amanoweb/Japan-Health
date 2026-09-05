-- Japan Health provider database schema
-- Stores public provider-access facts only. Do not store patient inquiries or sensitive health data here.

create table if not exists public.providers (
  id text primary key,
  data jsonb not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint provider_data_shape check (
    data ? 'id'
    and data ? 'name'
    and data->>'id' = id
  )
);

create index if not exists providers_city_idx
  on public.providers ((data->>'city'));

create index if not exists providers_area_idx
  on public.providers ((data->>'area'));

create index if not exists providers_record_status_idx
  on public.providers ((data->>'recordStatus'));

create index if not exists providers_specialties_gin_idx
  on public.providers using gin ((data->'specialties'));

alter table public.providers enable row level security;

-- No public RLS policy is created intentionally.
-- The Vercel server-side /api/providers endpoint reads with SUPABASE_SERVICE_ROLE_KEY.
-- Browser clients must never receive the service-role key.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists providers_set_updated_at on public.providers;
create trigger providers_set_updated_at
before update on public.providers
for each row execute function public.set_updated_at();
