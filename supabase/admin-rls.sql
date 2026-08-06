-- Panel admin: políticas RLS completas
-- Ejecutar en Supabase → SQL Editor

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

-- Profiles: admin puede actualizar roles/estado
drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Courses: admin ve/gestiona todos; público solo activos
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

-- Articles
drop policy if exists "articles_select_public" on public.articles;
create policy "articles_select_public"
on public.articles
for select
to anon, authenticated
using (status = 'publicado');

drop policy if exists "articles_all_admin" on public.articles;
create policy "articles_all_admin"
on public.articles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Events
drop policy if exists "events_select_public" on public.events;
create policy "events_select_public"
on public.events
for select
to anon, authenticated
using (true);

drop policy if exists "events_all_admin" on public.events;
create policy "events_all_admin"
on public.events
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Enrollments: admin lee conteos; usuario ve los suyos
drop policy if exists "enrollments_select_own" on public.enrollments;
create policy "enrollments_select_own"
on public.enrollments
for select
to authenticated
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "enrollments_all_admin" on public.enrollments;
create policy "enrollments_all_admin"
on public.enrollments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
