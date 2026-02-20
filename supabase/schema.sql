create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  daily_limit integer not null default 200,
  evolution_url text,
  evolution_api_key text,
  evolution_instance text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  empresa text not null,
  telefone text not null,
  cidade text,
  estado text,
  categoria text,
  instagram text,
  site text,
  mensagem_gerada text,
  status text not null default 'novo' check (status in ('novo','gerando','pronto','enviado','erro')),
  response_evolution jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, telefone)
);

create index if not exists leads_user_status_idx on public.leads(user_id, status);

alter table public.profiles enable row level security;
alter table public.leads enable row level security;

create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can read own leads" on public.leads
  for select using (auth.uid() = user_id);
create policy "Users can insert own leads" on public.leads
  for insert with check (auth.uid() = user_id);
create policy "Users can update own leads" on public.leads
  for update using (auth.uid() = user_id);
