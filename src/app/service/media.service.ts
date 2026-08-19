import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';

const BUCKET = 'laboratorio-media';
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

@Injectable({
    providedIn: 'root'
})
export class MediaService {
    validateImage(file: File): void {
        if (!ALLOWED_TYPES.includes(file.type)) {
            throw new Error('Usa una imagen JPG, PNG, WEBP o GIF.');
        }
        if (file.size > MAX_BYTES) {
            throw new Error('La imagen no puede superar 5 MB.');
        }
    }

    async upload(folder: 'courses' | 'articles' | 'events', file: File): Promise<string> {
        this.validateImage(file);

        const extension = this.extension(file);
        const path = `${folder}/${crypto.randomUUID()}.${extension}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
        });

        if (error) {
            throw new Error(this.mapError(error.message));
        }

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        return data.publicUrl;
    }

    private extension(file: File): string {
        const fromName = file.name.split('.').pop()?.toLowerCase();
        if (fromName && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fromName)) {
            return fromName === 'jpeg' ? 'jpg' : fromName;
        }

        if (file.type === 'image/png') return 'png';
        if (file.type === 'image/webp') return 'webp';
        if (file.type === 'image/gif') return 'gif';
        return 'jpg';
    }

    private mapError(message: string): string {
        const normalized = message.toLowerCase();
        if (normalized.includes('bucket') || normalized.includes('not found')) {
            return 'Falta configurar el almacenamiento de imágenes. Ejecuta supabase/media-storage.sql en Supabase.';
        }
        if (normalized.includes('row-level security') || normalized.includes('unauthorized')) {
            return 'No tienes permiso para subir imágenes. Confirma que tu usuario sea administrador.';
        }
        return message || 'No se pudo subir la imagen.';
    }
}
