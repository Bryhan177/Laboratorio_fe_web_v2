import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';

@Component({
      selector: 'pricing-widget',
      imports: [DividerModule, ButtonModule, RippleModule],

  templateUrl: './pricingwidget.component.html',
  styleUrl: './pricingwidget.component.scss'
})
export class PricingWidget {

}
