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
  selectedCard: any = '';

  // Paletas de colores para el fondo y las tarjetas:
  // Modo Día: tonos suaves y menos intensos
  // Modo Noche: tonos más profundos y oscuros
  // Se mantienen los temas originales y se agregan nuevos.
  // Además, se asigna un color distinto para cada card (card1 a card6)
  colorThemes = [
    {
      laboratory: 'bg-gradient-to-br from-cyan-300 via-blue-400 to-blue-600',
      contest: 'bg-gradient-to-br from-purple-400 via-fuchsia-500 to-pink-600',
      background: 'bg-gradient-to-br from-blue-500 to-blue-900',
      card1: 'bg-gradient-to-br from-indigo-300 to-indigo-500',
      card2: 'bg-gradient-to-br from-red-300 to-red-500',
      card3: 'bg-gradient-to-br from-green-300 to-green-500',
      card4: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
      card5: 'bg-gradient-to-br from-pink-300 to-pink-500',
      card6: 'bg-gradient-to-br from-teal-300 to-teal-500'
    },
    {
      laboratory: 'bg-gradient-to-br from-cyan-800 via-blue-600 to-blue-900',
      contest: 'bg-gradient-to-br from-purple-700 via-fuchsia-800 to-pink-900',
      background: 'bg-gradient-to-br from-blue-900 to-blue-700',
      card1: 'bg-gradient-to-br from-indigo-700 to-indigo-900',
      card2: 'bg-gradient-to-br from-red-700 to-red-900',
      card3: 'bg-gradient-to-br from-green-700 to-green-900',
      card4: 'bg-gradient-to-br from-yellow-700 to-yellow-900',
      card5: 'bg-gradient-to-br from-pink-700 to-pink-900',
      card6: 'bg-gradient-to-br from-teal-700 to-teal-900'
    },
    {
      laboratory: 'bg-gradient-to-br from-green-300 via-teal-400 to-blue-500',
      contest: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600',
      background: 'bg-gradient-to-br from-gray-100 to-gray-300',
      card1: 'bg-gradient-to-br from-purple-200 to-purple-400',
      card2: 'bg-gradient-to-br from-blue-200 to-blue-400',
      card3: 'bg-gradient-to-br from-pink-200 to-pink-400',
      card4: 'bg-gradient-to-br from-green-200 to-green-400',
      card5: 'bg-gradient-to-br from-orange-200 to-orange-400',
      card6: 'bg-gradient-to-br from-red-200 to-red-400'
    },
    {
      laboratory: 'bg-gradient-to-br from-green-800 via-teal-700 to-blue-800',
      contest: 'bg-gradient-to-br from-yellow-700 via-orange-800 to-red-900',
      background: 'bg-gradient-to-br from-gray-700 to-gray-900',
      card1: 'bg-gradient-to-br from-purple-800 to-purple-900',
      card2: 'bg-gradient-to-br from-blue-800 to-blue-900',
      card3: 'bg-gradient-to-br from-pink-800 to-pink-900',
      card4: 'bg-gradient-to-br from-green-800 to-green-900',
      card5: 'bg-gradient-to-br from-orange-800 to-orange-900',
      card6: 'bg-gradient-to-br from-red-800 to-red-900'
    }
  ];

  currentTheme = 3; // Tema actual (0: Día, 1: Noche, 2 y 3: nuevos)

  changeTheme() {
    this.currentTheme = (this.currentTheme + 1) % this.colorThemes.length;
  }

  handleSelect(card: string) {
    this.selectedCard = card;
  }
}
