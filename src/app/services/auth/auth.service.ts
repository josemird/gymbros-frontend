import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, finalize, Observable, of, tap } from 'rxjs';

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
        this.isAuthenticated$.next(false);
      })
    );
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch (error) {
      console.error('[AuthService] Error al acceder a localStorage:', error);
      return null;
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

}
