import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
selector: 'footer-widget',
    imports: [],
  templateUrl: './footerwidget.component.html',
  styleUrl: './footerwidget.component.scss'
})
export class FooterWidget {
    public router = inject(Router);
}
