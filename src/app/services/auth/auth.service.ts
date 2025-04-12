// src/app/services/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://vps-ff89e3e0.vps.ovh.net/api';
  private tokenKey = 'token';
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(this.tokenKey);
    this.isAuthenticated$.next(!!token);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem(this.tokenKey, res.access_token);
        this.isAuthenticated$.next(true);
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {
        // Logout exitoso en backend
        localStorage.removeItem(this.tokenKey);
        this.isAuthenticated$.next(false);
      },
      error: (err) => {
        console.error('Error al cerrar sesión en el backend:', err);
        localStorage.removeItem(this.tokenKey);
        this.isAuthenticated$.next(false);
      }
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }
}
