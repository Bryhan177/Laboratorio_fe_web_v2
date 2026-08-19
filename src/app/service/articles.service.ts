import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';

export type ArticleStatus = 'publicado' | 'borrador';

export interface Article {
    id: string;
    title: string;
    author_id: string | null;
    author_name: string;
    content: string | null;
    status: ArticleStatus;
    published_at: string | null;
    image_url: string | null;
    created_at?: string;
}

export type ArticleInput = {
    title: string;
    content?: string | null;
    status: ArticleStatus;
    published_at?: string | null;
    author_id?: string | null;
    image_url?: string | null;
};

@Injectable({
    providedIn: 'root'
})
export class ArticlesService {
    async listPublished(): Promise<Article[]> {
        const { data, error } = await supabase
            .from('articles')
            .select('id, title, author_id, content, status, published_at, image_url, created_at')
            .eq('status', 'publicado')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(this.mapReadError(error.message));
        }

        return (data ?? []).map((row: any) => this.mapArticle(row, 'Equipo Laboratorio'));
    }

    async list(): Promise<Article[]> {
        const { data, error } = await supabase
            .from('articles')
            .select('id, title, author_id, content, status, published_at, image_url, created_at, profiles:author_id(full_name)')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(this.mapReadError(error.message));
        }

        return (data ?? []).map((row: any) => this.mapArticle(row, row.profiles?.full_name || 'Sin autor'));
    }

    async create(input: ArticleInput): Promise<Article> {
        const { data, error } = await supabase
            .from('articles')
            .insert({
                title: input.title,
                content: input.content ?? null,
                status: input.status,
                published_at: input.status === 'publicado' ? input.published_at || new Date().toISOString().slice(0, 10) : null,
                author_id: input.author_id ?? null,
                image_url: input.image_url ?? null
            })
            .select('id, title, author_id, content, status, published_at, image_url, created_at')
            .single();

        if (error) {
            throw new Error(this.mapReadError(error.message));
        }

        return this.mapArticle(data, 'Tú');
    }

    async update(id: string, input: ArticleInput): Promise<void> {
        const { error } = await supabase
            .from('articles')
            .update({
                title: input.title,
                content: input.content ?? null,
                status: input.status,
                published_at:
                    input.status === 'publicado'
                        ? input.published_at || new Date().toISOString().slice(0, 10)
                        : null,
                image_url: input.image_url ?? null
            })
            .eq('id', id);

        if (error) {
            throw new Error(this.mapReadError(error.message));
        }
    }

    async remove(id: string): Promise<void> {
        const { error } = await supabase.from('articles').delete().eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }

    private mapArticle(row: any, authorName: string): Article {
        return {
            id: row.id,
            title: row.title,
            author_id: row.author_id,
            author_name: authorName,
            content: row.content,
            status: row.status,
            published_at: row.published_at,
            image_url: row.image_url ?? null,
            created_at: row.created_at
        };
    }

    private mapReadError(message: string): string {
        if (message.toLowerCase().includes('image_url')) {
            return 'Falta la columna image_url en artículos. Ejecuta supabase/media-storage.sql en Supabase.';
        }
        return message;
    }
}
