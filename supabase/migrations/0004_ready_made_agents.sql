-- ============================================================================
-- MonAgentPerso — Agents prêts à l'emploi (4,90 €) — suivi des achats
-- À exécuter dans Supabase SQL Editor. Idempotent.
-- ============================================================================

create table if not exists public.ready_made_agent_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  agent_slug text not null,
  agent_name text not null,
  agent_type text,
  stripe_checkout_session_id text unique not null,  -- anti-doublon webhook
  stripe_payment_intent_id text,
  amount_total integer,
  currency text,
  payment_status text,
  created_at timestamptz not null default now()
);

create index if not exists rmap_user_id_idx
  on public.ready_made_agent_purchases (user_id);
create index if not exists rmap_user_slug_idx
  on public.ready_made_agent_purchases (user_id, agent_slug);

-- RLS : l'utilisateur voit UNIQUEMENT ses propres achats. Aucune insertion
-- côté client : l'insert se fait via service_role dans le webhook (il bypasse la RLS).
alter table public.ready_made_agent_purchases enable row level security;

drop policy if exists "Users read own agent purchases" on public.ready_made_agent_purchases;
create policy "Users read own agent purchases" on public.ready_made_agent_purchases
  for select using (auth.uid() = user_id);

-- (Volontairement aucune policy INSERT/UPDATE/DELETE pour les rôles client.)
