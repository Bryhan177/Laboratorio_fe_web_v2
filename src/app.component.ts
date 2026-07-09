import { Component } from '@angular/core';
import { LandingPageComponent } from './app/components/landing-page/landing-page.componen';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [LandingPageComponent],
    template: `
        <app-landing-page />
    `
})
export class AppComponent {}