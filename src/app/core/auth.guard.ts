import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { supabase } from './supabase.client';

export const authGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
        return router.createUrlTree(['/auth/login']);
    }

    return true;
};

export const adminGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
        return router.createUrlTree(['/auth/login']);
    }

    const profile = await auth.ensureProfile();
    if (profile?.role !== 'administrador') {
        return router.createUrlTree(['/']);
    }

    return true;
};
