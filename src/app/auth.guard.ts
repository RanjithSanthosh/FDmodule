import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    // Check if user is logged in via token in storage
    const hasToken = localStorage.getItem('authToken');

    if (hasToken) {
        return true;
    }

    // Not logged in, redirect to login page
    //using createUrlTree() if not loggedin then close the current route and redirect to mentioned route. 
    return router.createUrlTree(['']);
};
