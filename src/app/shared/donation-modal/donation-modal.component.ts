import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-donation-modal',
  imports: [],
  templateUrl: './donation-modal.component.html',
  styleUrl: './donation-modal.component.scss'
})
export class DonationModalComponent {

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

}
