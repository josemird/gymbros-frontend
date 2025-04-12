import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root' // Este interceptor se proporciona en la raíz de la aplicación, lo que significa que estará disponible en toda la aplicación sin necesidad de importarlo en cada módulo.
})

export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      console.log('[AuthInterceptor] Token detectado, se añade a la petición:', token); // 👈

      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }

    console.warn('[AuthInterceptor] No se encontró token para:', req.url); // 👈
    return next.handle(req);
  }

}
