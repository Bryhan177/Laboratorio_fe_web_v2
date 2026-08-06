import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';

type AdminSection = 'dashboard' | 'cursos' | 'usuarios' | 'articulos' | 'eventos';

interface NavItem {
    id: AdminSection;
    label: string;
    icon: string;
}

interface AdminCourse {
    id: number;
    title: string;
    category: string;
    cupos: number;
    inscritos: number;
    status: 'activo' | 'borrador' | 'finalizado';
}

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'activo' | 'inactivo';
}

interface AdminArticle {
    id: number;
    title: string;
    author: string;
    date: string;
    status: 'publicado' | 'borrador';
}

interface AdminEvent {
    id: number;
    title: string;
    date: string;
    place: string;
    cupos: number;
    status: 'proximo' | 'completado';
}

@Component({
    selector: 'app-admin-panel',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        RippleModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        TagModule
    ],
    templateUrl: './admin-panel.component.html',
    styleUrl: './admin-panel.component.scss'
})
export default class AdminPanelComponent {
    readonly sidebarOpen = signal(false);
    readonly activeSection = signal<AdminSection>('dashboard');
    dialogVisible = false;
    readonly dialogMode = signal<'create' | 'edit'>('create');

    courseForm = { title: '', category: '', cupos: 20, status: 'activo' as AdminCourse['status'] };
    editingCourseId: number | null = null;

    readonly navItems: NavItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: 'pi-home' },
        { id: 'cursos', label: 'Cursos', icon: 'pi-book' },
        { id: 'usuarios', label: 'Usuarios', icon: 'pi-users' },
        { id: 'articulos', label: 'Artículos', icon: 'pi-file' },
        { id: 'eventos', label: 'Eventos', icon: 'pi-calendar' }
    ];

    readonly statusOptions = [
        { label: 'Activo', value: 'activo' },
        { label: 'Borrador', value: 'borrador' },
        { label: 'Finalizado', value: 'finalizado' }
    ];

    courses = signal<AdminCourse[]>([
        { id: 1, title: 'Danzas urbanas para jóvenes', category: 'Danza y música', cupos: 20, inscritos: 14, status: 'activo' },
        { id: 2, title: 'Senderismo y naturaleza', category: 'Aire libre', cupos: 25, inscritos: 18, status: 'activo' },
        { id: 3, title: 'Taller de pintura creativa', category: 'Arte y cultura', cupos: 18, inscritos: 9, status: 'borrador' },
        { id: 4, title: 'Yoga y mindfulness', category: 'Bienestar', cupos: 30, inscritos: 27, status: 'activo' },
        { id: 5, title: 'Escuela de juego infantil', category: 'Infantil', cupos: 22, inscritos: 22, status: 'finalizado' }
    ]);

    users = signal<AdminUser[]>([
        { id: 1, name: 'Cristian Córdoba', email: 'cristian.cordoba@gmail.com', role: 'Administrador', status: 'activo' },
        { id: 2, name: 'Mari Piedad', email: 'mari.piedad@gmail.com', role: 'Estudiante', status: 'activo' },
        { id: 3, name: 'Pablo Martínez', email: 'pablo.martinez@email.com', role: 'Estudiante', status: 'activo' },
        { id: 4, name: 'Natali Craig', email: 'natali.craig@email.com', role: 'Educador', status: 'activo' },
        { id: 5, name: 'Andi Lane', email: 'andi.lane@email.com', role: 'Entidad', status: 'inactivo' }
    ]);

    articles = signal<AdminArticle[]>([
        { id: 1, title: 'El bienestar a través del juego', author: 'Equipo Laboratorio', date: '2026-03-12', status: 'publicado' },
        { id: 2, title: 'Niñez y recreación comunitaria', author: 'Mari Piedad', date: '2026-04-02', status: 'publicado' },
        { id: 3, title: 'Voluntariado que transforma', author: 'Natali Craig', date: '2026-05-18', status: 'borrador' }
    ]);

    events = signal<AdminEvent[]>([
        { id: 1, title: 'Festival de juego urbano', date: '2026-09-15', place: 'Parque Central', cupos: 120, status: 'proximo' },
        { id: 2, title: 'Jornada de senderismo familiar', date: '2026-10-05', place: 'Cerro Norte', cupos: 40, status: 'proximo' },
        { id: 3, title: 'Tarde de danza comunitaria', date: '2026-06-20', place: 'Casa Cultural', cupos: 80, status: 'completado' }
    ]);

    readonly stats = computed(() => ({
        cursos: this.courses().length,
        usuarios: this.users().length,
        articulos: this.articles().length,
        eventos: this.events().length,
        inscritos: this.courses().reduce((sum, course) => sum + course.inscritos, 0),
        activos: this.courses().filter((course) => course.status === 'activo').length
    }));

    readonly sectionTitle = computed(() => {
        return this.navItems.find((item) => item.id === this.activeSection())?.label ?? 'Dashboard';
    });

    setSection(section: AdminSection): void {
        this.activeSection.set(section);
        this.sidebarOpen.set(false);
    }

    toggleSidebar(): void {
        this.sidebarOpen.update((open) => !open);
    }

    openCreateCourse(): void {
        this.dialogMode.set('create');
        this.editingCourseId = null;
        this.courseForm = { title: '', category: '', cupos: 20, status: 'activo' };
        this.dialogVisible = true;
    }

    openEditCourse(course: AdminCourse): void {
        this.dialogMode.set('edit');
        this.editingCourseId = course.id;
        this.courseForm = {
            title: course.title,
            category: course.category,
            cupos: course.cupos,
            status: course.status
        };
        this.dialogVisible = true;
    }

    saveCourse(): void {
        const title = this.courseForm.title.trim();
        const category = this.courseForm.category.trim();
        if (!title || !category) {
            return;
        }

        if (this.dialogMode() === 'create') {
            const nextId = Math.max(0, ...this.courses().map((course) => course.id)) + 1;
            this.courses.update((list) => [
                ...list,
                {
                    id: nextId,
                    title,
                    category,
                    cupos: this.courseForm.cupos,
                    inscritos: 0,
                    status: this.courseForm.status
                }
            ]);
        } else if (this.editingCourseId !== null) {
            const id = this.editingCourseId;
            this.courses.update((list) =>
                list.map((course) =>
                    course.id === id
                        ? {
                              ...course,
                              title,
                              category,
                              cupos: this.courseForm.cupos,
                              status: this.courseForm.status
                          }
                        : course
                )
            );
        }

        this.dialogVisible = false;
    }

    deleteCourse(id: number): void {
        this.courses.update((list) => list.filter((course) => course.id !== id));
    }

    courseSeverity(status: AdminCourse['status']): 'success' | 'warn' | 'secondary' {
        if (status === 'activo') return 'success';
        if (status === 'borrador') return 'warn';
        return 'secondary';
    }

    userSeverity(status: AdminUser['status']): 'success' | 'danger' {
        return status === 'activo' ? 'success' : 'danger';
    }

    articleSeverity(status: AdminArticle['status']): 'success' | 'warn' {
        return status === 'publicado' ? 'success' : 'warn';
    }

    eventSeverity(status: AdminEvent['status']): 'info' | 'secondary' {
        return status === 'proximo' ? 'info' : 'secondary';
    }
}
