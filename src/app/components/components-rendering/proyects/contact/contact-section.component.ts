import { Component } from '@angular/core';

export interface info {
    title: string;
    desc: string;
    ubic: string;
}

@Component({
    selector: 'app-contact-section',
    standalone: true,
    templateUrl: './contact-section.component.html'
})
export class ContactSectionComponent {
    info: info[] = [
        {
            title: 'Dirección',
            desc: 'Calle 45 # 12-30',
            ubic: 'Bogotá, Colombia'
        },
        {
            title: 'Teléfono',
            desc: '+57 601 555 0134',
            ubic: 'Lun a Vie'
        },
        {
            title: 'Correo',
            desc: 'hola@fundacionrecrea.org',
            ubic: 'cursos@fundacionrecrea.org'
        },
        {
            title: 'Horario',
            desc: 'Lun - Vie: 8:00 - 18:00',
            ubic: 'Sáb: 9:00 - 13:00'
        }
    ];
}
