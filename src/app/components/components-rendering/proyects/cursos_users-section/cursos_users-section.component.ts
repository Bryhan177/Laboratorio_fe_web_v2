import { Component, OnInit, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { AvatarModule } from "primeng/avatar";
import { OverlayBadgeModule } from "primeng/overlaybadge";
import { MenuModule } from "primeng/menu";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../../core/auth.service";
import { NavigationService } from "../../../../service/navigation.service";
import { Article, ArticlesService } from "../../../../service/articles.service";
import { ThemeLanguageControlsComponent } from "../../../../shared/components/theme-language-controls/theme-language-controls.component";

interface LearningLesson {
    id: number;
    shortLabel: string;
    title: string;
    duration: string;
    description: string;
    youtubeId: string;
    points: number;
}

type Tab = "cursos" | "articulos"

@Component({
    selector: 'app-cursos-users-section',
    standalone: true,
    imports: [CommonModule, AvatarModule, OverlayBadgeModule, MenuModule, ButtonModule, DialogModule, InputTextModule, PasswordModule, FormsModule, DropdownModule, InputNumberModule, ThemeLanguageControlsComponent],
    templateUrl: './cursos_users-section.component.html'
})
export class CursosUsersSectionComponent implements OnInit {

    pestaniaActiva: Tab = "cursos"
    perfilModalVisible = false;
    editPasswordModalVisible = false;
    avatarUrl = 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png';
    newPassword = '';
    confirmPassword = '';

  generoOptions = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Femenino', value: 'femenino' },
    { label: 'No aplica', value: 'no_aplica' }
  ];

    constructor(
        public authService: AuthService,
        private router: Router,
        private navigationService: NavigationService,
        private sanitizer: DomSanitizer,
        private articlesService: ArticlesService
    ) {}

    seleccionarPestania(pestania: Tab): void {
        this.pestaniaActiva = pestania;
    }

    isActiva(tab: Tab): boolean {
        return this.pestaniaActiva === tab;
    } 

    daysLeft = 5;
    private readonly videoUrls = new Map<string, SafeResourceUrl>();

    readonly lessons: LearningLesson[] = [
        {
            id: 1,
            shortLabel: 'Lab',
            title: 'Laboratorio Metodologías Participativas',
            duration: 'Video',
            description: 'Conoce el Laboratorio de Metodologías Participativas y el sentido de esta aventura.',
            youtubeId: 'b2fZbwI9oB8',
            points: 10
        },
        {
            id: 2,
            shortLabel: 'Fórmula',
            title: '¿Qué es la Fórmula? Corte L-A',
            duration: 'Video',
            description: 'Entiende qué es la Fórmula del Corte L-A y para qué sirve en el laboratorio.',
            youtubeId: '2RolgD4cVmY',
            points: 10
        },
        {
            id: 3,
            shortLabel: 'Fórmulas',
            title: 'Fórmulas Pedagógicas - Corte L-A',
            duration: 'Video',
            description: 'Revisa las fórmulas pedagógicas del Corte L-A y cómo se ponen en práctica.',
            youtubeId: 'VTIOrhGUv90',
            points: 10
        },
        {
            id: 4,
            shortLabel: 'Técnicas',
            title: 'Técnicas Pedagógicas - Corte L-A',
            duration: 'Video',
            description: 'Explora las técnicas pedagógicas del Corte L-A para acompañar el aprendizaje.',
            youtubeId: 'b3csY6zq41U',
            points: 10
        },
        {
            id: 5,
            shortLabel: 'Cierre',
            title: 'Respuestas',
            duration: 'Video',
            description: 'Cierra la ruta con las respuestas del Laboratorio de Metodologías.',
            youtubeId: 'IbZoDlZqYZM',
            points: 10
        }
    ];

    readonly completedIds = signal<number[]>([]);
    readonly selectedLessonId = signal(1);
    readonly publishedArticles = signal<Article[]>([]);
    readonly selectedPublishedArticle = signal<Article | null>(null);
    readonly articleReaderVisible = signal(false);

    readonly displayName = computed(() => this.authService.displayName());
    readonly firstName = computed(() => this.authService.firstName());
    readonly lastName = computed(() => this.authService.lastName());
    readonly userInitials = computed(() => this.authService.initials());
    readonly userEmail = computed(() => this.authService.currentProfile()?.email || '');
    readonly currentPageTitle = computed(() => `¡Bienvenido, ${this.firstName()}!`);
    readonly selectedLesson = computed(() => this.lessons.find((lesson) => lesson.id === this.selectedLessonId()) ?? this.lessons[0]);
    readonly completedCount = computed(() => this.completedIds().length);
    readonly progressPercent = computed(() => Math.round((this.completedCount() / this.lessons.length) * 100));
    readonly currentPoints = computed(() =>
        this.completedIds().reduce((sum, id) => sum + (this.lessons.find((lesson) => lesson.id === id)?.points ?? 0), 0)
    );
    readonly nextLesson = computed(() => this.lessons.find((lesson) => !this.completedIds().includes(lesson.id))?.title ?? 'Ruta completada');
    readonly userRank = computed(() => this.rankedPlayers().find((player) => player.isUser)?.rank ?? this.lessons.length + 1);

    leaderboard = [
        { rank: 1, initials: 'PM', name: 'Pablo Martínez', points: 50, isUser: true },
        { rank: 2, initials: 'NC', name: 'Natali Craig', points: 40, isUser: false },
        { rank: 3, initials: 'DC', name: 'Drew Cano', points: 30, isUser: false },
        { rank: 4, initials: 'OG', name: 'Orlando G.', points: 20, isUser: false },
        { rank: 5, initials: 'AL', name: 'Andi Lane', points: 10, isUser: false },
    ];

    readonly rankedPlayers = computed(() =>
        this.leaderboard
            .map((player) =>
                player.isUser
                    ? { ...player, name: this.displayName(), initials: this.userInitials(), points: this.currentPoints() }
                    : player
            )
            .sort((a, b) => b.points - a.points)
            .map((player, index) => ({ ...player, rank: index + 1 }))
    );

  parentBreadcrumb = 'Dashboards';
  parentLink = '/dashboards';

  lessonVideoUrl(youtubeId: string): SafeResourceUrl {
    let url = this.videoUrls.get(youtubeId);
    if (!url) {
      url = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`);
      this.videoUrls.set(youtubeId, url);
    }
    return url;
  }

  isCompleted(id: number): boolean {
    return this.completedIds().includes(id);
  }

  isUnlocked(id: number): boolean {
    return id === 1 || this.isCompleted(id - 1);
  }

  isCurrent(id: number): boolean {
    return this.selectedLessonId() === id;
  }

  openLesson(id: number): void {
    if (!this.isUnlocked(id)) {
      return;
    }
    this.selectedLessonId.set(id);
  }

  markCurrentCompleted(): void {
    const id = this.selectedLessonId();
    if (this.isCompleted(id)) {
      this.openNextLesson();
      return;
    }

    this.completedIds.update((ids) => [...ids, id]);
    this.saveProgress();
    this.openNextLesson();
  }

  private openNextLesson(): void {
    const next = this.lessons.find((lesson) => !this.completedIds().includes(lesson.id));
    if (next) {
      this.selectedLessonId.set(next.id);
    }
  }

  private storageKey(): string {
    const userId = this.authService.currentProfile()?.id ?? 'anon';
    return `laboratorio-learning-path-${userId}`;
  }

  private loadProgress(): void {
    try {
      const raw = localStorage.getItem(this.storageKey());
      const parsed = raw ? (JSON.parse(raw) as number[]) : [];
      const validIds = parsed.filter((id) => this.lessons.some((lesson) => lesson.id === id));
      this.completedIds.set(validIds);
      const next = this.lessons.find((lesson) => !validIds.includes(lesson.id));
      this.selectedLessonId.set(next?.id ?? this.lessons[this.lessons.length - 1].id);
    } catch {
      this.completedIds.set([]);
    }
  }

  private saveProgress(): void {
    localStorage.setItem(this.storageKey(), JSON.stringify(this.completedIds()));
  }

  private async loadPublishedArticles(): Promise<void> {
    try {
      this.publishedArticles.set(await this.articlesService.listPublished());
    } catch {
      this.publishedArticles.set([]);
    }
  }

  articleExcerpt(article: Article): string {
    const text = (article.content || '').replace(/\s+/g, ' ').trim();
    if (!text) {
      return 'Artículo publicado por el laboratorio.';
    }
    return text.length > 160 ? `${text.slice(0, 160)}…` : text;
  }

  formatArticleDate(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  openPublishedArticle(article: Article): void {
    this.selectedPublishedArticle.set(article);
    this.articleReaderVisible.set(true);
  }

  openSettings(): void {
    console.log('Abrir ajustes');
  }

  openNotifications(): void {
    console.log('Abrir notificaciones');
  }

  abrirPerfilModal(): void {
    this.perfilModalVisible = true;
  }

  cerrarPerfilModal(): void {
    this.perfilModalVisible = false;
  }
  
  abrirEditPasswordModal(): void {
    this.editPasswordModalVisible = true;
  }
  
  cerrarEditPasswordModal(): void {
    this.editPasswordModalVisible = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.avatarUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.navigationService.navigateTo('landing');
    await this.router.navigate(['/auth/login']);
  }

  items: MenuItem[] | undefined;
    async ngOnInit() {
        await this.authService.ensureProfile();
        this.loadProgress();
        await this.loadPublishedArticles();
        this.items = [
            {   
                label: 'Mi cuenta',
                items: [{ label: 'Perfil', icon: 'pi pi-user', command: () => this.abrirPerfilModal() }, 
                { label: 'contraseña', icon: 'pi pi-key', command: () => this.abrirEditPasswordModal() }
                ]
            },
            { separator: true },
            {
              items: [{ label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() }]
            }
        ];
    }
}
