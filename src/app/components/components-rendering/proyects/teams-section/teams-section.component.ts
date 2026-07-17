import { Component } from '@angular/core';
import { HandHeart, Handshake, Gift, Megaphone } from 'lucide-angular';

interface ways {
    title: string;
    desc: string;
}

interface impact {
    title: string;
    desc: string;
}

@Component({
    selector: 'app-teams-section',
    standalone: true,
    templateUrl: './teams-section.component.html'
})
export class TeamsSectionComponent {
    ways: ways[] = [
        {
            title: 'Voluntariado',
            desc: 'Dona tu tiempo y talento acompañando cursos, eventos y actividades comunitarias.'
        },
        {
            title: 'Alianzas',
            desc: 'Suma tu empresa u organización a proyectos de impacto social sostenible.'
        },
        {
            title: 'Donaciones',
            desc: 'Tu aporte financia materiales, becas y nuevos programas gratuitos.'
        },
        {
            title: 'Difusión',
            desc: 'Comparte nuestra causa y ayúdanos a llegar a más personas que lo necesitan.'
        }
    ];

    impact: impact[] = [
        { title: '300+', desc: 'Voluntarios comprometidos' },
        { title: '45.000', desc: 'Horas de servicio al año' },
        { title: '30', desc: 'Comunidades acompañadas' },
    ]
}
