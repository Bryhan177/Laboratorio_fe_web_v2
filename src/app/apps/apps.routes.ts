import { Routes } from '@angular/router';

export default [
    { path: 'crud', loadComponent: () => import('./crud/crud.component') },

] as Routes;
