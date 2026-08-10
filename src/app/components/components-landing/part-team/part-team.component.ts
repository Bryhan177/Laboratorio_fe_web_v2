import { Component } from "@angular/core";
import { AnimateOnScrollModule } from "primeng/animateonscroll";
import { NavigationService } from '../../../service/navigation.service';

@Component({
    selector: 'app-part-team',
    standalone: true,
    imports: [AnimateOnScrollModule],
    templateUrl: './part-team.component.html'
})
export class PartTeamComponent {
    constructor(private navigationService: NavigationService) {}

    navigateToTeams(): void {
        this.navigationService.navigateTo('participate');
    }
}
