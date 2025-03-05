import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SelectionCardComponent } from '../../../shared/components/selection-card/selection-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SelectionCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {
  selectedCard: string = '';

  // Paletas de colores para el fondo y las tarjetas:
  // Modo Día: tonos suaves y menos intensos
  // Modo Noche: tonos más profundos y oscuros
  colorThemes = [
    {
      laboratory: 'bg-gradient-to-br from-cyan-300 via-blue-400 to-blue-600',
      contest: 'bg-gradient-to-br from-purple-400 via-fuchsia-500 to-pink-600',
      background: 'bg-gradient-to-br from-blue-500 to-blue-900'
    },
    {
      laboratory: 'bg-gradient-to-br from-cyan-800 via-blue-600 to-blue-900',
      contest: 'bg-gradient-to-br from-purple-700 via-fuchsia-800 to-pink-900',
      background: 'bg-gradient-to-br from-blue-900 to-blue-700'
    }
  ];

  currentTheme = 0; // Tema actual (0: Día, 1: Noche)

  // Cambia el tema de colores (fondo y tarjetas)
  changeTheme() {
    this.currentTheme = (this.currentTheme + 1) % this.colorThemes.length;
  }

  handleSelect(card: string) {
    this.selectedCard = card;
  }
}
