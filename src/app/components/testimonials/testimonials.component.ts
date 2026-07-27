import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Testimonial {
    quote: string;
    name: string;
    role: string;
    avatar: string;
}

@Component({
    selector: 'app-testimonials',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './testimonials.component.html',
    styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent {
    readonly testimonials: Testimonial[] = [
        {
            quote: 'Participar en el laboratorio me ayudó a recuperar la alegría de enseñar. Las metodologías son cercanas, humanas y realmente transforman el aula.',
            name: 'Alejandra Ríos',
            role: 'Educadora',
            avatar: 'assets/img/alejandra.jpg'
        },
        {
            quote: 'Me sentí escuchado y parte de algo más grande. El juego no solo entretiene: abre espacios de confianza y aprendizaje compartido.',
            name: 'Andrés Molina',
            role: 'Estudiante',
            avatar: 'assets/img/andres.jpg'
        },
        {
            quote: 'Como comunidad, encontramos un lugar seguro para crear, compartir y sanar a través de la recreación. Salimos renovados en cada encuentro.',
            name: 'Karol Méndez',
            role: 'Comunidad',
            avatar: 'assets/img/karol.jpg'
        }
    ];
}
