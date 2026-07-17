import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

export interface Course {
  image: string;
  tag: string;
  title: string;
  desc: string;
  duration: string;
  level: string;
  cupos: string;
  price: string;
}

@Component({
    selector: 'app-courses-section',
    standalone: true,
    imports: [
    CommonModule, 
    NgOptimizedImage, 
    RouterModule, 
    ButtonModule
  ],
    templateUrl: './courses-section.component.html'
})
export class CoursesSectionComponent {
    courses: Course[] = [
    {
      image: 'assets/img/courses/curso-danza.png',
      tag: 'Danza y música',
      title: 'Danzas urbanas para jóvenes',
      desc: 'Ritmo, expresión y trabajo en equipo en un espacio seguro y divertido.',
      duration: '8 semanas',
      level: 'Todos los niveles',
      cupos: '20 cupos',
      price: 'Gratuito',
    },
    {
      image: 'assets/img/courses/curso-senderismo.png',
      tag: 'Aire libre',
      title: 'Senderismo y naturaleza',
      desc: 'Rutas guiadas para reconectar con el entorno y cuidar la salud física.',
      duration: '6 salidas',
      level: 'Principiante',
      cupos: '25 cupos',
      price: 'Aporte voluntario',
    },
    {
      image: 'assets/img/courses/curso-arte.png',
      tag: 'Arte y cultura',
      title: 'Taller de pintura creativa',
      desc: 'Explora tu creatividad con técnicas de dibujo y pintura para toda la familia.',
      duration: '10 semanas',
      level: 'Todos los niveles',
      cupos: '18 cupos',
      price: 'Gratuito',
    },
    {
      image: 'assets/img/courses/articulo-bienestar.png',
      tag: 'Bienestar',
      title: 'Yoga y mindfulness al aire libre',
      desc: 'Sesiones de respiración y movimiento para reducir el estrés y ganar energía.',
      duration: '12 sesiones',
      level: 'Todos los niveles',
      cupos: '30 cupos',
      price: 'Gratuito',
    },
    {
      image: 'assets/img/courses/articulo-ninos.png',
      tag: 'Infantil',
      title: 'Escuela de juego infantil',
      desc: 'Juegos, deportes y actividades lúdicas para el desarrollo integral de los niños.',
      duration: 'Todo el año',
      level: '5 a 12 años',
      cupos: '40 cupos',
      price: 'Gratuito',
    },
    {
      image: 'assets/img/courses/articulo-comunidad.png',
      tag: 'Comunidad',
      title: 'Recreación para adulto mayor',
      desc: 'Actividad física suave, memoria y encuentros sociales para una vida activa.',
      duration: 'Permanente',
      level: '60+ años',
      cupos: '35 cupos',
      price: 'Gratuito',
    }
  ];
}