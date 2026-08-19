import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { AuthService, UserRole } from '../../../core/auth.service';
import { ThemeLanguageControlsComponent } from '../../../shared/components/theme-language-controls/theme-language-controls.component';

export interface AuthRoleOption {
    label: string;
    value: UserRole;
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
        SelectModule,
        ThemeLanguageControlsComponent
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
    name = '';
    email = '';
    password = '';
    confirmPassword = '';
    role: UserRole | null = null;
    errorMessage = '';
    successMessage = '';
    readonly loading = signal(false);
    readonly reducedMotion = signal(false);

    readonly roles: AuthRoleOption[] = [
        { label: 'Educador', value: 'educador' },
        { label: 'Estudiante', value: 'estudiante' },
        { label: 'Entidad', value: 'entidad' }
    ];

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.reducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    async onSubmit(): Promise<void> {
        this.errorMessage = '';
        this.successMessage = '';

        const fullName = this.name.trim();
        const email = this.email.trim();

        if (!fullName || !email || !this.role || !this.password) {
            this.errorMessage = 'Completa todos los campos.';
            return;
        }

        if (this.password.length < 6) {
            this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'Las contraseñas no coinciden.';
            return;
        }

        this.loading.set(true);

        try {
            const result = await this.authService.register({
                fullName,
                email,
                password: this.password,
                role: this.role
            });

            if (result.needsEmailConfirmation) {
                this.successMessage =
                    'Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.';
            } else {
                this.successMessage = 'Cuenta creada correctamente. Ya puedes iniciar sesión.';
            }

            setTimeout(() => {
                void this.router.navigate(['/auth/login'], {
                    queryParams: { registered: '1' }
                });
            }, 1200);
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'No se pudo registrar.';
        } finally {
            this.loading.set(false);
        }
    }
}
