import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../../core/auth.service';
import { NavigationService } from '../../../service/navigation.service';
import { ThemeLanguageControlsComponent } from '../../../shared/components/theme-language-controls/theme-language-controls.component';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [ButtonModule, InputTextModule, FormsModule, RouterModule, RippleModule, ThemeLanguageControlsComponent],
    templateUrl: './forgot-password.component.html',
    styleUrl: '../login/login.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
    email = '';
    errorMessage = '';
    successMessage = '';
    readonly loading = signal(false);
    readonly reducedMotion = signal(false);

    constructor(
        private authService: AuthService,
        private router: Router,
        private navigationService: NavigationService
    ) {}

    ngOnInit(): void {
        this.reducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    goHome(): void {
        this.navigationService.navigateTo('landing');
        void this.router.navigate(['/']);
    }

    async onSubmit(): Promise<void> {
        this.errorMessage = '';
        this.successMessage = '';

        const email = this.email.trim();
        if (!email) {
            this.errorMessage = 'Ingresa tu correo electrónico.';
            return;
        }

        this.loading.set(true);

        try {
            await this.authService.requestPasswordReset(email);
            this.successMessage =
                'Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja y el spam.';
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'No se pudo enviar el correo.';
        } finally {
            this.loading.set(false);
        }
    }
}
