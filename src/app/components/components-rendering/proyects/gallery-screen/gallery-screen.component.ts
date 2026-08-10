import { CommonModule } from "@angular/common";
import { Component, Output, EventEmitter, signal } from "@angular/core";

export interface GalleryItem {
  id: number;
  type: 'image' | 'text' | 'card';
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  bgColor?: string; // Colores personalizados tipo la imagen
  textColor?: string;
  fullContent?: string;
  category?: string;
  description?: string;
}

@Component({
    selector: 'app-gallery-screen',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './gallery-screen.component.html'
})
export class GalleryScreenComponent {
    @Output() back = new EventEmitter<void>();

  selectedItem: GalleryItem | null = null;
  activeArticle = signal<GalleryItem | null>(null);

  // Datos mock que imitan el diseño de la imagen
  items: GalleryItem[] = [
    {
      id: 1,
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600',
      title: 'WHAT IS PLAYLIST',
      category: 'FEATURED',
      description: 'Speed, responsiveness, and smooth interactions help visitors understand your brand faster and move through your website with less friction.',
    },
    {
      id: 2,
      type: 'text',
      title: 'What\'s One Game You Wish You Could Play For The First Time Again?',
      bgColor: 'bg-[#C83214]', // Rojo quemado/naranja
      textColor: 'text-white',
    },
    {
      id: 3,
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600',
      title: 'PLAYLIST HQ MARCH',
      textColor: 'text-[#28A0AE]',
      description: 'Speed, responsiveness, and smooth interactions help visitors understand your brand faster and move through your website with less friction.',
    },
    {
      id: 4,
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600',
      description: 'Speed, responsiveness, and smooth interactions help visitors understand your brand faster and move through your website with less friction.',
    },
    {
      id: 5,
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=600',
      description: 'Speed, responsiveness, and smooth interactions help visitors understand your brand faster and move through your website with less friction.',
    },
    {
      id: 6,
      type: 'text',
      title: 'Think Goodreads... But For Gamers',
      subtitle: 'GAMING COMMUNITY',
      bgColor: 'bg-[#FFDCC2]',
      textColor: 'text-[#C83214]'
    },
    {
      id: 7,
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600',
      description: 'Speed, responsiveness, and smooth interactions help visitors understand your brand faster and move through your website with less friction.',
    },
    {
      id: 8,
      type: 'text',
      title: 'MEET OUR FEATURED PLAYER',
      bgColor: 'bg-[#D63A1D]',
      textColor: 'text-white'
    },
    {
      id: 9,
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600',
      description: 'Speed, responsiveness, and smooth interactions help visitors understand your brand faster and move through your website with less friction.',
    },
    {
      id: 10,
      type: 'text',
      title: 'You\'ll Be Able To Do THIS Soon...',
      bgColor: 'bg-[#A3D2B5]', // Verde pastel
      textColor: 'text-neutral-900'
    },
    {
      id: 11,
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=600',
      title: 'Set Up Spotlight',
      description: 'Speed, responsiveness, and smooth interactions help visitors understand your brand faster and move through your website with less friction.',
    },
    {
      id: 12,
      type: 'text',
      title: 'You\'ll Be Able To Do THIS On Playlist Soon...',
      bgColor: 'bg-[#212328]', // Oscuro
      textColor: 'text-white'
    }
  ];

 openArticle(article: GalleryItem): void {
     this.activeArticle.set(article);
   }

  closeArticle(): void {
    this.activeArticle.set(null);
  }

  goBack(): void {
    this.back.emit();
  }

}