-- Auth + perfiles: trigger de registro y políticas RLS
-- Ejecutar completo en Supabase → SQL Editor

create extension if not exists "pgcrypto";

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.articles enable row level security;
alter table public.events enable row level security;

-- Al registrarse en Auth, crear fila en profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_role text;
begin
  selected_role := coalesce(new.raw_user_meta_data->>'role', 'estudiante');

  if selected_role not in ('administrador', 'educador', 'estudiante', 'entidad') then
    selected_role := 'estudiante';
  end if;

  insert into public.profiles (id, full_name, email, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    selected_role,
    'activo'
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        role = excluded.role;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Evita recursión en políticas de admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'administrador'
  );
$$;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
on public.profiles
for select
to authenticated
using (public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "courses_select_public_active" on public.courses;
create policy "courses_select_public_active"
on public.courses
for select
to anon, authenticated
using (status = 'activo');

drop policy if exists "courses_all_admin" on public.courses;
create policy "courses_all_admin"
on public.courses
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
