import { Injectable, computed, signal } from '@angular/core';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase.client';

export type UserRole = 'administrador' | 'educador' | 'estudiante' | 'entidad';

export interface UserProfile {
    id: string;
    full_name: string | null;
    email: string | null;
    role: UserRole;
    status: 'activo' | 'inactivo';
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly session = signal<Session | null>(null);
    private readonly profile = signal<UserProfile | null>(null);
    private readonly loading = signal(false);

    readonly currentSession = this.session.asReadonly();
    readonly currentProfile = this.profile.asReadonly();
    readonly isLoading = this.loading.asReadonly();
    readonly isAuthenticated = computed(() => !!this.session());
    readonly isAdmin = computed(() => this.profile()?.role === 'administrador');

    constructor() {
        void this.init();
    }

    private async init(): Promise<void> {
        const { data } = await supabase.auth.getSession();
        this.session.set(data.session);

        if (data.session?.user) {
            await this.loadProfile(data.session.user.id);
        }

        supabase.auth.onAuthStateChange((_event, nextSession) => {
            this.session.set(nextSession);
            if (nextSession?.user) {
                void this.loadProfile(nextSession.user.id);
            } else {
                this.profile.set(null);
            }
        });
    }

    async register(payload: RegisterPayload): Promise<{ needsEmailConfirmation: boolean }> {
        this.loading.set(true);

        try {
            const email = payload.email.trim().toLowerCase();
            const fullName = payload.fullName.trim();
            const role = payload.role;

            const { data, error } = await supabase.auth.signUp({
                email,
                password: payload.password,
                options: {
                    data: {
                        full_name: fullName,
                        role
                    }
                }
            });

            if (error) {
                throw new Error(this.mapAuthError(error.message));
            }

            if (!data.user) {
                throw new Error('No se pudo crear la cuenta.');
            }

            // Supabase a veces no falla si el email ya existe
            if (Array.isArray(data.user.identities) && data.user.identities.length === 0) {
                throw new Error('Este correo ya está registrado. Inicia sesión.');
            }

            // Si hay sesión (confirmación de email desactivada), asegurar perfil
            if (data.session) {
                this.session.set(data.session);
                await this.ensureProfileRow(data.user.id, {
                    full_name: fullName,
                    email,
                    role
                });
                // Cerrar sesión para forzar el flujo: registrarse → iniciar sesión
                await this.logout();
                return { needsEmailConfirmation: false };
            }

            return { needsEmailConfirmation: true };
        } finally {
            this.loading.set(false);
        }
    }

    async login(email: string, password: string): Promise<UserProfile> {
        this.loading.set(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password
            });

            if (error) {
                throw new Error(this.mapAuthError(error.message));
            }

            if (!data.user) {
                throw new Error('No se pudo iniciar sesión.');
            }

            this.session.set(data.session);

            // Si el trigger no creó el perfil, crearlo desde metadata
            const meta = data.user.user_metadata ?? {};
            await this.ensureProfileRow(data.user.id, {
                full_name: (meta['full_name'] as string) || '',
                email: data.user.email ?? email.trim().toLowerCase(),
                role: this.normalizeRole(meta['role'])
            });

            const profile = await this.loadProfile(data.user.id);

            if (!profile) {
                throw new Error('No se encontró el perfil del usuario en la base de datos.');
            }

            if (profile.status !== 'activo') {
                await this.logout();
                throw new Error('Tu cuenta está inactiva. Contacta al administrador.');
            }

            return profile;
        } finally {
            this.loading.set(false);
        }
    }

    async logout(): Promise<void> {
        await supabase.auth.signOut();
        this.session.set(null);
        this.profile.set(null);
    }

    getUser(): User | null {
        return this.session()?.user ?? null;
    }

    async ensureProfile(): Promise<UserProfile | null> {
        if (this.profile()) {
            return this.profile();
        }

        const { data } = await supabase.auth.getSession();
        if (!data.session?.user) {
            return null;
        }

        this.session.set(data.session);
        return this.loadProfile(data.session.user.id);
    }

    private normalizeRole(role: unknown): UserRole {
        const value = String(role ?? '').toLowerCase();
        if (value === 'administrador' || value === 'educador' || value === 'estudiante' || value === 'entidad') {
            return value;
        }
        return 'estudiante';
    }

    private async ensureProfileRow(
        userId: string,
        values: { full_name: string; email: string; role: UserRole }
    ): Promise<void> {
        const existing = await this.loadProfile(userId);
        if (existing) {
            return;
        }

        const { error } = await supabase.from('profiles').upsert(
            {
                id: userId,
                full_name: values.full_name,
                email: values.email,
                role: values.role,
                status: 'activo'
            },
            { onConflict: 'id' }
        );

        if (error) {
            console.error('Error creando perfil:', error.message);
            throw new Error(
                'La cuenta se creó, pero no se pudo guardar el perfil. Ejecuta el SQL de policies/trigger en Supabase.'
            );
        }
    }

    private async loadProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, email, role, status')
            .eq('id', userId)
            .maybeSingle();

        if (error) {
            console.error('Error cargando perfil:', error.message);
            this.profile.set(null);
            return null;
        }

        const nextProfile = (data as UserProfile | null) ?? null;
        this.profile.set(nextProfile);
        return nextProfile;
    }

    private mapAuthError(message: string): string {
        const normalized = message.toLowerCase();

        if (normalized.includes('invalid login credentials')) {
            return 'Correo o contraseña incorrectos.';
        }

        if (normalized.includes('email not confirmed')) {
            return 'Debes confirmar tu correo antes de iniciar sesión.';
        }

        if (normalized.includes('user already registered') || normalized.includes('already been registered')) {
            return 'Este correo ya está registrado. Inicia sesión.';
        }

        if (normalized.includes('password')) {
            return 'La contraseña no cumple los requisitos mínimos.';
        }

        return message || 'No se pudo completar la operación.';
    }
}
