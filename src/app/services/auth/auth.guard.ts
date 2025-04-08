import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn().pipe(
    take(1),
    map(isAuth => {
      if (!isAuth) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
