import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Course, CoursesService } from '../../../../service/courses.service';
import { NavigationService } from '../../../../service/navigation.service';
import { AuthService } from '../../../../core/auth.service';

@Component({
    selector: 'app-courses-section',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    templateUrl: './courses-section.component.html'
})
export class CoursesSectionComponent implements OnInit {
    @Output() back = new EventEmitter<void>();

    readonly loading = signal(true);
    readonly errorMessage = signal('');
    readonly courses = signal<Course[]>([]);
    readonly selectedCategory = signal<string | null>(null);

    readonly fallbackImage = 'assets/img/courses/curso-danza.png';

    readonly categories = computed(() => {
        const unique = new Set(this.courses().map((course) => course.category).filter(Boolean));
        return [...unique];
    });

    readonly visibleCourses = computed(() => {
        const category = this.selectedCategory();
        if (!category) {
            return this.courses();
        }
        return this.courses().filter((course) => course.category === category);
    });

    constructor(
        private coursesService: CoursesService,
        private navigationService: NavigationService,
        private authService: AuthService,
        private router: Router
    ) {}

    async ngOnInit(): Promise<void> {
        this.loading.set(true);
        this.errorMessage.set('');

        try {
            this.courses.set(await this.coursesService.listPublic());
        } catch (error) {
            this.errorMessage.set(error instanceof Error ? error.message : 'No se pudieron cargar los cursos.');
        } finally {
            this.loading.set(false);
        }
    }

    goBack() {
        this.back.emit();
    }

    selectCategory(category: string | null): void {
        this.selectedCategory.set(category);
    }

    courseImage(course: Course): string {
        return course.image_url || this.fallbackImage;
    }

    async enroll(): Promise<void> {
        if (this.authService.isAuthenticated()) {
            if (this.authService.isAdmin()) {
                await this.router.navigate(['/admin']);
                return;
            }
            this.navigationService.navigateTo('cursos-users');
            return;
        }

        await this.router.navigate(['/auth/login']);
    }
}
