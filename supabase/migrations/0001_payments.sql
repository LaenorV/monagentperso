-- ============================================================================
-- MonAgentPerso — tables paiement (à exécuter dans Supabase SQL Editor)
-- ============================================================================

-- 1. pending_questionnaires : questionnaires en attente de paiement
create table if not exists public.pending_questionnaires (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  questionnaire jsonb not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'expired', 'cancelled')),
  stripe_checkout_session_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pending_questionnaires_user_id_idx
  on public.pending_questionnaires (user_id);
create index if not exists pending_questionnaires_status_idx
  on public.pending_questionnaires (status);

-- 2. paid_questionnaire_responses : enregistrement APRÈS paiement Stripe confirmé
create table if not exists public.paid_questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  pending_questionnaire_id uuid not null unique
    references public.pending_questionnaires(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  stripe_checkout_session_id text unique not null,
  stripe_payment_intent_id text,
  amount_total integer,
  currency text,
  payment_status text,
  questionnaire jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists paid_responses_user_id_idx
  on public.paid_questionnaire_responses (user_id);
create index if not exists paid_responses_session_idx
  on public.paid_questionnaire_responses (stripe_checkout_session_id);

-- 3. RLS — défense en profondeur (l'API utilise déjà service_role pour écrire)
alter table public.pending_questionnaires enable row level security;
alter table public.paid_questionnaire_responses enable row level security;

-- Lecture : un utilisateur ne peut voir QUE ses propres lignes
drop policy if exists "Users read own pending" on public.pending_questionnaires;
create policy "Users read own pending" on public.pending_questionnaires
  for select using (auth.uid() = user_id);

drop policy if exists "Users read own paid" on public.paid_questionnaire_responses;
create policy "Users read own paid" on public.paid_questionnaire_responses
  for select using (auth.uid() = user_id);

-- Écriture : interdite aux clients normaux. Seul service_role peut écrire (il bypasse RLS).

-- 4. Trigger pour maintenir updated_at sur pending
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pending_questionnaires_set_updated_at on public.pending_questionnaires;
create trigger pending_questionnaires_set_updated_at
  before update on public.pending_questionnaires
  for each row execute function public.set_updated_at();
