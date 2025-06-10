import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ]
};
