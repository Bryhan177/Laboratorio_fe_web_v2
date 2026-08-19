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
    image_url: string | null;
    created_at?: string;
}

export type EventInput = {
    title: string;
    event_date: string;
    place: string;
    cupos: number;
    status: EventStatus;
    image_url?: string | null;
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

        return (data ?? []).map((row) => this.mapEvent(row));
    }

    async listPublic(): Promise<AppEvent[]> {
        const { data, error } = await supabase
            .from('events')
            .select('id, title, event_date, place, cupos, status, image_url, created_at')
            .order('event_date', { ascending: true });

        if (error) {
            throw new Error(this.mapWriteError(error.message));
        }

        return (data ?? []).map((row) => this.mapEvent(row));
    }

    async create(input: EventInput): Promise<AppEvent> {
        const { data, error } = await supabase.from('events').insert(input).select('*').single();
        if (error) {
            throw new Error(this.mapWriteError(error.message));
        }
        return this.mapEvent(data);
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

    private mapEvent(row: any): AppEvent {
        return {
            id: row.id,
            title: row.title,
            event_date: row.event_date,
            place: row.place,
            cupos: row.cupos,
            status: row.status,
            image_url: row.image_url ?? null,
            created_at: row.created_at
        };
    }

    private mapWriteError(message: string): string {
        const normalized = message.toLowerCase();
        if (normalized.includes('image_url')) {
            return 'Falta la columna image_url en eventos. Vuelve a ejecutar supabase/media-storage.sql en Supabase.';
        }
        if (normalized.includes('row-level security')) {
            return 'No tienes permiso para modificar eventos. Ejecuta supabase/fix-events-rls.sql en Supabase y verifica que tu rol sea administrador.';
        }
        return message;
    }
}
