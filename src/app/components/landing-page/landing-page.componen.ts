import { Component, OnInit, signal } from '@angular/core';
import { GalerySectionComponent } from '../components-landing/galery-section/stats-section.component';
import { TeamSectionComponent } from '../components-landing/team-section/team-section.componen';
import { NavigationMenuComponent } from '../navigation-menu/navigation-menu.component';
import { FooterComponent } from '../components-landing/footer/footer.component';
import { WelcomeOverlayComponent } from '../welcome-overlay/welcome-overlay.component';
import { CalendarSectionComponent } from '../components-landing/calendar-section/calendar.component';
import { VisitorContextService } from '../../service/visitor-context.service';
import { PartTeamComponent } from "../components-landing/part-team/part-team.component";
import { CoursesSectionComponent } from '../components-rendering/proyects/courses-section/courses-section.component';
import { NavigationService } from '../../service/navigation.service';
import { ArticlesSectionComponent } from "../components-rendering/proyects/articles-section/articles-section.component";
import { HeroSectionComponent } from '../components-landing/hero-section/hero-section.component';
import { TeamsSectionComponent } from "../components-rendering/proyects/teams-section/teams-section.component";
import { ContactSectionComponent } from "../components-rendering/proyects/contact/contact-section.component";
import { DonateSectionComponent } from "../components-rendering/proyects/donate-section/donate-section.component";

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [
    HeroSectionComponent,
    TeamSectionComponent,
    NavigationMenuComponent,
    FooterComponent,
    WelcomeOverlayComponent,
    CalendarSectionComponent,
    PartTeamComponent,
    GalerySectionComponent,
    CoursesSectionComponent,
    ArticlesSectionComponent,
    TeamsSectionComponent,
    ContactSectionComponent,
    DonateSectionComponent
],
    templateUrl: './landing-page.component.html'
})
export default class LandingPageComponent implements OnInit {
    readonly showWelcome = signal(false);

    constructor(
        private visitorContext: VisitorContextService,
        public navigationService: NavigationService
    ) {}

    ngOnInit(): void {
        this.showWelcome.set(!this.visitorContext.hasSeenWelcome());
    }

    onWelcomeComplete(): void {
        this.showWelcome.set(false);
    }
}
