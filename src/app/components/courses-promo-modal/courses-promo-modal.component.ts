import { Component, EventEmitter, HostListener, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-courses-promo-modal',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './courses-promo-modal.component.html',
    host: { class: 'block' }
})
export class CoursesPromoModalComponent {
    @Output() closed = new EventEmitter<void>();

    readonly exiting = signal(false);
    readonly reducedMotion = signal(
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    readonly courses = [
        {
            src: 'assets/img/curso1.jpg',
            alt: 'Curso activo 1'
        },
        {
            src: 'assets/img/curso2.jpg',
            alt: 'Curso activo 2'
        }
    ];

    @HostListener('document:keydown.escape')
    onEscape(): void {
        this.close();
    }

    close(): void {
        if (this.exiting()) {
            return;
        }

        this.exiting.set(true);
        const delay = this.reducedMotion() ? 0 : 250;
        setTimeout(() => this.closed.emit(), delay);
    }
}
