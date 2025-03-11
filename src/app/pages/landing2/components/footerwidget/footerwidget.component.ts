import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
selector: 'footer-widget',
    imports: [],
  templateUrl: './footerwidget.component.html',
  styleUrl: './footerwidget.component.scss'
})
export class FooterWidget {
    currentYear: number = new Date().getFullYear();

    public router = inject(Router);
}
