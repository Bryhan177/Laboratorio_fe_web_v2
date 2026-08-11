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
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../../core/auth.service";
import { NavigationService } from "../../../../service/navigation.service";
import { ThemeLanguageControlsComponent } from "../../../../shared/components/theme-language-controls/theme-language-controls.component";

type Tab = "cursos" | "articulos"

@Component({
    selector: 'app-cursos-users-section',
    standalone: true,
    imports: [CommonModule, OverlayModule, AvatarModule, OverlayBadgeModule, MenuModule, ButtonModule, DialogModule, InputTextModule, PasswordModule, FormsModule, DropdownModule, InputNumberModule, ThemeLanguageControlsComponent],
    templateUrl: './cursos_users-section.component.html'
})
export class CursosUsersSectionComponent {

    pestaniaActiva: Tab = "cursos"
    isTooltipOpen = false;
    perfilModalVisible = false;
    avatarUrl = 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png';

  generoOptions = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Femenino', value: 'femenino' },
    { label: 'No aplica', value: 'no_aplica' }
  ];

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.avatarUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
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
                items: [{ label: 'Perfil', icon: 'pi pi-user', command: () => this.abrirPerfilModal() }, 
                { label: 'contraseña', icon: 'pi pi-key' }
                ]
            },
            { separator: true },
            {
              items: [{ label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() }]
            }
        ];
    }
}
