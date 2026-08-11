import { Injectable, computed, signal } from '@angular/core';

export type AppLanguage = 'es' | 'en' | 'pt';

export interface LanguageOption {
    code: AppLanguage;
    label: string;
    nativeLabel: string;
    flagSrc: string;
    flagAlt: string;
}

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private static readonly STORAGE_KEY = 'laboratorio-language';

    readonly languages: LanguageOption[] = [
        {
            code: 'es',
            label: 'Español',
            nativeLabel: 'Español',
            flagSrc: 'assets/img/flags/es.svg',
            flagAlt: 'Bandera de Colombia'
        },
        {
            code: 'en',
            label: 'English',
            nativeLabel: 'English',
            flagSrc: 'assets/img/flags/en.svg',
            flagAlt: 'Bandera de Estados Unidos'
        },
        {
            code: 'pt',
            label: 'Português',
            nativeLabel: 'Português',
            flagSrc: 'assets/img/flags/pt.svg',
            flagAlt: 'Bandera de Brasil'
        }
    ];

    private readonly currentLanguage = signal<AppLanguage>(this.readStoredLanguage());

    readonly language = this.currentLanguage.asReadonly();

    readonly selectedLanguage = computed(
        () => this.languages.find((lang) => lang.code === this.currentLanguage()) ?? this.languages[0]
    );

    setLanguage(code: AppLanguage): void {
        if (!this.languages.some((lang) => lang.code === code)) {
            return;
        }

        this.currentLanguage.set(code);
        this.persistLanguage(code);
        document.documentElement.lang = code;
    }

    private readStoredLanguage(): AppLanguage {
        try {
            const stored = localStorage.getItem(LanguageService.STORAGE_KEY);
            if (stored === 'es' || stored === 'en' || stored === 'pt') {
                document.documentElement.lang = stored;
                return stored;
            }
        } catch {
            // Ignore storage errors (private mode, etc.)
        }

        document.documentElement.lang = 'es';
        return 'es';
    }

    private persistLanguage(code: AppLanguage): void {
        try {
            localStorage.setItem(LanguageService.STORAGE_KEY, code);
        } catch {
            // Ignore storage errors (private mode, etc.)
        }
    }
}
