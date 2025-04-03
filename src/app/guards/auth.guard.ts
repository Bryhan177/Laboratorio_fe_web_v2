import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';


const routerInject = () => inject(Router);
const authService = () => inject(AuthService);

export const authGuard: CanActivateFn = async (route, state) => {
    const router = routerInject();
    const { data } = await authService().session();
    if (!data.session) router.navigate(['auth/login']);
    return !!data.session;
};


export const publicGuard: CanActivateFn = async (route, state) => {
    const router = routerInject();
    const { data } = await authService().session();
    if (data.session) router.navigate(['/']);
    return !data.session;
};

