-- Imágenes públicas de cursos, artículos y eventos
-- Ejecutar en Supabase → SQL Editor

alter table public.articles
  add column if not exists image_url text;

alter table public.courses
  add column if not exists image_url text;

alter table public.events
  add column if not exists image_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'laboratorio-media',
  'laboratorio-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "laboratorio_media_public_read" on storage.objects;
create policy "laboratorio_media_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'laboratorio-media');

drop policy if exists "laboratorio_media_admin_insert" on storage.objects;
create policy "laboratorio_media_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'laboratorio-media' and public.is_admin());

drop policy if exists "laboratorio_media_admin_update" on storage.objects;
create policy "laboratorio_media_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'laboratorio-media' and public.is_admin())
with check (bucket_id = 'laboratorio-media' and public.is_admin());

drop policy if exists "laboratorio_media_admin_delete" on storage.objects;
create policy "laboratorio_media_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'laboratorio-media' and public.is_admin());
