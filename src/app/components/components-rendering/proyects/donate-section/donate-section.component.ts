import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'app-donate-section',
    standalone: true,
    templateUrl: './donate-section.component.html'
})
export class DonateSectionComponent {
    @Output() back = new EventEmitter<void>();
    
    goBack() {
        this.back.emit();
    }
}
