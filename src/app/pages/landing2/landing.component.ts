import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbarwidget/topbarwidget.component';
import { HeroWidget } from './components/herowidget/herowidget.component';
import { FeaturesWidget } from './components/featureswidget/featureswidget.component';
import { HighlightsWidget } from './components/highlightswidget/highlightswidget.component';
import { PricingWidget } from './components/pricingwidget/pricingwidget.component';
import { FooterWidget } from './components/footerwidget/footerwidget.component';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
        RouterModule,
        TopbarWidget,
        HeroWidget,
        FeaturesWidget,
        HighlightsWidget,
        PricingWidget,
        FooterWidget,
        RippleModule,
        StyleClassModule,
        ButtonModule,
        DividerModule
    ],
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export default class Landing2 {}
