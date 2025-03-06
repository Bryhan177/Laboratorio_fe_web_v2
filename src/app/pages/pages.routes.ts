import { Routes } from '@angular/router';
export default [
    { path: "home", loadComponent: () => import('./home/home.component')},
    { path: "questions", loadComponent: () => import('./questions/questions.component')},
    { path: '**', redirectTo: '/notfound' }
] as Routes;
