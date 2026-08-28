import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/auth'], { queryParams: { returnUrl: state.url } });
  }

  if (_route.data?.['standardniKorisnikOnly'] && auth.isAdmin()) {
    return router.createUrlTree(['/']);
  }

  return true;
};
