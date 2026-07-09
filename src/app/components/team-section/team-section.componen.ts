import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
    selector: 'app-team-section',
    standalone: true,
    imports: [AvatarModule, AnimateOnScrollModule],
    templateUrl: './team-section.component.html'
})
export class TeamSectionComponent {}