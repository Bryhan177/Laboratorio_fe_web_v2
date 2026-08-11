import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { MegaMenuModule } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MegaMenuItem } from 'primeng/api';
import { NavigationService } from '../../service/navigation.service';

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
    RippleModule
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
        label: 'Quienes Somos',
        root: true,
        command: () => this.scrollToSection('equipo')
      },
      {
        label: "Galeria",
        root: true,
        command: () => this.scrollToSection('galeria')
      },
      {
        label: "Calendario de eventos",
        root: true,
        command: () => this.scrollToSection('calendario')
      },
      {
        label: "Participa con nosotros",
        root: true,
        command: () => this.scrollToSection('part-team')
      },
      {
        label: 'Proyectos',
        root: true,
        items: [
          [
            {
              items: [
                { label: 'Cursos', icon: 'pi pi-list', command: () => this.navigationService.navigateTo('courses') },
                { label: 'Articulos', icon: 'pi pi-users', command: () => this.navigationService.navigateTo('articles') },
                { label: 'Participa con nosotros', icon: 'pi pi-file', command: () => this.navigationService.navigateTo('participate') }
              ]
            }
          ],
          [
            {
              items: [
                { label: 'Contactanos', icon: 'pi pi-question', command: () => this.navigationService.navigateTo('contact') },
              ]
            }
          ],
          [
            {
              items: [
                { icon: 'pi pi-heart', 
                  label: 'Donaciones',
                  subtext: 'Apoya nuestro trabajo',
                  command: () => this.navigationService.navigateTo('donate')
                }
              ]
            }
          ]
        ]
      },
    ];
  }
}