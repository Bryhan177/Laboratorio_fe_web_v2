import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorContextService, VisitorRole } from '../../service/visitor-context.service';

interface RoleOption {
    id: VisitorRole;
    label: string;
    icon: string;
    gradient: string;
    celebration: string;
}

@Component({
    selector: 'app-welcome-overlay',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './welcome-overlay.component.html',
    host: { class: 'block' }
})
export class WelcomeOverlayComponent implements OnInit {
    @Output() completed = new EventEmitter<void>();

    readonly phase = signal<'question' | 'celebration' | 'exit'>('question');
    readonly selectedRole = signal<VisitorRole | null>(null);
    readonly reducedMotion = signal(false);

    readonly roleOptions: RoleOption[] = [
        {
            id: 'docente',
            label: 'Soy docente',
            icon: 'pi-book',
            gradient: 'from-[#28a0ae] to-cyan-600',
            celebration: '¡Perfecto! Tenemos talleres pensados para ti.'
        },
        {
            id: 'estudiante',
            label: 'Soy estudiante',
            icon: 'pi-user',
            gradient: 'from-[#f87e06] to-orange-500',
            celebration: '¡Genial! Aquí aprender es jugar y participar.'
        },
        {
            id: 'comunidad',
            label: 'Soy de la comunidad',
            icon: 'pi-users',
            gradient: 'from-[#830479] to-purple-600',
            celebration: '¡Bienvenido! Tu voz también construye este espacio.'
        },
        {
            id: 'explorar',
            label: 'Solo explorar',
            icon: 'pi-compass',
            gradient: 'from-slate-600 to-slate-800',
            celebration: '¡Adelante! Descubre el laboratorio a tu ritmo.'
        }
    ];

    constructor(private visitorContext: VisitorContextService) {}

    ngOnInit(): void {
        this.reducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    selectRole(role: VisitorRole): void {
        if (this.phase() !== 'question') {
            return;
        }

        this.selectedRole.set(role);
        this.visitorContext.setRole(role);
        this.phase.set('celebration');

        const delay = this.reducedMotion() ? 400 : 1600;
        setTimeout(() => {
            this.phase.set('exit');
            setTimeout(() => {
                this.visitorContext.dismissWelcome();
                this.completed.emit();
            }, this.reducedMotion() ? 150 : 500);
        }, delay);
    }

    skip(): void {
        this.visitorContext.skipWelcome();
        this.phase.set('exit');
        setTimeout(() => {
            this.visitorContext.dismissWelcome();
            this.completed.emit();
        }, this.reducedMotion() ? 0 : 300);
    }

    getCelebrationMessage(): string {
        const role = this.selectedRole();
        return this.roleOptions.find((option) => option.id === role)?.celebration ?? '¡Bienvenido al laboratorio!';
    }
}
