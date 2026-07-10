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
            name: 'Retazos',
            logoUrl: './assets/img/collaborators/retazos.jpeg',
            website: '#'
        },
        {
            name: 'Laboratorio',
            logoUrl: './assets/img/logo.jpg',
            website: '#'
        },
        {
            name: 'Department of Methodology',
            logoUrl: './assets/img/collaborators/lse.jpeg',
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
