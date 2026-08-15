import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { MegaMenuModule } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MegaMenuItem } from 'primeng/api';
import { NavigationService } from '../../service/navigation.service';
import { ThemeLanguageControlsComponent } from '../../shared/components/theme-language-controls/theme-language-controls.component';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AvatarModule,
    MegaMenuModule,
    ButtonModule,
    RippleModule,
    ThemeLanguageControlsComponent
  ]
})

export class NavigationMenuComponent implements OnInit {
    items: MegaMenuItem[] | undefined;

    constructor(private navigationService: NavigationService) {}

    scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // Ajuste por el menú fijo
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

  ngOnInit() {
    this.items = [
      {
        label: 'Cursos',
        root: true,

        command: () => this.navigationService.navigateTo('courses')
      },
      {
        label: "Articulos",
        root: true,

        command: () => this.navigationService.navigateTo('articles')
      },
      {
        label: "Participa",
        root: true,

        command: () => this.navigationService.navigateTo('participate')
      },
      {
        label: "Contactanos",
        root: true,

        command: () => this.navigationService.navigateTo('contact')
      },
      {
        label: "Donaciones",
        root: true,

        command: () => this.navigationService.navigateTo('donate')
      },
    ];
  }
}
