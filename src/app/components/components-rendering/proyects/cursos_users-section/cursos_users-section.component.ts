import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OverlayModule } from "@angular/cdk/overlay";
import { AvatarModule } from "primeng/avatar";
import { OverlayBadgeModule } from "primeng/overlaybadge";
import { MenuModule } from "primeng/menu";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../../core/auth.service";
import { NavigationService } from "../../../../service/navigation.service";

type Tab = "cursos" | "articulos"

@Component({
    selector: 'app-cursos-users-section',
    standalone: true,
    imports: [CommonModule, OverlayModule, AvatarModule, OverlayBadgeModule, MenuModule, ButtonModule, DialogModule, InputTextModule, PasswordModule, FormsModule],
    templateUrl: './cursos_users-section.component.html'
})
export class CursosUsersSectionComponent {

    pestaniaActiva: Tab = "cursos"
    isTooltipOpen = false;
    perfilModalVisible = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private navigationService: NavigationService
    ) {}

    seleccionarPestania(pestania: Tab): void {
        this.pestaniaActiva = pestania;
    }

    isActiva(tab: Tab): boolean {
        return this.pestaniaActiva === tab;
    } 

    daysLeft = 5;
    currentPoints = 5;    
    userName = 'Pablo Martínez';
    nextLesson = 'Fundamentos del aprendizaje';

    leaderboard = [
        { rank: 1, initials: 'PM', name: 'Pablo Martínez', points: 50, isUser: true },
        { rank: 2, initials: 'NC', name: 'Natali Craig', points: 40, isUser: false },
        { rank: 3, initials: 'DC', name: 'Drew Cano', points: 30, isUser: false },
        { rank: 4, initials: 'OG', name: 'Orlando G.', points: 20, isUser: false },
        { rank: 5, initials: 'AL', name: 'Andi Lane', points: 10, isUser: false },
    ];

    tooltipPaso1 = `
    <div class="flex flex-col gap-1 p-1">
      <span class="font-bold text-green-400">Nivel 1: Inicio</span>
      <span class="text-xs text-gray-200">Completaste la introducción.</span>
      <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-green-600 text-white text-[10px] font-bold w-fit">COMPLETADO</span>
    </div>
  `;

  parentBreadcrumb = 'Dashboards';
  parentLink = '/dashboards';
  currentPageTitle = '¡Bienvenido!';

  // Acciones de los botones del header
  toggleTheme(): void {
    console.log('Cambiar tema claro/oscuro');
  }

  openSettings(): void {
    console.log('Abrir ajustes');
  }

  openNotifications(): void {
    console.log('Abrir notificaciones');
  }

  abrirPerfilModal(): void {
    this.perfilModalVisible = true;
  }

  cerrarPerfilModal(): void {
    this.perfilModalVisible = false;
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.navigationService.navigateTo('landing');
    await this.router.navigate(['/auth/login']);
  }

  items: MenuItem[] | undefined;
    ngOnInit() {
        this.items = [
            {
                label: 'Mi cuenta',
                items: [{ label: 'Perfil', command: () => this.abrirPerfilModal() }]
            },
            { separator: true },
            {
              label: 'Salir',
              items: [{ label: 'Cerrar sesión', command: () => this.logout() }]
            }
        ];
    }
}
