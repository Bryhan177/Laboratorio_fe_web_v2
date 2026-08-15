import { CommonModule } from "@angular/common";
import { Component, Output, EventEmitter, signal } from "@angular/core";
import { november132025Data } from './data/november-13-2025.data';
import { july182026Data } from './data/july-18-2026.data';
import { july232026Data } from './data/july-23-2026.data';

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
  date?: string;
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

  // Getter para items agrupados por fecha
  get groupedItems(): { date: string; formattedDate: string; items: GalleryItem[] }[] {
    const groups = new Map<string, GalleryItem[]>();

    // Agrupar items por fecha
    this.items.forEach(item => {
      if (item.date) {
        if (!groups.has(item.date)) {
          groups.set(item.date, []);
        }
        groups.get(item.date)!.push(item);
      }
    });

    // Convertir a array y ordenar por fecha (más reciente primero)
    const sortedGroups = Array.from(groups.entries())
      .map(([date, items]) => ({
        date,
        formattedDate: this.formatDate(date),
        items
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return sortedGroups;
  }

  // Método para formatear fechas de manera profesional
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  }

  // Datos combinados de los tres archivos por fecha
  items: GalleryItem[] = [
    ...november132025Data,
    ...july182026Data,
    ...july232026Data
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