import { Component, EventEmitter, Output } from '@angular/core';

export interface info {
    title: string;
    desc: string;
}

@Component({
    selector: 'app-contact-section',
    standalone: true,
    templateUrl: './contact-section.component.html'
})
export class ContactSectionComponent {
    @Output() back = new EventEmitter<void>();

    goBack() {
        this.back.emit();
    }
    
    info: info[] = [
        {
            title: 'Teléfono',
            desc: '+57 314 7454942',
        },
        {
            title: 'Correo',
            desc: 'laboratoriometologiasparti@gmail.com',
        },
    ];
}
