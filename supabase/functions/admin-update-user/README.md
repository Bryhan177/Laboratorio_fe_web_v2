# Edge Function: editar usuario (incluye correo de Auth)

## ¿Por qué una Edge Function?
El login usa `auth.users`. Desde el frontend (anon key) no se puede cambiar ese correo.
La función usa el **service role** solo en el servidor de Supabase.

## Desplegar

1. Instala Supabase CLI si no la tienes:
   ```bash
   npm install -g supabase
   ```

2. Inicia sesión y vincula el proyecto:
   ```bash
   supabase login
   supabase link --project-ref jpijwcviymgfdhyirfdc
   ```

3. Despliega la función:
   ```bash
   supabase functions deploy admin-update-user
   ```

4. En el panel de Supabase → **Edge Functions** → `admin-update-user`, confirma que esté activa.

## Probar
En el panel admin edita un usuario y cambia el correo o la contraseña. Luego inicia sesión con los datos nuevos.
