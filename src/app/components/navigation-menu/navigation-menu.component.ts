import { Component, HostListener, Renderer2 } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navigation-menu',
    standalone: true,
    imports: [MenubarModule, ButtonModule, CommonModule],
    templateUrl: './navigation-menu.component.html',
    styles: [`
        :host {
            display: block;
        }
        .bg-white {
            background-color: white;
        }
        .shadow-md {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
    `]
})
export class NavigationMenuComponent {
    isScrolled = false;
    mobileMenuOpen = false;

    menuItems = [
        { label: 'Inicio', target: 'inicio' },
        { label: 'Servicios', target: 'servicios' },
        { label: 'Equipo', target: 'equipo' },
        { label: 'Estadísticas', target: 'estadisticas' },
        { label: 'Contacto', target: 'contacto' }
    ];

    constructor(private renderer: Renderer2) {}

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.isScrolled = window.scrollY > 50;
    }

    scrollTo(target: string) {
        const element = document.getElementById(target);
        if (element) {
            const navHeight = 64; // Altura del menú fijo
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    closeMobileMenu() {
        this.mobileMenuOpen = false;
    }
}