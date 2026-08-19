import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../../core/auth.service';
import { ThemeLanguageControlsComponent } from '../../../shared/components/theme-language-controls/theme-language-controls.component';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [ButtonModule, PasswordModule, FormsModule, RouterModule, RippleModule, ThemeLanguageControlsComponent],
    templateUrl: './reset-password.component.html',
    styleUrl: '../login/login.component.scss'
})
export class ResetPasswordComponent implements OnInit {
    password = '';
    confirmPassword = '';
    errorMessage = '';
    successMessage = '';
    readonly loading = signal(false);
    readonly reducedMotion = signal(false);

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
            await this.authService.updatePassword(this.password);
            this.successMessage = 'Contraseña actualizada. Ya puedes iniciar sesión.';
            setTimeout(() => {
                void this.router.navigate(['/auth/login']);
            }, 1200);
        } catch (error) {
            this.errorMessage =
                error instanceof Error
                    ? error.message
                    : 'No se pudo actualizar la contraseña. Solicita un enlace nuevo.';
        } finally {
            this.loading.set(false);
        }
    }
}
