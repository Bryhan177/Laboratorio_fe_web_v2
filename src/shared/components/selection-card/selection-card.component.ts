import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selection-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [ngClass]="[
        'relative overflow-hidden rounded-3xl transition-all duration-300 cursor-pointer flex flex-col shadow-xl w-full h-[35rem]',
        isSelected
          ? (color + ' scale-110 shadow-2xl border-4 border-white/50')
          : (color + ' hover:brightness-110')
      ]"
      (click)="handleClick()"
    >
      <!-- Efecto de resplandor dinámico cuando está seleccionado -->
      <div *ngIf="isSelected" class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-300/20 to-transparent opacity-50 blur-2xl"></div>

      <!-- Contenedor de imagen con altura fija -->
      <div *ngIf="imageUrl" class="w-full h-1/2 overflow-hidden">
        <img [src]="imageUrl" alt="{{ title }}" class="w-full h-full object-cover" />
      </div>

      <!-- Ícono (se muestra si no se define una imagen) -->
      <div *ngIf="!imageUrl" class="mt-4">
        <i [ngClass]="['pi', icon, 'text-white text-8xl drop-shadow-lg']"></i>
      </div>

      <!-- Contenedor de texto -->
      <div class="p-4 flex flex-col items-center justify-center flex-grow">
        <h3 class="text-3xl font-extrabold text-white mb-2">{{ title }}</h3>
        <p class="text-lg text-gray-200">{{ description }}</p>
      </div>
    </div>
  `
})
export class SelectionCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() path: string = '';
  @Input() color: string = '';
  @Input() isSelected: boolean = false;
  @Input() icon: string = ''; // Icono de PrimeNG
  @Input() imageUrl: string = ''; // Propiedad para la imagen
  @Output() select = new EventEmitter<void>();

  constructor(private router: Router) {}

  handleClick(): void {
    this.select.emit();
    setTimeout(() => {
      this.router.navigate([this.path]);
    }, 500);
  }
}
