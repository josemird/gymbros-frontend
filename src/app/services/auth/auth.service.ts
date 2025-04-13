// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://vps-ff89e3e0.vps.ovh.net/api';
  private tokenKey = 'token';
  private userEmail: string | null = null;

  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(this.tokenKey);
    this.isAuthenticated$.next(!!token);

    if (token) {
      this.fetchCurrentUser(); // ⚠️ Pedimos el email del usuario logueado si hay token
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem(this.tokenKey, res.access_token);
        this.isAuthenticated$.next(true);
        this.userEmail = email; // 🔥 Guardamos el email
      })
    );
  }

  private fetchCurrentUser() {
    this.http.get<any>(`${this.apiUrl}/force_profile`).subscribe({
      next: (user) => {
        this.userEmail = user.email;
      },
      error: () => {
        this.userEmail = null;
      }
    });
  }

  getUserEmail(): string | null {
    return this.userEmail;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem(this.tokenKey);
        this.isAuthenticated$.next(false);
        this.userEmail = null;
      })
    );
  }
}
