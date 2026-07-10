import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface SocialLink {
    icon: string;
    label: string;
    url: string;
}

interface Collaborator {
    name: string;
    logoUrl: string;
    website?: string;
}

interface FooterLink {
    label: string;
    target: string;
}

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './footer.component.html',
    host: { class: 'block w-full' }
})
export class FooterComponent {
    currentYear = new Date().getFullYear();

    socialLinks: SocialLink[] = [
        { icon: 'pi-facebook', label: 'Facebook', url: 'https://facebook.com' },
        { icon: 'pi-instagram', label: 'Instagram', url: 'https://instagram.com' },
        { icon: 'pi-youtube', label: 'YouTube', url: 'https://youtube.com' },
        { icon: 'pi-linkedin', label: 'LinkedIn', url: 'https://linkedin.com' }
    ];

    quickLinks: FooterLink[] = [
        { label: 'Inicio', target: 'inicio' },
        { label: 'Servicios', target: 'servicios' },
        { label: 'Equipo', target: 'equipo' },
        { label: 'Estadísticas', target: 'estadisticas' }
    ];

    collaborators: Collaborator[] = [
        {
            name: 'Colaborador 1',
            logoUrl: './assets/img/collaborators/colaborador-1.png',
            website: '#'
        },
        {
            name: 'Colaborador 2',
            logoUrl: './assets/img/collaborators/colaborador-2.png',
            website: '#'
        },
        {
            name: 'Colaborador 3',
            logoUrl: './assets/img/collaborators/colaborador-3.png',
            website: '#'
        }
    ];

    scrollTo(target: string): void {
        const element = document.getElementById(target);
        if (element) {
            const navHeight = 64;
            const offset = element.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    }

    onLogoError(name: string): void {
        this.failedLogos.add(name);
    }

    hasLogoFailed(name: string): boolean {
        return this.failedLogos.has(name);
    }

    private failedLogos = new Set<string>();
}
