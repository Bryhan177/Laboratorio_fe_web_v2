import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, computed, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Article, ArticlesService } from '../../../../service/articles.service';

const ARTICLE_IMAGES = [
    'assets/img/courses/articulo-bienestar.png',
    'assets/img/courses/articulo-ninos.png',
    'assets/img/courses/articulo-comunidad.png',
    'assets/img/courses/curso-senderismo.png',
    'assets/img/courses/curso-danza.png',
    'assets/img/courses/curso-arte.png'
];

@Component({
    selector: 'app-articles-section',
    standalone: true,
    imports: [CommonModule, DialogModule],
    templateUrl: './articles-section.component.html'
})
export class ArticlesSectionComponent implements OnInit {
    @Output() back = new EventEmitter<void>();

    readonly loading = signal(true);
    readonly errorMessage = signal('');
    readonly articles = signal<Article[]>([]);
    readonly selectedArticle = signal<Article | null>(null);
    readonly readerVisible = signal(false);

    readonly featured = computed(() => this.articles()[0] ?? null);
    readonly moreArticles = computed(() => this.articles().slice(1));

    constructor(private articlesService: ArticlesService) {}

    async ngOnInit(): Promise<void> {
        this.loading.set(true);
        this.errorMessage.set('');

        try {
            this.articles.set(await this.articlesService.listPublished());
        } catch (error) {
            this.errorMessage.set(error instanceof Error ? error.message : 'No se pudieron cargar los artículos.');
        } finally {
            this.loading.set(false);
        }
    }

    goBack() {
        this.back.emit();
    }

    articleImage(article: Article, index = 0): string {
        if (article.image_url) {
            return article.image_url;
        }
        const position = this.articles().findIndex((item) => item.id === article.id);
        return ARTICLE_IMAGES[(position >= 0 ? position : index) % ARTICLE_IMAGES.length];
    }

    excerpt(article: Article): string {
        const text = (article.content || '').replace(/\s+/g, ' ').trim();
        if (!text) {
            return 'Artículo publicado por el Laboratorio de Metodologías Participativas.';
        }
        return text.length > 180 ? `${text.slice(0, 180)}…` : text;
    }

    formatDate(value: string | null | undefined): string {
        if (!value) {
            return 'Sin fecha';
        }
        const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }
        return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    readTime(article: Article): string {
        const words = (article.content || '').trim().split(/\s+/).filter(Boolean).length;
        const minutes = Math.max(1, Math.round(words / 180));
        return `${minutes} min de lectura`;
    }

    openArticle(article: Article): void {
        this.selectedArticle.set(article);
        this.readerVisible.set(true);
    }

    closeArticle(): void {
        this.readerVisible.set(false);
    }
}
