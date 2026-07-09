import { Component } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
    selector: 'app-services-section',
    standalone: true,
    imports: [AnimateOnScrollModule],
    templateUrl: './services-section.component.html'
})
export class ServicesSectionComponent {}