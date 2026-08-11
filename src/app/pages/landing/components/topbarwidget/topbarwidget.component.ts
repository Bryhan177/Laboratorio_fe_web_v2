import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ThemeLanguageControlsComponent } from '../../../../shared/components/theme-language-controls/theme-language-controls.component';

@Component({
  selector: 'topbar-widget',
  standalone: true,
  imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, ThemeLanguageControlsComponent],
  templateUrl: './topbarwidget.component.html',
  styleUrls: ['./topbarwidget.component.scss']
})
export class TopbarWidget {
  constructor(public router: Router) {}
}
