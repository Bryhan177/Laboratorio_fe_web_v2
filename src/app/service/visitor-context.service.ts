import { Injectable, signal } from '@angular/core';

export type VisitorRole = 'docente' | 'estudiante' | 'comunidad' | 'explorar';

const ROLE_KEY = 'lab_visitor_role';
const WELCOME_KEY = 'lab_welcome_seen';

const PERSONALIZED_MESSAGES: Record<VisitorRole, string> = {
    docente: 'Descubre metodologías participativas para transformar tu aula.',
    estudiante: 'Aprende jugando, creando y participando activamente.',
    comunidad: 'Conecta con experiencias que unen personas y territorios.',
    explorar: 'Bienvenido. Explora todo lo que el laboratorio tiene para ofrecer.'
};

@Injectable({ providedIn: 'root' })
export class VisitorContextService {
    readonly role = signal<VisitorRole | null>(null);
    readonly welcomeDismissed = signal(false);

    constructor() {
        this.loadRole();
        if (this.hasSeenWelcome()) {
            this.welcomeDismissed.set(true);
        }
    }

    hasSeenWelcome(): boolean {
        return sessionStorage.getItem(WELCOME_KEY) === 'true';
    }

    getPersonalizedMessage(): string {
        const role = this.role() ?? 'explorar';
        return PERSONALIZED_MESSAGES[role];
    }

    setRole(role: VisitorRole): void {
        sessionStorage.setItem(ROLE_KEY, role);
        sessionStorage.setItem(WELCOME_KEY, 'true');
        this.role.set(role);
    }

    skipWelcome(): void {
        sessionStorage.setItem(WELCOME_KEY, 'true');
        if (!this.role()) {
            this.role.set('explorar');
        }
        this.welcomeDismissed.set(true);
    }

    dismissWelcome(): void {
        this.welcomeDismissed.set(true);
    }

    private loadRole(): void {
        const stored = sessionStorage.getItem(ROLE_KEY) as VisitorRole | null;
        if (stored) {
            this.role.set(stored);
        }
    }
}
