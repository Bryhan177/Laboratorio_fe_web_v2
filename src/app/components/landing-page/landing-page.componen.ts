import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { GalerySectionComponent } from '../components-landing/galery-section/stats-section.component';
import { TeamSectionComponent } from '../components-landing/team-section/team-section.componen';
import { NavigationMenuComponent } from '../navigation-menu/navigation-menu.component';
import { FooterComponent } from '../components-landing/footer/footer.component';
// import { WelcomeOverlayComponent } from '../welcome-overlay/welcome-overlay.component';
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
import { CoursesPromoModalComponent } from '../courses-promo-modal/courses-promo-modal.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [
        HeroSectionComponent,
        TeamSectionComponent,
        NavigationMenuComponent,
        FooterComponent,
        // WelcomeOverlayComponent,
        CalendarSectionComponent,
        PartTeamComponent,
        GalerySectionComponent,
        CoursesSectionComponent,
        ArticlesSectionComponent,
        TeamsSectionComponent,
        ContactSectionComponent,
        DonateSectionComponent,
        CoursesPromoModalComponent,
        TestimonialsComponent
    ],
    templateUrl: './landing-page.component.html'
})
export default class LandingPageComponent implements OnInit, OnDestroy {
    readonly showWelcome = signal(false);
    readonly showCoursesPromo = signal(false);

    private promoArmed = false;
    private promoTimer: ReturnType<typeof setTimeout> | null = null;
    private readonly interactionEvents = ['pointerdown', 'scroll', 'keydown'] as const;
    private readonly onInteraction = () => this.handleFirstInteraction();

    constructor(
        private visitorContext: VisitorContextService,
        public navigationService: NavigationService
    ) {}

    ngOnInit(): void {
        // Con welcome comentado no se muestra el overlay; no bloquear el promo.
        // Cuando reactives welcome, vuelve a: this.showWelcome.set(!this.visitorContext.hasSeenWelcome());
        this.showWelcome.set(false);

        if (!this.visitorContext.welcomeDismissed()) {
            this.visitorContext.dismissWelcome();
        }

        this.armCoursesPromo();
    }

    ngOnDestroy(): void {
        this.teardownCoursesPromoListeners();
        this.clearPromoTimer();
    }

    onWelcomeComplete(): void {
        this.showWelcome.set(false);
        this.armCoursesPromo();
    }

    onCoursesPromoClosed(): void {
        this.visitorContext.markCoursesPromoSeen();
        this.showCoursesPromo.set(false);
    }

    onBack(): void {
        this.navigationService.navigateTo('landing');
    }

    private armCoursesPromo(): void {
        if (this.promoArmed || this.visitorContext.hasSeenCoursesPromo()) {
            return;
        }

        this.promoArmed = true;
        for (const event of this.interactionEvents) {
            window.addEventListener(event, this.onInteraction, { passive: true });
        }
    }

    private handleFirstInteraction(): void {
        if (this.showWelcome() || this.promoTimer !== null || this.showCoursesPromo()) {
            return;
        }

        this.teardownCoursesPromoListeners();
        this.promoTimer = setTimeout(() => {
            this.promoTimer = null;
            if (
                this.showWelcome() ||
                this.visitorContext.hasSeenCoursesPromo() ||
                this.navigationService.currentView() !== 'landing'
            ) {
                return;
            }
            this.showCoursesPromo.set(true);
        }, 5_000);
    }

    private teardownCoursesPromoListeners(): void {
        for (const event of this.interactionEvents) {
            window.removeEventListener(event, this.onInteraction);
        }
    }

    private clearPromoTimer(): void {
        if (this.promoTimer !== null) {
            clearTimeout(this.promoTimer);
            this.promoTimer = null;
        }
    }
}
