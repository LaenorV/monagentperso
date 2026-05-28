-- ============================================================================
-- MonAgentPerso — table de livraison des agents
-- À exécuter dans Supabase SQL Editor APRÈS 0001_payments.sql.
-- ============================================================================

create table if not exists public.agent_deliveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  paid_questionnaire_response_id uuid
    references public.paid_questionnaire_responses(id) on delete cascade,
  email text,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'delivered', 'revision_needed')),
  agent_name text,
  agent_url text,
  agent_instructions text,
  admin_note text,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists agent_deliveries_user_id_idx
  on public.agent_deliveries (user_id);
create index if not exists agent_deliveries_paid_response_idx
  on public.agent_deliveries (paid_questionnaire_response_id);
create index if not exists agent_deliveries_status_idx
  on public.agent_deliveries (status);

-- RLS — l'utilisateur ne voit QUE ses propres lignes.
alter table public.agent_deliveries enable row level security;

drop policy if exists "Users read own deliveries" on public.agent_deliveries;
create policy "Users read own deliveries" on public.agent_deliveries
  for select using (auth.uid() = user_id);

-- Écritures réservées au service_role (création / mise à jour côté admin).
-- Aucune policy INSERT/UPDATE/DELETE → seul service_role peut écrire.

-- Trigger updated_at — réutilise la fonction set_updated_at() définie dans 0001.
drop trigger if exists agent_deliveries_set_updated_at on public.agent_deliveries;
create trigger agent_deliveries_set_updated_at
  before update on public.agent_deliveries
  for each row execute function public.set_updated_at();
