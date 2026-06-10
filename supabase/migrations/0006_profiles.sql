-- ============================================================================
-- MonAgentPerso — Profils utilisateurs (recense l'identifiant Instagram)
-- À exécuter dans Supabase SQL Editor. Idempotent.
-- ============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  instagram text,
  created_at timestamptz not null default now()
);

-- Si la table existait déjà sans la colonne :
alter table public.profiles add column if not exists instagram text;

create index if not exists profiles_instagram_idx on public.profiles (instagram);

-- RLS : l'utilisateur lit uniquement son propre profil.
-- L'écriture se fait côté serveur (service_role, qui bypasse la RLS) à l'inscription.
alter table public.profiles enable row level security;
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles
  for select using (auth.uid() = id);

-- Pour recenser tous les Instagram renseignés (à exécuter en tant qu'admin) :
-- select email, instagram, created_at from public.profiles
-- where instagram is not null order by created_at desc;
