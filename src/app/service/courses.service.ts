import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';

export type CourseStatus = 'activo' | 'borrador' | 'finalizado';

export interface Course {
    id: string;
    title: string;
    category: string;
    description: string | null;
    cupos: number;
    status: CourseStatus;
    image_url: string | null;
    created_at?: string;
    inscritos?: number;
}

export type CourseInput = {
    title: string;
    category: string;
    cupos: number;
    status: CourseStatus;
    description?: string | null;
};

@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    async list(): Promise<Course[]> {
        const { data, error } = await supabase
            .from('courses')
            .select('*, enrollments(count)')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return (data ?? []).map((row: any) => ({
            id: row.id,
            title: row.title,
            category: row.category,
            description: row.description,
            cupos: row.cupos,
            status: row.status,
            image_url: row.image_url,
            created_at: row.created_at,
            inscritos: row.enrollments?.[0]?.count ?? 0
        }));
    }

    async create(input: CourseInput): Promise<Course> {
        const { data, error } = await supabase
            .from('courses')
            .insert({
                title: input.title,
                category: input.category,
                cupos: input.cupos,
                status: input.status,
                description: input.description ?? null
            })
            .select('*')
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return { ...data, inscritos: 0 } as Course;
    }

    async update(id: string, input: CourseInput): Promise<void> {
        const { error } = await supabase
            .from('courses')
            .update({
                title: input.title,
                category: input.category,
                cupos: input.cupos,
                status: input.status,
                description: input.description ?? null
            })
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }

    async remove(id: string): Promise<void> {
        const { error } = await supabase.from('courses').delete().eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
}
