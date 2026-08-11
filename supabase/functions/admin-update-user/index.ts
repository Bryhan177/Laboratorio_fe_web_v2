// Edge Function: admin-update-user
// Actualiza perfil + correo de Auth (requiere service role).
// Deploy: supabase functions deploy admin-update-user

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

type UserRole = 'administrador' | 'educador' | 'estudiante' | 'entidad';

interface UpdateUserBody {
    id?: string;
    full_name?: string;
    email?: string;
    role?: UserRole;
    status?: 'activo' | 'inactivo';
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

        if (!supabaseUrl || !anonKey || !serviceRoleKey) {
            throw new Error('Faltan variables de entorno de Supabase en la Edge Function.');
        }

        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return jsonResponse({ error: 'No autorizado.' }, 401);
        }

        const userClient = createClient(supabaseUrl, anonKey, {
            global: { headers: { Authorization: authHeader } }
        });

        const {
            data: { user },
            error: userError
        } = await userClient.auth.getUser();

        if (userError || !user) {
            return jsonResponse({ error: 'Sesión inválida.' }, 401);
        }

        const { data: adminProfile, error: adminError } = await userClient
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (adminError || adminProfile?.role !== 'administrador') {
            return jsonResponse({ error: 'Solo un administrador puede editar usuarios.' }, 403);
        }

        const body = (await req.json()) as UpdateUserBody;
        const id = body.id?.trim();
        const fullName = body.full_name?.trim() ?? '';
        const email = body.email?.trim().toLowerCase() ?? '';
        const role = body.role;
        const status = body.status;

        if (!id) {
            return jsonResponse({ error: 'Falta el id del usuario.' }, 400);
        }

        if (!fullName) {
            return jsonResponse({ error: 'El nombre del usuario es obligatorio.' }, 400);
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return jsonResponse({ error: 'Ingresa un correo electrónico válido.' }, 400);
        }

        if (!role || !['administrador', 'educador', 'estudiante', 'entidad'].includes(role)) {
            return jsonResponse({ error: 'Rol inválido.' }, 400);
        }

        if (!status || !['activo', 'inactivo'].includes(status)) {
            return jsonResponse({ error: 'Estado inválido.' }, 400);
        }

        const adminClient = createClient(supabaseUrl, serviceRoleKey);

        const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(id, {
            email,
            email_confirm: true,
            user_metadata: {
                full_name: fullName,
                role
            }
        });

        if (authUpdateError) {
            throw new Error(authUpdateError.message);
        }

        const { data: updatedProfile, error: profileError } = await adminClient
            .from('profiles')
            .update({
                full_name: fullName,
                email,
                role,
                status
            })
            .eq('id', id)
            .select('id, full_name, email, role, status, created_at')
            .single();

        if (profileError) {
            throw new Error(profileError.message);
        }

        return jsonResponse({ profile: updatedProfile });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo actualizar el usuario.';
        return jsonResponse({ error: message }, 500);
    }
});

function jsonResponse(payload: unknown, status = 200): Response {
    return new Response(JSON.stringify(payload), {
        status,
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
        }
    });
}
