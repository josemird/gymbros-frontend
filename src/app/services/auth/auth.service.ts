import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://vps-ff89e3e0.vps.ovh.net/api';
  private tokenKey = 'token';
  private userKey = 'user';

  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(this.tokenKey);
    this.isAuthenticated$.next(!!token);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem(this.tokenKey, res.access_token);
        localStorage.setItem(this.userKey, JSON.stringify(res.users));
        this.isAuthenticated$.next(true);
      })
    );
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }

  getUser(): any | null {
    try {
      const user = localStorage.getItem(this.userKey);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
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
        localStorage.removeItem(this.userKey);
        this.isAuthenticated$.next(false);
      })
    );
  }
}
