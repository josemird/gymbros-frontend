//Descripción: Guard de autenticación que verifica si el usuario está autenticado antes de permitir el acceso a ciertas rutas, redirigiendo a la página de inicio de sesión si no lo está, José Miguel Ramírez Domínguez.

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    take(1),
    map(isLogged => {
      if (isLogged) {
        router.navigate(['/home']);
        return false;
      }
      return true;
    })
  );
};
