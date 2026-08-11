-- Fix rápido: permitir a administradores crear/editar/eliminar eventos
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

alter table public.events enable row level security;

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

-- Si aún falla, verifica que tu usuario sea administrador:
-- select id, email, role, status from public.profiles where email = 'TU_CORREO';
--
-- Si no lo es, actualízalo:
-- update public.profiles set role = 'administrador' where email = 'TU_CORREO';
