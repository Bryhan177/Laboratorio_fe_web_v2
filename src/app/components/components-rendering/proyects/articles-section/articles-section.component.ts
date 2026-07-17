import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

export interface Feacture {
  image: string;
  category: string;
  title: string;
  desc: string;
  date: string;
  read: string;
  author: string;
}

export interface Article {
  image: string;
  category: string;
  title: string;
  desc: string;
  date: string;
  read: string;
}

@Component({
    selector: 'app-articles-section',
    standalone: true,
    imports: [
    CommonModule, 
    NgOptimizedImage, 
    RouterModule, 
    ButtonModule
  ],
    templateUrl: './articles-section.component.html'
})
export class ArticlesSectionComponent {

    feactured: Feacture[] = [
        {
  image: 'assets/img/courses/articulo-bienestar.png',
  category: 'Bienestar',
  title: 'El poder de la recreación en la salud mental',
  desc: 'Descubre cómo el juego, el movimiento y el contacto con la naturaleza reducen el estrés, mejoran el ánimo y fortalecen los vínculos comunitarios en personas de todas las edades.',
  date: '10 de julio, 2026',
  read: '6 min de lectura',
  author: 'Equipo Recrea',
}
    ]

    articles: Article[] = [
        {
    image: 'assets/img/courses/articulo-ninos.png',
    category: 'Infancia',
    title: '5 juegos para desarrollar habilidades sociales en la niñez',
    desc: 'Actividades sencillas que fomentan la empatía, la cooperación y la confianza.',
    date: '2 de julio, 2026',
    read: '4 min',
  },
  {
    image: 'assets/img/courses/articulo-comunidad.png',
    category: 'Comunidad',
    title: 'Cómo organizar un evento recreativo en tu barrio',
    desc: 'Una guía práctica para crear espacios de encuentro que unan a los vecinos.',
    date: '25 de junio, 2026',
    read: '7 min',
  },
  {
    image: 'assets/img/courses/curso-senderismo.png',
    category: 'Aire libre',
    title: 'Beneficios del senderismo para cuerpo y mente',
    desc: 'Por qué caminar en la naturaleza es uno de los mejores hábitos saludables.',
    date: '18 de junio, 2026',
    read: '5 min',
  },
  {
    image: 'assets/img/courses/curso-danza.png',
    category: 'Arte',
    title: 'La danza como herramienta de inclusión social',
    desc: 'Historias reales de transformación a través del movimiento y la música.',
    date: '9 de junio, 2026',
    read: '6 min',
  },
  {
    image: 'assets/img/courses/curso-arte.png',
    category: 'Cultura',
    title: 'Arte para todos: creatividad sin barreras',
    desc: 'Cómo los talleres artísticos abren puertas a nuevas formas de expresión.',
    date: '1 de junio, 2026',
    read: '4 min',
  },
  {
    image: 'assets/img/courses/participa-voluntarios.png',
    category: 'Voluntariado',
    title: 'Ser voluntario: una experiencia que transforma',
    desc: 'Lo que aprenden quienes donan su tiempo al servicio de la comunidad.',
    date: '24 de mayo, 2026',
    read: '5 min',
  },
    ]
}