import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
    selector: 'app-calendar-section',
    standalone: true,
    imports: [AvatarModule, AnimateOnScrollModule],
    templateUrl: './calendar.component.html'
})
export class CalendarSectionComponent {}