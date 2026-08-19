import { Injectable } from '@angular/core';
import { UserRole } from '../core/auth.service';
import { supabase } from '../core/supabase.client';

export interface AdminProfile {
    id: string;
    full_name: string | null;
    email: string | null;
    role: UserRole;
    status: 'activo' | 'inactivo';
    created_at?: string;
}

export type AdminProfileUpdate = {
    full_name: string | null;
    email: string | null;
    role: UserRole;
    status: 'activo' | 'inactivo';
    password?: string;
};

@Injectable({
    providedIn: 'root'
})
export class ProfilesService {
    async list(): Promise<AdminProfile[]> {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, email, role, status, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return (data ?? []) as AdminProfile[];
    }

    async update(id: string, payload: AdminProfileUpdate): Promise<AdminProfile> {
        const { data, error } = await supabase.functions.invoke('admin-update-user', {
            body: {
                id,
                full_name: payload.full_name,
                email: payload.email,
                role: payload.role,
                status: payload.status,
                password: payload.password
            }
        });

        if (error) {
            throw new Error(this.mapFunctionError(error.message));
        }

        if (data?.error) {
            throw new Error(String(data.error));
        }

        if (!data?.profile) {
            throw new Error('No se recibió el usuario actualizado.');
        }

        return data.profile as AdminProfile;
    }

    async updateStatus(id: string, status: 'activo' | 'inactivo'): Promise<void> {
        const { error } = await supabase.from('profiles').update({ status }).eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }

    async updateRole(id: string, role: UserRole): Promise<void> {
        const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }

    private mapFunctionError(message: string): string {
        const normalized = message.toLowerCase();
        if (normalized.includes('failed to send') || normalized.includes('not found') || normalized.includes('404')) {
            return 'No se pudo actualizar el correo. Despliega la Edge Function admin-update-user (ver supabase/functions/admin-update-user/README.md).';
        }
        return message;
    }
}
