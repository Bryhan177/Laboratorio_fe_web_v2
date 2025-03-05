import { Routes } from '@angular/router';
export default [
    { path: "Home", loadComponent: () => import('./home/home.component')},
    { path: '**', redirectTo: '/notfound' }
] as Routes;
