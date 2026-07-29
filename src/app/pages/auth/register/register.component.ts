import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';

export interface AuthRoleOption {
    label: string;
    value: string;
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        SelectModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
    name = '';
    email = '';
    password = '';
    confirmPassword = '';
    role: string | null = null;
    readonly reducedMotion = signal(false);

    readonly roles: AuthRoleOption[] = [
        { label: 'Administrador', value: 'administrador' },
        { label: 'Educador', value: 'educador' },
        { label: 'Estudiante', value: 'estudiante' },
        { label: 'Entidad', value: 'entidad' },
        { label: 'Otro', value: 'otro' }
    ];

    ngOnInit(): void {
        this.reducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    onSubmit(): void {
        // UI only — API connection later
    }
}
