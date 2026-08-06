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
}
