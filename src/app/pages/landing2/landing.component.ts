import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbarwidget/topbarwidget.component';
import { HighlightsWidget } from './components/highlightswidget/highlightswidget.component';
import { FooterWidget } from './components/footerwidget/footerwidget.component';
// import { HeroWidget } from "../landing/components/herowidget/herowidget.component";

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
    RouterModule,
    TopbarWidget,
    HighlightsWidget,
    FooterWidget,
    RippleModule,
    StyleClassModule,
    ButtonModule,
    DividerModule,
    // HeroWidget
],
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export default class Landing2 {}
