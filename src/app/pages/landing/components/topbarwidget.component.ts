import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'topbar-widget',
  standalone: true,
  imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule],
  templateUrl: './topbarwidget.component.html',
  styleUrls: ['./topbarwidget.component.scss']
})
export class TopbarWidget {
  constructor(public router: Router) {}
}
