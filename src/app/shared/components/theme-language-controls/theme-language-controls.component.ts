import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { LayoutService, layoutConfig } from '../../../layout/service/layout.service';
import { AppLanguage, LanguageService } from '../../../service/language.service';

export type ThemeLanguageVariant = 'brand' | 'topbar' | 'on-color' | 'floating';

@Component({
    selector: 'app-theme-language-controls',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './theme-language-controls.component.html'
})
export class ThemeLanguageControlsComponent {
    @Input() variant: ThemeLanguageVariant = 'brand';
    @Input() showTheme = true;
    @Input() showLanguage = true;
    @Input() showLanguageCode = true;

    languageMenuOpen = false;

    constructor(
        public layoutService: LayoutService,
        public languageService: LanguageService
    ) {}

    get containerClass(): string {
        return 'flex items-center gap-3';
    }

    get languageButtonClass(): string {
        switch (this.variant) {
            case 'topbar':
                return 'layout-topbar-action inline-flex items-center gap-2 !w-auto px-2';
            case 'on-color':
                return 'inline-flex h-10 items-center gap-2 rounded-lg px-2.5 text-white transition-colors hover:bg-white/15';
            case 'floating':
                return 'inline-flex h-11 items-center gap-2 rounded-full border border-surface-200 bg-surface-0 px-3 text-surface-700 shadow-sm transition-all hover:bg-surface-100 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 dark:hover:bg-surface-800';
            default:
                return 'relative inline-flex h-11 items-center gap-2 rounded-full border border-[#28A0AE]/25 bg-[#28A0AE]/10 px-3 text-[#28A0AE] transition-all duration-200 hover:bg-[#28A0AE] hover:text-white dark:border-[#FFDCC2]/30 dark:bg-[#FFDCC2]/10 dark:text-[#FFDCC2] dark:hover:bg-[#FF7F02] dark:hover:text-white dark:hover:border-[#FF7F02]';
        }
    }

    get themeButtonClass(): string {
        switch (this.variant) {
            case 'topbar':
                return 'layout-topbar-action';
            case 'on-color':
                return 'inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/15';
            case 'floating':
                return 'inline-flex h-11 w-11 items-center justify-center rounded-full border border-surface-200 bg-surface-0 text-surface-700 shadow-sm transition-all hover:bg-surface-100 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 dark:hover:bg-surface-800';
            default:
                return 'relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#28A0AE]/25 bg-[#28A0AE]/10 text-[#28A0AE] transition-all duration-200 hover:bg-[#28A0AE] hover:text-white dark:border-[#FFDCC2]/30 dark:bg-[#FFDCC2]/10 dark:text-[#FFDCC2] dark:hover:bg-[#FF7F02] dark:hover:text-white dark:hover:border-[#FF7F02]';
        }
    }

    toggleDarkMode(): void {
        this.layoutService.layoutConfig.update((state: layoutConfig) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    toggleLanguageMenu(event: Event): void {
        event.stopPropagation();
        this.languageMenuOpen = !this.languageMenuOpen;
    }

    selectLanguage(code: AppLanguage, event: Event): void {
        event.stopPropagation();
        this.languageService.setLanguage(code);
        this.languageMenuOpen = false;
    }

    @HostListener('document:click')
    closeLanguageMenu(): void {
        this.languageMenuOpen = false;
    }
}
