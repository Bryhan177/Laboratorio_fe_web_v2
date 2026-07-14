import { Component, OnInit, signal } from '@angular/core';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { ServicesSectionComponent } from '../services-section/services-section.component';
import { StatsSectionComponent } from '../stats-section/stats-section.component';
import { TeamSectionComponent } from '../team-section/team-section.componen';
import { NavigationMenuComponent } from '../navigation-menu/navigation-menu.component';
import { FooterComponent } from '../footer/footer.component';
import { WelcomeOverlayComponent } from '../welcome-overlay/welcome-overlay.component';
import { CalendarSectionComponent } from '../calendar-section/calendar.component';
import { VisitorContextService } from '../../service/visitor-context.service';
import { PartTeamComponent } from "../part-team/part-team.component";

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [
    HeroSectionComponent,
    ServicesSectionComponent,
    TeamSectionComponent,
    StatsSectionComponent,
    NavigationMenuComponent,
    FooterComponent,
    WelcomeOverlayComponent,
    CalendarSectionComponent,
    PartTeamComponent
],
    templateUrl: './landing-page.component.html'
})
export default class LandingPageComponent implements OnInit {
    readonly showWelcome = signal(false);

    constructor(private visitorContext: VisitorContextService) {}

    ngOnInit(): void {
        this.showWelcome.set(!this.visitorContext.hasSeenWelcome());
    }

    onWelcomeComplete(): void {
        this.showWelcome.set(false);
    }
}
