import { Component } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
    selector: 'app-stats-section',
    standalone: true,
    imports: [AnimateOnScrollModule],
    templateUrl: './stats-section.components.html'
})
export class StatsSectionComponent {}