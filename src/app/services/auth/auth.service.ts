//Descripción: Servicio de autenticación que maneja el inicio de sesión, registro, cierre de sesión y verificación del estado de autenticación del usuario, José Miguel Ramírez Domínguez.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://gymbros-backend.up.railway.app/api/';
  private tokenKey = 'token';

  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private userService: UserService) {
    const token = localStorage.getItem(this.tokenKey);
    this.isAuthenticated$.next(!!token);

    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.userService.setCurrentUser(JSON.parse(storedUser));
        this.userService.fetchCurrentUser();
      }
      this.userService.fetchCurrentUser();
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem(this.tokenKey, res.access_token);
        this.isAuthenticated$.next(true);
        this.userService.fetchCurrentUser();
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      this.isAuthenticated$.next(false);
      return of(null);
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem('user');
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('verifyType');
        localStorage.removeItem('pendingRegister');
        this.isAuthenticated$.next(false);
        this.userService.setCurrentUser(null);
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
    }

  sendCode(data: { email: string, type: 'password_reset' | 'register' }) {
    return this.http.post(`${this.apiUrl}/send-code`, data);
  }

  verifyCode(data: any) {
    return this.http.post(`${this.apiUrl}/verify-code`, data);
  }

}
