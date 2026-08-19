import { Component, EventEmitter, HostListener, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, CoursesService } from '../../service/courses.service';
import { NavigationService } from '../../service/navigation.service';

@Component({
    selector: 'app-courses-promo-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './courses-promo-modal.component.html',
    host: { class: 'block' }
})
export class CoursesPromoModalComponent implements OnInit {
    @Output() closed = new EventEmitter<void>();

    readonly exiting = signal(false);
    readonly reducedMotion = signal(
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    readonly courses = signal<Array<{ src: string; alt: string; title: string }>>([]);

    constructor(
        private coursesService: CoursesService,
        private navigationService: NavigationService
    ) {}

    async ngOnInit(): Promise<void> {
        try {
            const active = (await this.coursesService.listPublic()).slice(0, 2);
            if (active.length) {
                this.courses.set(
                    active.map((course: Course) => ({
                        src: course.image_url || 'assets/img/courses/curso-danza.png',
                        alt: course.title,
                        title: course.title
                    }))
                );
                return;
            }
        } catch {
            // Keep visual fallback if the catalog is empty or unavailable.
        }

        this.courses.set([
            { src: 'assets/img/curso1.jpg', alt: 'Curso activo 1', title: 'Cursos activos' },
            { src: 'assets/img/curso2.jpg', alt: 'Curso activo 2', title: 'Inscripciones abiertas' }
        ]);
    }

    goToCourses(): void {
        this.navigationService.navigateTo('courses');
        this.close();
    }

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
