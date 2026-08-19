import { Component, signal, computed } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { NavigationService } from '../../../service/navigation.service';

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
    constructor(private navigationService: NavigationService) {}

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

  navigateToTeams(): void {
    this.navigationService.navigateTo('gallery-screen');
  }


    readonly articles = signal<Article[]>([
    {
      id: 'art-1',
      date: '13 noviembre 2025',
      category: 'Aventura',
      title: 'Aventura en la Naturaleza: Explorando Senderos',
      description: 'Descubre la emoción de explorar nuevos caminos y conectar con la naturaleza a través de actividades al aire libre diseñadas para todas las edades.',
      imageUrl: './assets/img/gallery/13 noviembre 2025/img4.JPG',
      imageAlt: 'Monochromatic artistic hand emerging through dramatic ethereal smoke',
      readTime: '4 min',
      fullContent: 'Nuestras aventuras en la naturaleza son experiencias transformadoras que conectan a las personas con el entorno natural. A través de caminatas, exploración de senderos y actividades al aire libre, los participantes descubren la belleza de los ecosistemas locales mientras desarrollan resistencia física y aprecio por el medio ambiente. Cada ruta está cuidadosamente seleccionada para ofrecer desafíos apropiados a diferentes niveles, asegurando que todos puedan disfrutar de la emoción del descubrimiento. La aventura no es solo sobre llegar a un destino, sino sobre el viaje, las conexiones que se forman y las historias que se crean en cada paso del camino.',
      author: {
        name: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
      }
    },
    {
      id: 'art-2',
      date: '18 julio 2026',
      category: 'Arte',
      title: 'Arte Creativo: Expresión y Color',
      description: 'Talleres artísticos donde la creatividad florece a través del color, la forma y la imaginación, desarrollando habilidades motoras y expresión emocional.',
      imageUrl: './assets/img/gallery/18 julio 2026/img17.jpg',
      imageAlt: 'Detailed close-up macro photograph of a white flower bloom',
      readTime: '5 min',
      fullContent: 'Nuestros talleres de arte creativo son espacios donde la imaginación no tiene límites. A través de pintura, dibujo, escultura y técnicas mixtas, los participantes exploran el mundo del color y la forma de manera libre y expresiva. Cada sesión está diseñada para desarrollar habilidades motoras finas, fomentar la autoexpresión y construir confianza en las capacidades artísticas de cada persona. Desde la mezcla de colores hasta la creación de texturas, los artistas descubren que el arte es un lenguaje universal que conecta emociones, ideas y sueños de formas únicas y personales.',
      author: {
        name: 'Julian Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
      }
    },
    {
      id: 'art-3',
      date: '23 julio 2026',
      category: 'Recreación',
      title: 'Actividades Educativas en Colegios',
      description: 'Programas interactivos y talleres educativos que llevamos directamente a los colegios, complementando el aprendizaje con experiencias prácticas y divertidas.',
      imageUrl: './assets/img/gallery/23 julio 2026/img33.jpg',
      imageAlt: 'Niños en colegio participando en actividades educativas',
      readTime: '5 min',
      fullContent: 'Nuestro programa de actividades escolares visita colegios para ofrecer experiencias educativas únicas. Desde experimentos científicos hasta talleres de arte y proyectos de teambuilding, diseñamos actividades que complementan el currículo escolar. Trabajamos en estrecha colaboración con docentes para asegurar que cada actividad sea relevante, educativa y memorable. Los niños desarrollan habilidades sociales, pensamiento crítico y creatividad mientras se divierten aprendiendo en un ambiente familiar y seguro.',
      author: {
        name: 'Marcus Chen',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
      }
    },
    {
      id: 'art-4',
      date: '23 julio 2026',
      category: 'Detalles',
      title: 'Detalles que Marcan la Diferencia',
      description: 'Los pequeños detalles en nuestras actividades crean experiencias memorables, desde la organización hasta el cuidado personalizado de cada participante.',
      imageUrl: './assets/img/gallery/13 noviembre 2025/img34.JPG',
      imageAlt: 'Atmospheric close up portrait of a woman with moody lighting',
      readTime: '3 min',
      fullContent: 'En el laboratorio, creemos que los detalles son lo que transforma una actividad común en una experiencia extraordinaria. Desde la preparación meticulosa de materiales hasta la atención personalizada a cada participante, cada aspecto de nuestros programas está diseñado con cuidado. Los pequeños gestos como una bienvenida cálida, un espacio organizado y accesible, o la adaptación de actividades para necesidades individuales, crean un ambiente donde todos se sienten valorados y seguros. Estos detalles invisibles construyen confianza, fomentan la participación y aseguran que cada visita al laboratorio sea memorable y significativa para niños y familias.',
      author: {
        name: 'Sophia Sterling',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
      }
    }
  ]);
}

