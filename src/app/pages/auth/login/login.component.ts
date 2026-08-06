import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { NavigationService } from '../../../service/navigation.service';

type HardcodedRole = 'admin' | 'user';

interface HardcodedUser {
    email: string;
    password: string;
    role: HardcodedRole;
}

const HARDCODED_USERS: HardcodedUser[] = [
    {
        email: 'cristian.cordoba@gmail.com',
        password: '123456789',
        role: 'admin'
    },
    {
        email: 'mari.piedad@gmail.com',
        password: '123456789',
        role: 'user'
    }
];

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    email = '';
    password = '';
    rememberMe = false;
    errorMessage = '';
    readonly reducedMotion = signal(false);

    constructor(
        private router: Router,
        private navigationService: NavigationService
    ) {}

    ngOnInit(): void {
        this.reducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    onSubmit(): void {
        this.errorMessage = '';

        const email = this.email.trim().toLowerCase();
        const password = this.password;
        const user = HARDCODED_USERS.find(
            (entry) => entry.email === email && entry.password === password
        );

        if (!user) {
            this.errorMessage = 'Correo o contraseña incorrectos.';
            return;
        }

        if (user.role === 'admin') {
            void this.router.navigate(['/admin']);
            return;
        }

        this.navigationService.navigateTo('cursos-users');
        void this.router.navigate(['/']);
    }
}
