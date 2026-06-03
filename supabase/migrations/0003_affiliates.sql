-- ============================================================================
-- MonAgentPerso — Affiliation maison V1 (à exécuter dans Supabase SQL Editor)
-- Sans Stripe Connect. Suivi des ventes par influenceur + commissions.
-- Idempotent : ré-exécutable sans danger.
-- ============================================================================

-- 1. Affiliés (influenceurs)
create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,                 -- = le ?ref=  (ex. "emma")
  email text,
  commission_rate numeric not null default 30,  -- en %
  status text not null default 'active',         -- 'active' | 'inactive'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Conversions affiliées (1 vente attribuée = 1 ligne)
create table if not exists public.affiliate_conversions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid references public.affiliates(id) on delete set null,
  affiliate_ref text,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  stripe_checkout_session_id text unique,    -- UNIQUE → anti-doublon webhook
  paid_questionnaire_response_id uuid
    references public.paid_questionnaire_responses(id) on delete set null,
  amount_total integer,                       -- centimes (ex. 4990)
  commission_rate numeric,                    -- % figé au moment de la vente
  commission_amount integer,                  -- centimes (ex. 998 = 9,98 €)
  commission_status text not null default 'unpaid',  -- 'unpaid' | 'paid'
  paid_at timestamptz,
  payment_method text,                        -- rempli manuellement (ex. 'virement', 'paypal')
  payment_reference text,                     -- réf. de ton paiement manuel
  created_at timestamptz not null default now()
);

create index if not exists affiliate_conversions_affiliate_id_idx
  on public.affiliate_conversions (affiliate_id);
create index if not exists affiliate_conversions_status_idx
  on public.affiliate_conversions (commission_status);
create index if not exists affiliate_conversions_ref_idx
  on public.affiliate_conversions (affiliate_ref);

-- 3. Colonne affiliate_ref sur pending_questionnaires (si absente)
alter table public.pending_questionnaires
  add column if not exists affiliate_ref text;

-- 4. Colonne affiliate_ref sur paid_questionnaire_responses (si absente)
alter table public.paid_questionnaire_responses
  add column if not exists affiliate_ref text;

-- 5. RLS — tables sensibles : activées SANS policy de lecture publique.
--    => aucun utilisateur normal (anon/authenticated) ne peut lire ces tables.
--    Seul service_role (utilisé par le webhook / l'API serveur) y accède (il bypasse la RLS).
--    Toi : tu consultes via Supabase (SQL editor / Table editor en service_role).
alter table public.affiliates enable row level security;
alter table public.affiliate_conversions enable row level security;

-- Par sécurité, on retire toute policy permissive qui aurait pu exister.
drop policy if exists "no public read affiliates" on public.affiliates;
drop policy if exists "no public read conversions" on public.affiliate_conversions;
-- (Volontairement aucune policy SELECT/INSERT pour les rôles client : tout est verrouillé.)

-- 6. updated_at auto sur affiliates (réutilise la fonction du 0001)
drop trigger if exists affiliates_set_updated_at on public.affiliates;
create trigger affiliates_set_updated_at
  before update on public.affiliates
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Exemple : créer un affilié
-- insert into public.affiliates (name, slug, email, commission_rate)
-- values ('Emma Dupont', 'emma', 'emma@example.com', 30);
-- ============================================================================
