import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../../core/auth.service';
import { NavigationService } from '../../../service/navigation.service';
import { ThemeLanguageControlsComponent } from '../../../shared/components/theme-language-controls/theme-language-controls.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        ThemeLanguageControlsComponent
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    email = '';
    password = '';
    errorMessage = '';
    successMessage = '';
    readonly loading = signal(false);
    readonly reducedMotion = signal(false);

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private navigationService: NavigationService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.reducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

        if (this.route.snapshot.queryParamMap.get('registered') === '1') {
            this.successMessage = 'Cuenta creada. Inicia sesión con tu correo y contraseña.';
        }
    }

    goHome(): void {
        this.navigationService.navigateTo('landing');
        void this.router.navigate(['/']);
    }

    async onSubmit(): Promise<void> {
        this.errorMessage = '';
        this.successMessage = '';
        this.loading.set(true);

        try {
            const profile = await this.authService.login(this.email, this.password);

            if (profile.role === 'administrador') {
                await this.router.navigate(['/admin']);
                return;
            }

            this.navigationService.navigateTo('cursos-users');
            await this.router.navigate(['/']);
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'No se pudo iniciar sesión.';
        } finally {
            this.loading.set(false);
        }
    }
}
