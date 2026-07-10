import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ButtonModule } from 'primeng/button';
import { VisitorContextService } from '../../service/visitor-context.service';

interface Card {
    src: string;
    alt: string;
    w: string;
    h: string;
    rotate: number;
    z: number;
}

@Component({
    selector: 'app-hero-section',
    standalone: true,
    imports: [CommonModule, AnimateOnScrollModule, ButtonModule],
    templateUrl: './hero-section.component.html'
})
export class HeroSectionComponent implements OnInit {
    readonly heroReady = signal(false);
    readonly badgeFastSpin = signal(true);
    readonly reducedMotion = signal(false);

    arcCards: Card[] = [
        { src: './assets/img/hero/rec-1.png', alt: 'Card 1', w: 'w-44', h: 'h-64', rotate: 15, z: 10 },
        { src: './assets/img/hero/rec-2.png', alt: 'Card 2', w: 'w-44', h: 'h-64', rotate: 10, z: 20 },
        { src: './assets/img/hero/rec-3.png', alt: 'Card 3', w: 'w-44', h: 'h-64', rotate: 5, z: 30 },
        { src: './assets/img/hero/rec-4.png', alt: 'Card 4', w: 'w-44', h: 'h-64', rotate: -5, z: 30 },
        { src: './assets/img/hero/rec-5.png', alt: 'Card 5', w: 'w-44', h: 'h-64', rotate: -10, z: 20 },
        { src: './assets/img/hero/rec-6.png', alt: 'Card 6', w: 'w-44', h: 'h-64', rotate: -15, z: 10 }
    ];

    leftArcCards: Card[] = [];
    rightArcCards: Card[] = [];

    constructor(public visitorContext: VisitorContextService) {
        effect(() => {
            if (this.visitorContext.welcomeDismissed()) {
                this.startHeroAnimation();
            }
        });
    }

    ngOnInit(): void {
        this.leftArcCards = this.arcCards.slice(0, 3);
        this.rightArcCards = this.arcCards.slice(3);
        this.reducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

        if (this.visitorContext.welcomeDismissed()) {
            this.startHeroAnimation();
        }
    }

    private startHeroAnimation(): void {
        if (this.heroReady()) {
            return;
        }

        const readyDelay = this.reducedMotion() ? 0 : 150;
        setTimeout(() => this.heroReady.set(true), readyDelay);

        if (!this.reducedMotion()) {
            setTimeout(() => this.badgeFastSpin.set(false), 2200);
        }
    }

    scrollTo(target: string): void {
        const element = document.getElementById(target);
        if (element) {
            const navHeight = 64;
            const offset = element.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    }

    cardDelay(index: number): string {
        return `${0.3 + index * 0.1}s`;
    }
}
