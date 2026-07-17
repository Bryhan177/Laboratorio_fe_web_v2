import { Component } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
    selector: 'app-galery-section',
    standalone: true,
    imports: [AnimateOnScrollModule],
    templateUrl: './stats-section.components.html'
})
export class GalerySectionComponent {}