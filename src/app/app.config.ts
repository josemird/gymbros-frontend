import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()), //este es el interceptor de autenticacion que se encuentra en el servicio de autenticacion y usa auth.interceptor.ts declarado en providers como interceptor global (providedIn: 'root')
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
};
