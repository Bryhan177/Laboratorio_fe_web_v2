import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    { path: '', loadComponent: () => import('./app/pages/home/home.component')},
    {
        path: 'dashboard',
        loadComponent: () => import('./app/layout/component/app.layout'),
        children: [
            { path: '', loadComponent: () => import('./app/empty/empty.component') },
            { path: 'apps', loadChildren: () => import('./app/apps/apps.routes') },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', loadComponent: () => import('./app/documentation/documentation.component') },
        ]
    },
    { path: '',
        children: [
            { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes')},
            { path: 'landing', loadComponent: () => import('./app/pages/landing/landing.component')},
            { path: 'landing2', loadComponent: () => import('./app/pages/landing2/landing.component')},
            { path: 'notfound', loadComponent: () => import('./app/pages/notfound/notfound.component')},
        ]
    },
    { path: '**', redirectTo: '/notfound' }
];
