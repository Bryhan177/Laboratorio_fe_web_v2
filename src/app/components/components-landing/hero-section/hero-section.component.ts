import { Component, OnDestroy, OnInit, signal, effect } from '@angular/core';
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
        { src: 'assets/img/gallery/13%20noviembre%202025/img30.JPG', alt: 'Niños en actividades recreativas' },
        { src: 'assets/img/hero/herochild.jpg', alt: 'Juego y aprendizaje en comunidad' },
        { src: 'assets/img/img6.jpg', alt: 'Equipo del laboratorio' },
        { src: 'assets/img/gallery/18%20julio%202026/img23.jpg', alt: 'Eventos y encuentros' },
        { src: 'assets/img/gallery/23%20julio%202026/img24.jpg', alt: 'Espacios de participación' }
    ];

    private carouselTimer: ReturnType<typeof setInterval> | null = null;
    private readonly slideIntervalMs = 5000;

    constructor(public visitorContext: VisitorContextService) {
        effect(() => {
            if (this.visitorContext.welcomeDismissed()) {
                this.startHeroAnimation();
            }
        });
    }

    ngOnInit(): void {
        this.reducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

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
