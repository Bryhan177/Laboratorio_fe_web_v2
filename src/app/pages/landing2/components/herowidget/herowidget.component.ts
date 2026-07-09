import { Component } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'hero-widget',
    imports: [ButtonModule, RippleModule, AnimateOnScrollModule],
  templateUrl: './herowidget.component.html',
  styleUrl: './herowidget.component.scss'
})
export class HeroWidget {

}
