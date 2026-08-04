import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OverlayModule } from "@angular/cdk/overlay";

type Tab = "cursos" | "articulos"

@Component({
    selector: 'app-cursos-users-section',
    standalone: true,
    imports: [CommonModule, OverlayModule],
    templateUrl: './cursos_users-section.component.html'
})
export class CursosUsersSectionComponent {

    pestaniaActiva: Tab = "cursos"
    isTooltipOpen = false;

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
}
