import { Component } from '@angular/core';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { ServicesSectionComponent } from '../services-section/services-section.component';
import { StatsSectionComponent } from '../stats-section/stats-section.component';
import { TeamSectionComponent } from '../team-section/team-section.componen';
import { NavigationMenuComponent } from '../navigation-menu/navigation-menu.component';

@Component({
  selector: 'app-landing-page',
    standalone: true,
    imports: [
        HeroSectionComponent,
        ServicesSectionComponent,
        TeamSectionComponent,
        StatsSectionComponent,
        NavigationMenuComponent
    ],
    templateUrl: './landing-page.component.html'
})
export class LandingPageComponent {}