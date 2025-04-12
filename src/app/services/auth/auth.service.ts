import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root'})
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
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem('user', JSON.stringify(res.user)); //* revisar este guardado
        this.isAuthenticated$.next(true);
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.post('https://vps-ff89e3e0.vps.ovh.net/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe({
        next: () => {
          localStorage.removeItem(this.tokenKey);
          this.isAuthenticated$.next(false);
        },
        error: () => {
          localStorage.removeItem(this.tokenKey);
          this.isAuthenticated$.next(false);
        }
      });
    } else {
      localStorage.removeItem(this.tokenKey);
      this.isAuthenticated$.next(false);
    }
  }

}
