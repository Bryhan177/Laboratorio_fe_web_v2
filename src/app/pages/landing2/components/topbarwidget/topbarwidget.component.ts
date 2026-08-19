import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../core/auth.service';
import { NavigationService } from '../../../../service/navigation.service';
import { ThemeLanguageControlsComponent } from '../../../../shared/components/theme-language-controls/theme-language-controls.component';

@Component({
  selector: 'topbar-widget',
  standalone: true,
  imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, ThemeLanguageControlsComponent],
  templateUrl: './topbarwidget.component.html',
  styleUrls: ['./topbarwidget.component.scss']
})
export class TopbarWidget {
  constructor(
    public router: Router,
    public authService: AuthService,
    private navigationService: NavigationService
  ) {}

  async goToAccount(): Promise<void> {
    if (this.authService.isAdmin()) {
      await this.router.navigate(['/admin']);
      return;
    }

    this.navigationService.navigateTo('cursos-users');
    await this.router.navigate(['/']);
  }
}
