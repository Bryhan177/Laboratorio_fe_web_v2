import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { AuthService, UserRole } from '../../core/auth.service';
import { Article, ArticleStatus, ArticlesService } from '../../service/articles.service';
import { Course, CourseStatus, CoursesService } from '../../service/courses.service';
import { AppEvent, EventStatus, EventsService } from '../../service/events.service';
import { AdminProfile, ProfilesService } from '../../service/profiles.service';
import { ThemeLanguageControlsComponent } from '../../shared/components/theme-language-controls/theme-language-controls.component';
import { MediaService } from '../../service/media.service';

type AdminSection = 'dashboard' | 'cursos' | 'usuarios' | 'articulos' | 'eventos';
type DialogKind = 'course' | 'article' | 'event' | 'user' | null;

interface NavItem {
    id: AdminSection;
    label: string;
    icon: string;
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
        PasswordModule,
        TextareaModule,
        SelectModule,
        TagModule,
        ThemeLanguageControlsComponent
    ],
    templateUrl: './admin-panel.component.html',
    styleUrl: './admin-panel.component.scss'
})
export default class AdminPanelComponent implements OnInit {
    readonly sidebarOpen = signal(false);
    readonly activeSection = signal<AdminSection>('dashboard');
    readonly loading = signal(false);
    readonly saving = signal(false);
    errorMessage = '';

    dialogVisible = false;
    readonly dialogKind = signal<DialogKind>(null);
    readonly dialogMode = signal<'create' | 'edit'>('create');

    editingCourseId: string | null = null;
    editingArticleId: string | null = null;
    editingEventId: string | null = null;
    editingUserId: string | null = null;

    courseForm = { title: '', category: '', cupos: 20, status: 'activo' as CourseStatus, image_url: null as string | null };
    articleForm = { title: '', content: '', status: 'borrador' as ArticleStatus, image_url: null as string | null };
    courseImageFile: File | null = null;
    courseImagePreview = '';
    articleImageFile: File | null = null;
    articleImagePreview = '';
    eventImageFile: File | null = null;
    eventImagePreview = '';
    eventForm = {
        title: '',
        event_date: '',
        place: '',
        cupos: 50,
        status: 'proximo' as EventStatus,
        image_url: null as string | null
    };
    userForm = {
        full_name: '',
        email: '',
        role: 'estudiante' as UserRole,
        status: 'activo' as AdminProfile['status'],
        password: '',
        confirmPassword: ''
    };

    readonly adminName = computed(() => this.authService.displayName());
    readonly adminFirstName = computed(() => this.authService.firstName());
    readonly adminInitials = computed(() => this.authService.initials());

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

    readonly articleStatusOptions = [
        { label: 'Publicado', value: 'publicado' },
        { label: 'Borrador', value: 'borrador' }
    ];

    readonly eventStatusOptions = [
        { label: 'Próximo', value: 'proximo' },
        { label: 'Completado', value: 'completado' }
    ];

    readonly roleOptions: { label: string; value: UserRole }[] = [
        { label: 'Administrador', value: 'administrador' },
        { label: 'Educador', value: 'educador' },
        { label: 'Estudiante', value: 'estudiante' },
        { label: 'Entidad', value: 'entidad' }
    ];

    readonly userStatusOptions: { label: string; value: AdminProfile['status'] }[] = [
        { label: 'Activo', value: 'activo' },
        { label: 'Inactivo', value: 'inactivo' }
    ];

    courses = signal<Course[]>([]);
    users = signal<AdminProfile[]>([]);
    articles = signal<Article[]>([]);
    events = signal<AppEvent[]>([]);

    readonly stats = computed(() => ({
        cursos: this.courses().length,
        usuarios: this.users().length,
        articulos: this.articles().length,
        eventos: this.events().length,
        inscritos: this.courses().reduce((sum, course) => sum + (course.inscritos ?? 0), 0),
        activos: this.courses().filter((course) => course.status === 'activo').length
    }));

    readonly sectionTitle = computed(() => {
        return this.navItems.find((item) => item.id === this.activeSection())?.label ?? 'Dashboard';
    });

    readonly dialogTitle = computed(() => {
        const mode = this.dialogMode() === 'create' ? 'Nuevo' : 'Editar';
        switch (this.dialogKind()) {
            case 'course':
                return `${mode} curso`;
            case 'article':
                return `${mode} artículo`;
            case 'event':
                return `${mode} evento`;
            case 'user':
                return 'Editar usuario';
            default:
                return '';
        }
    });

    constructor(
        private authService: AuthService,
        private router: Router,
        private coursesService: CoursesService,
        private profilesService: ProfilesService,
        private articlesService: ArticlesService,
        private eventsService: EventsService,
        private mediaService: MediaService
    ) {}

    ngOnInit(): void {
        void this.authService.ensureProfile();
        void this.loadAll();
    }

    async loadAll(): Promise<void> {
        this.loading.set(true);
        this.errorMessage = '';

        try {
            const [courses, users, articles, events] = await Promise.all([
                this.coursesService.list(),
                this.profilesService.list(),
                this.articlesService.list(),
                this.eventsService.list()
            ]);

            this.courses.set(courses);
            this.users.set(users);
            this.articles.set(articles);
            this.events.set(events);
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'No se pudieron cargar los datos.';
        } finally {
            this.loading.set(false);
        }
    }

    async logout(): Promise<void> {
        await this.authService.logout();
        await this.router.navigate(['/auth/login']);
    }

    setSection(section: AdminSection): void {
        this.activeSection.set(section);
        this.sidebarOpen.set(false);
    }

    toggleSidebar(): void {
        this.sidebarOpen.update((open) => !open);
    }

    openCreateCourse(): void {
        this.dialogKind.set('course');
        this.dialogMode.set('create');
        this.editingCourseId = null;
        this.courseForm = { title: '', category: '', cupos: 20, status: 'activo', image_url: null };
        this.courseImageFile = null;
        this.courseImagePreview = '';
        this.dialogVisible = true;
    }

    openEditCourse(course: Course): void {
        this.dialogKind.set('course');
        this.dialogMode.set('edit');
        this.editingCourseId = course.id;
        this.courseForm = {
            title: course.title,
            category: course.category,
            cupos: course.cupos,
            status: course.status,
            image_url: course.image_url
        };
        this.courseImageFile = null;
        this.courseImagePreview = course.image_url || '';
        this.dialogVisible = true;
    }

    openCreateArticle(): void {
        this.dialogKind.set('article');
        this.dialogMode.set('create');
        this.editingArticleId = null;
        this.articleForm = { title: '', content: '', status: 'borrador', image_url: null };
        this.articleImageFile = null;
        this.articleImagePreview = '';
        this.dialogVisible = true;
    }

    openEditArticle(article: Article): void {
        this.dialogKind.set('article');
        this.dialogMode.set('edit');
        this.editingArticleId = article.id;
        this.articleForm = {
            title: article.title,
            content: article.content || '',
            status: article.status,
            image_url: article.image_url
        };
        this.articleImageFile = null;
        this.articleImagePreview = article.image_url || '';
        this.dialogVisible = true;
    }

    openCreateEvent(): void {
        this.dialogKind.set('event');
        this.dialogMode.set('create');
        this.editingEventId = null;
        this.eventForm = {
            title: '',
            event_date: new Date().toISOString().slice(0, 10),
            place: '',
            cupos: 50,
            status: 'proximo',
            image_url: null
        };
        this.eventImageFile = null;
        this.eventImagePreview = '';
        this.dialogVisible = true;
    }

    openEditEvent(event: AppEvent): void {
        this.dialogKind.set('event');
        this.dialogMode.set('edit');
        this.editingEventId = event.id;
        this.eventForm = {
            title: event.title,
            event_date: event.event_date,
            place: event.place,
            cupos: event.cupos,
            status: event.status,
            image_url: event.image_url
        };
        this.eventImageFile = null;
        this.eventImagePreview = event.image_url || '';
        this.dialogVisible = true;
    }

    openEditUser(user: AdminProfile): void {
        this.dialogKind.set('user');
        this.dialogMode.set('edit');
        this.editingUserId = user.id;
        this.userForm = {
            full_name: user.full_name || '',
            email: user.email || '',
            role: user.role,
            status: user.status,
            password: '',
            confirmPassword: ''
        };
        this.dialogVisible = true;
    }

    async saveDialog(): Promise<void> {
        const kind = this.dialogKind();
        if (!kind) return;

        this.saving.set(true);
        this.errorMessage = '';

        try {
            if (kind === 'course') {
                await this.saveCourse();
            } else if (kind === 'article') {
                await this.saveArticle();
            } else if (kind === 'event') {
                await this.saveEvent();
            } else if (kind === 'user') {
                await this.saveUser();
            }
            this.dialogVisible = false;
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'No se pudo guardar.';
        } finally {
            this.saving.set(false);
        }
    }

    private async saveCourse(): Promise<void> {
        const title = this.courseForm.title.trim();
        const category = this.courseForm.category.trim();
        if (!title || !category) {
            throw new Error('Completa título y categoría del curso.');
        }

        const payload = {
            title,
            category,
            cupos: Number(this.courseForm.cupos) || 1,
            status: this.courseForm.status,
            image_url: this.courseImageFile
                ? await this.mediaService.upload('courses', this.courseImageFile)
                : this.courseForm.image_url
        };

        if (this.dialogMode() === 'create') {
            await this.coursesService.create(payload);
        } else if (this.editingCourseId) {
            await this.coursesService.update(this.editingCourseId, payload);
        }

        this.courses.set(await this.coursesService.list());
    }

    private async saveArticle(): Promise<void> {
        const title = this.articleForm.title.trim();
        if (!title) {
            throw new Error('El título del artículo es obligatorio.');
        }

        const payload = {
            title,
            content: this.articleForm.content.trim() || null,
            status: this.articleForm.status,
            author_id: this.authService.currentProfile()?.id ?? null,
            image_url: this.articleImageFile
                ? await this.mediaService.upload('articles', this.articleImageFile)
                : this.articleForm.image_url
        };

        if (this.dialogMode() === 'create') {
            await this.articlesService.create(payload);
        } else if (this.editingArticleId) {
            await this.articlesService.update(this.editingArticleId, payload);
        }

        this.articles.set(await this.articlesService.list());
    }

    private async saveEvent(): Promise<void> {
        const title = this.eventForm.title.trim();
        const place = this.eventForm.place.trim();
        if (!title || !place || !this.eventForm.event_date) {
            throw new Error('Completa título, fecha y lugar del evento.');
        }

        const payload = {
            title,
            place,
            event_date: this.eventForm.event_date,
            cupos: Number(this.eventForm.cupos) || 1,
            status: this.eventForm.status,
            image_url: this.eventImageFile
                ? await this.mediaService.upload('events', this.eventImageFile)
                : this.eventForm.image_url
        };

        if (this.dialogMode() === 'create') {
            await this.eventsService.create(payload);
        } else if (this.editingEventId) {
            await this.eventsService.update(this.editingEventId, payload);
        }

        this.events.set(await this.eventsService.list());
    }

    private async saveUser(): Promise<void> {
        if (!this.editingUserId) {
            throw new Error('No se encontró el usuario a editar.');
        }

        const fullName = this.userForm.full_name.trim();
        const email = this.userForm.email.trim().toLowerCase();

        if (!fullName) {
            throw new Error('El nombre del usuario es obligatorio.');
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Ingresa un correo electrónico válido.');
        }

        const password = this.userForm.password.trim();
        const confirmPassword = this.userForm.confirmPassword.trim();

        if (password || confirmPassword) {
            if (password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres.');
            }
            if (password !== confirmPassword) {
                throw new Error('Las contraseñas no coinciden.');
            }
        }

        const updated = await this.profilesService.update(this.editingUserId, {
            full_name: fullName,
            email,
            role: this.userForm.role,
            status: this.userForm.status,
            password: password || undefined
        });

        this.users.update((list) => list.map((item) => (item.id === updated.id ? updated : item)));
    }

    async deleteCourse(id: string): Promise<void> {
        if (!confirm('¿Eliminar este curso?')) return;
        try {
            await this.coursesService.remove(id);
            this.courses.set(await this.coursesService.list());
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'No se pudo eliminar el curso.';
        }
    }

    async deleteArticle(id: string): Promise<void> {
        if (!confirm('¿Eliminar este artículo?')) return;
        try {
            await this.articlesService.remove(id);
            this.articles.set(await this.articlesService.list());
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'No se pudo eliminar el artículo.';
        }
    }

    async deleteEvent(id: string): Promise<void> {
        if (!confirm('¿Eliminar este evento?')) return;
        try {
            await this.eventsService.remove(id);
            this.events.set(await this.eventsService.list());
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'No se pudo eliminar el evento.';
        }
    }

    async onUserRoleChange(user: AdminProfile, role: UserRole): Promise<void> {
        if (user.role === role) {
            return;
        }

        try {
            await this.profilesService.updateRole(user.id, role);
            this.users.update((list) => list.map((item) => (item.id === user.id ? { ...item, role } : item)));
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'No se pudo actualizar el rol.';
            this.users.set(await this.profilesService.list());
        }
    }

    onCourseImageSelected(event: Event): void {
        this.courseImageFile = this.readSelectedImage(event, (preview) => {
            this.courseImagePreview = preview;
        });
    }

    onArticleImageSelected(event: Event): void {
        this.articleImageFile = this.readSelectedImage(event, (preview) => {
            this.articleImagePreview = preview;
        });
    }

    onEventImageSelected(event: Event): void {
        this.eventImageFile = this.readSelectedImage(event, (preview) => {
            this.eventImagePreview = preview;
        });
    }

    clearCourseImage(): void {
        this.courseImageFile = null;
        this.courseImagePreview = '';
        this.courseForm.image_url = null;
    }

    clearArticleImage(): void {
        this.articleImageFile = null;
        this.articleImagePreview = '';
        this.articleForm.image_url = null;
    }

    clearEventImage(): void {
        this.eventImageFile = null;
        this.eventImagePreview = '';
        this.eventForm.image_url = null;
    }

    private readSelectedImage(event: Event, setPreview: (preview: string) => void): File | null {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;
        if (!file) {
            return null;
        }

        try {
            this.mediaService.validateImage(file);
            setPreview(URL.createObjectURL(file));
            this.errorMessage = '';
            return file;
        } catch (error) {
            input.value = '';
            this.errorMessage = error instanceof Error ? error.message : 'No se pudo leer la imagen.';
            return null;
        }
    }

    courseSeverity(status: CourseStatus): 'success' | 'warn' | 'secondary' {
        if (status === 'activo') return 'success';
        if (status === 'borrador') return 'warn';
        return 'secondary';
    }

    userSeverity(status: AdminProfile['status']): 'success' | 'danger' {
        return status === 'activo' ? 'success' : 'danger';
    }

    articleSeverity(status: ArticleStatus): 'success' | 'warn' {
        return status === 'publicado' ? 'success' : 'warn';
    }

    eventSeverity(status: EventStatus): 'info' | 'secondary' {
        return status === 'proximo' ? 'info' : 'secondary';
    }
}
