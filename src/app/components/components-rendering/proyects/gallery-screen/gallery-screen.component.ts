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
  bgColor?: string;
  textColor?: string;
  fullContent?: string;
  category?: string;
  description?: string;
  date?: string;
}

type GalleryGroup = { date: string; formattedDate: string; items: GalleryItem[] };

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

  readonly items: GalleryItem[] = [
    ...november132025Data,
    ...july182026Data,
    ...july232026Data
  ];

  /** Agrupado una sola vez (evita recalcular en cada CD). */
  readonly groupedItems: GalleryGroup[] = this.buildGroupedItems(this.items);

  private buildGroupedItems(items: GalleryItem[]): GalleryGroup[] {
    const groups = new Map<string, GalleryItem[]>();

    for (const item of items) {
      if (!item.date) {
        continue;
      }
      const bucket = groups.get(item.date);
      if (bucket) {
        bucket.push(item);
      } else {
        groups.set(item.date, [item]);
      }
    }

    return Array.from(groups.entries())
      .map(([date, groupItems]) => ({
        date,
        formattedDate: this.formatDate(date),
        items: groupItems
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

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