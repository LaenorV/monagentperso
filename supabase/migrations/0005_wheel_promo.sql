-- ============================================================================
-- MonAgentPerso — Roue promotionnelle + codes de réduction
-- À exécuter dans Supabase SQL Editor. Idempotent.
-- ============================================================================

-- 1. Tirages de la roue : 1 seul par compte (unique user_id)
create table if not exists public.wheel_spins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  result_type text not null,   -- none | perso_30 | marketplace_free | perso_free
  result_label text not null,
  promo_code text,
  created_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists wheel_spins_user_idx on public.wheel_spins (user_id);

alter table public.wheel_spins enable row level security;
drop policy if exists "Users read own spin" on public.wheel_spins;
create policy "Users read own spin" on public.wheel_spins
  for select using (auth.uid() = user_id);
-- Aucune policy INSERT/UPDATE pour les clients : tout passe par service_role.

-- 2. Codes promo (1 code = 1 user, usage unique)
create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  discount_type text not null,           -- percentage | fixed | free
  discount_value integer not null,       -- 30 = -30% ; 100 = gratuit
  applies_to text not null,              -- personalized_agent | marketplace | all
  max_uses integer not null default 1,
  used_count integer not null default 0,
  status text not null default 'active', -- active | used | expired | cancelled
  stripe_coupon_id text,
  stripe_promotion_code_id text,
  created_at timestamptz not null default now(),
  used_at timestamptz
);

create index if not exists promo_codes_user_idx on public.promo_codes (user_id);
create index if not exists promo_codes_code_idx on public.promo_codes (code);

alter table public.promo_codes enable row level security;
drop policy if exists "Users read own promo" on public.promo_codes;
create policy "Users read own promo" on public.promo_codes
  for select using (auth.uid() = user_id);
-- Aucune policy INSERT/UPDATE pour les clients : création / consommation via service_role.

-- 3. Colonnes complémentaires (achats "offerts" sans Stripe)
--    payment_status portera 'free_promo' ; on garde promo_code pour la traçabilité.
alter table public.paid_questionnaire_responses
  add column if not exists promo_code text;
alter table public.ready_made_agent_purchases
  add column if not exists promo_code text;
alter table public.pending_questionnaires
  add column if not exists promo_code text;
