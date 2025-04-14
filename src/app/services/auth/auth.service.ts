import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://vps-ff89e3e0.vps.ovh.net/api';
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
}
