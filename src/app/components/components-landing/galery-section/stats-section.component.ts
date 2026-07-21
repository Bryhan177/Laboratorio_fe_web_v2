import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

export interface Article {
  id: string;
  date: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  readTime: string;
  fullContent: string;
  author: {
    name: string;
    avatar: string;
  };
}

@Component({
    selector: 'app-galery-section',
    standalone: true,
    imports: [AnimateOnScrollModule],
    templateUrl: './stats-section.components.html'
})
export class GalerySectionComponent {

    searchQuery = signal<string>('');
    showSavedOnly = signal<boolean>(false);
    bookmarkedIds = signal<string[]>([]);
    activeArticle = signal<Article | null>(null);

    filteredArticles = computed(() => {
    let result = this.articles();
    const query = this.searchQuery().toLowerCase().trim();
    const savedOnly = this.showSavedOnly();
    const bookmarks = this.bookmarkedIds();

    if (query) {
      result = result.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.description.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query)
      );
    }

    if (savedOnly) {
      result = result.filter(a => bookmarks.includes(a.id));
    }

    return result;
  });

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  toggleBookmarksOnly(): void {
    this.showSavedOnly.update(v => !v);
  }

  toggleBookmark(id: string, event: Event): void {
    event.stopPropagation();
    this.bookmarkedIds.update(current => {
      if (current.includes(id)) {
        return current.filter(item => item !== id);
      } else {
        return [...current, id];
      }
    });
  }

  isBookmarked(id: string): boolean {
    return this.bookmarkedIds().includes(id);
  }

  openArticle(article: Article): void {
    this.activeArticle.set(article);
  }

  closeArticle(): void {
    this.activeArticle.set(null);
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.showSavedOnly.set(false);
  }


    readonly articles = signal<Article[]>([
    {
      id: 'art-1',
      date: 'DECEMBER 21, 2024',
      category: 'Aventura',
      title: 'Why Fast Websites Create Better First Impressions',
      description: 'Speed, responsiveness, and smooth interactions help visitors understand your brand faster and move through your website with less friction.',
      imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Monochromatic artistic hand emerging through dramatic ethereal smoke',
      readTime: '4 min',
      fullContent: 'Performance is not merely an engineering metric; it is the fundamental core of user experience. When web pages load instantly, micro-interactions feel effortless, and layout shifts are eliminated, users experience a sense of quality and reliability that reflects directly on your brand.',
      author: {
        name: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
      }
    },
    {
      id: 'art-2',
      date: 'DECEMBER 21, 2024',
      category: 'Arte',
      title: 'How Visual Direction Shapes A Stronger Website',
      description: 'A clear visual style rooted in imagery, typography, and spacing choices creates a clear emotional direction before a website is built.',
      imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Detailed close-up macro photograph of a white flower bloom',
      readTime: '5 min',
      fullContent: 'Visual direction acts as the quiet language of your digital product. Choosing the right typographic hierarchy, subtle color palettes, and curated photography establishes tone instantly, guiding the user emotionally before they even read a single headline.',
      author: {
        name: 'Julian Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
      }
    },
    {
      id: 'art-3',
      date: 'DECEMBER 21, 2024',
      category: 'Musica',
      title: 'What Makes A Website Project Run Smoothly',
      description: 'From the first call to the final launch, clear communication, feedback, and timelines keep the whole process easier.',
      imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Cinematic long exposure motion blur of a dancer in a flowing red dress',
      readTime: '6 min',
      fullContent: 'Great design projects fail not because of a lack of creativity, but because of friction in communication. Establishing structured feedback loops, setting measurable milestones, and maintaining transparent progress tracking ensures seamless execution from concept to deployment.',
      author: {
        name: 'Marcus Chen',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
      }
    },
    {
      id: 'art-4',
      date: 'DECEMBER 21, 2024',
      category: 'Detalles',
      title: 'Small Details That Make Websites Feel Premium',
      description: 'Spacing, motion, colors, and interface details often decide whether a website feels average or carefully designed.',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Atmospheric close up portrait of a woman with moody lighting',
      readTime: '3 min',
      fullContent: 'The difference between good software and memorable software lies in the details that users do not consciously name, but feel intuitively—crisp typography kerning, deliberate padding, dark mode contrast harmony, and fluid transitions.',
      author: {
        name: 'Sophia Sterling',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
      }
    }
  ]);
}

