import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';

export type EventStatus = 'proximo' | 'completado';

export interface AppEvent {
    id: string;
    title: string;
    event_date: string;
    place: string;
    cupos: number;
    status: EventStatus;
    created_at?: string;
}

export type EventInput = {
    title: string;
    event_date: string;
    place: string;
    cupos: number;
    status: EventStatus;
};

@Injectable({
    providedIn: 'root'
})
export class EventsService {
    async list(): Promise<AppEvent[]> {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('event_date', { ascending: true });

        if (error) {
            throw new Error(error.message);
        }

        return (data ?? []) as AppEvent[];
    }

    async create(input: EventInput): Promise<AppEvent> {
        const { data, error } = await supabase.from('events').insert(input).select('*').single();
        if (error) {
            throw new Error(this.mapWriteError(error.message));
        }
        return data as AppEvent;
    }

    async update(id: string, input: EventInput): Promise<void> {
        const { error } = await supabase.from('events').update(input).eq('id', id);
        if (error) {
            throw new Error(this.mapWriteError(error.message));
        }
    }

    async remove(id: string): Promise<void> {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) {
            throw new Error(this.mapWriteError(error.message));
        }
    }

    private mapWriteError(message: string): string {
        if (message.toLowerCase().includes('row-level security')) {
            return 'No tienes permiso para modificar eventos. Ejecuta supabase/fix-events-rls.sql en Supabase y verifica que tu rol sea administrador.';
        }
        return message;
    }
}
