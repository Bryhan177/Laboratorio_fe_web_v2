import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ButtonModule } from 'primeng/button';

interface Card {
    src: string;
    alt: string;
    w: string;
    h: string;
    rotate: number;
    z: number;
}

interface Avatar {
    src: string;
    alt: string;
}

@Component({
    selector: 'app-hero-section',
    standalone: true,
    imports: [CommonModule, AnimateOnScrollModule, ButtonModule],
    templateUrl: './hero-section.component.html'
})
export class HeroSectionComponent implements OnInit {

    avatars: Avatar[] = [
    { src: '/avatar1.png', alt: 'Avatar 1' },
    { src: '/avatar2.png', alt: 'Avatar 2' },
  ];

  arcCards: Card[] = [
    { src: './assets/img/hero/rec-1.png', alt: 'Card 1', w: 'w-44', h: 'h-64', rotate: 15, z: 10 },
    { src: './assets/img/hero/rec-2.png', alt: 'Card 2', w: 'w-44', h: 'h-64', rotate: 10, z: 20 },
    { src: './assets/img/hero/rec-3.png', alt: 'Card 3', w: 'w-44', h: 'h-64', rotate: 5, z: 30 },
    { src: './assets/img/hero/rec-4.png', alt: 'Card 4', w: 'w-44', h: 'h-64', rotate: -5, z: 30 },
    { src: './assets/img/hero/rec-5.png', alt: 'Card 5', w: 'w-44', h: 'h-64', rotate: -10, z: 20 },
    { src: './assets/img/hero/rec-6.png', alt: 'Card 6', w: 'w-44', h: 'h-64', rotate: -15, z: 10 },
  ];

  leftArcCards: Card[] = [];
  rightArcCards: Card[] = [];

  ngOnInit() {
    this.leftArcCards = this.arcCards.slice(0, 3);
    this.rightArcCards = this.arcCards.slice(3);
  }

}