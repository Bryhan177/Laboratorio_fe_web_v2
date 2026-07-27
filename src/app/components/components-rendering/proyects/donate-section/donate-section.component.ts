import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { DonationModalComponent } from "../../../../shared/donation-modal/donation-modal.component";

@Component({
    selector: 'app-donate-section',
    standalone: true,
    templateUrl: './donate-section.component.html',
    imports: [DonationModalComponent]
})
export class DonateSectionComponent implements OnInit, OnDestroy {
    @Output() back = new EventEmitter<void>();
    
    goBack() {
        this.back.emit();
    }

    isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

    frases = [
        "El acto de dar es lo que alimenta el alma.",
        "Juntos, estamos tejiendo un futuro más brillante.",
        "Gracias por ser la esperanza que alguien necesita hoy."
    ];

    indice = 0;
    intervalId: any;

    ngOnInit() {
        this.intervalId = setInterval(() => {
            this.indice = (this.indice + 1) % this.frases.length;
        }, 5000);
    }

    ngOnDestroy() {
        clearInterval(this.intervalId)
    }
}
