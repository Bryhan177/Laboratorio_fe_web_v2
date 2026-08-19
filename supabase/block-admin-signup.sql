-- Impide crear administradores desde el registro público.
-- Los admins existentes no se modifican.
-- Ejecutar en Supabase → SQL Editor

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

  if selected_role not in ('educador', 'estudiante', 'entidad') then
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
