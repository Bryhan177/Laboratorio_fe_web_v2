import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    readonly currentView = signal<'landing' | 'courses' | 'articles' | 'participate' | 'contact' | 'donate' | 'cursos-users'>('landing');

    navigateTo(view: 'landing' | 'courses' | 'articles' | 'participate' | 'contact' | 'donate' | 'cursos-users') {
        this.currentView.set(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
