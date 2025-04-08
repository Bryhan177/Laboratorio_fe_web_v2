import { Routes } from '@angular/router';
// import { HighlightsWidget } from './landing2/components/highlightswidget/highlightswidget.component';
export default [
    // { path: "home", loadComponent: () => import('./home/home.component')},
    { path: "questions", loadComponent: () => import('./questions/questions.component')},
    { path: '**', redirectTo: '/notfound' },
    // { path: 'landing2', component: HighlightsWidget },
] as Routes;
