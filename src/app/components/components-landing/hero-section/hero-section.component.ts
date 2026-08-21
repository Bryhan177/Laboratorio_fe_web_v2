import { Component, OnDestroy, OnInit, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorContextService } from '../../../service/visitor-context.service';

@Component({
    selector: 'app-hero-section',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hero-section.component.html'
})
export class HeroSectionComponent implements OnInit, OnDestroy {
    readonly heroReady = signal(false);
    readonly reducedMotion = signal(false);
    readonly currentSlide = signal(0);

    readonly slides = [
        { src: 'assets/img/hero/optimized/hero-1.webp', alt: 'Niños en actividades recreativas' },
        { src: 'assets/img/hero/optimized/hero-2.webp', alt: 'Juego y aprendizaje en comunidad' },
        { src: 'assets/img/hero/optimized/hero-3.webp', alt: 'Equipo del laboratorio' },
        { src: 'assets/img/hero/optimized/hero-4.webp', alt: 'Eventos y encuentros' },
        { src: 'assets/img/hero/optimized/hero-5.webp', alt: 'Espacios de participación' }
    ];

    /** Solo current + siguiente en DOM para no descargar los 5 JPG a la vez. */
    private readonly hydratedSlides = signal<Set<number>>(new Set([0, 1]));

    readonly visibleSlideIndexes = computed(() => {
        const current = this.currentSlide();
        const next = (current + 1) % this.slides.length;
        const set = new Set(this.hydratedSlides());
        set.add(current);
        set.add(next);
        return Array.from(set).sort((a, b) => a - b);
    });

    private carouselTimer: ReturnType<typeof setInterval> | null = null;
    private readonly slideIntervalMs = 5000;

    constructor(public visitorContext: VisitorContextService) {
        effect(() => {
            if (this.visitorContext.welcomeDismissed()) {
                this.startHeroAnimation();
            }
        });

        effect(() => {
            const current = this.currentSlide();
            const next = (current + 1) % this.slides.length;
            this.hydratedSlides.update((prev) => {
                const nextSet = new Set(prev);
                nextSet.add(current);
                nextSet.add(next);
                return nextSet;
            });
            this.preloadImage(this.slides[next].src);
        });
    }

    ngOnInit(): void {
        this.reducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        this.preloadImage(this.slides[0].src);
        this.preloadImage(this.slides[1].src);

        if (this.visitorContext.welcomeDismissed()) {
            this.startHeroAnimation();
        }
    }

    ngOnDestroy(): void {
        this.stopCarousel();
    }

    goToSlide(index: number): void {
        this.currentSlide.set(index);
        this.restartCarousel();
    }

    nextSlide(): void {
        this.currentSlide.set((this.currentSlide() + 1) % this.slides.length);
    }

    private preloadImage(src: string): void {
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
    }

    private startHeroAnimation(): void {
        if (this.heroReady()) {
            return;
        }

        const readyDelay = this.reducedMotion() ? 0 : 150;
        setTimeout(() => {
            this.heroReady.set(true);
            this.startCarousel();
        }, readyDelay);
    }

    private startCarousel(): void {
        if (this.reducedMotion() || this.carouselTimer !== null) {
            return;
        }

        this.carouselTimer = setInterval(() => this.nextSlide(), this.slideIntervalMs);
    }

    private restartCarousel(): void {
        this.stopCarousel();
        this.startCarousel();
    }

    private stopCarousel(): void {
        if (this.carouselTimer !== null) {
            clearInterval(this.carouselTimer);
            this.carouselTimer = null;
        }
    }
}
