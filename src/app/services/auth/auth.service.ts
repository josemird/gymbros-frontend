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
        localStorage.setItem('user', JSON.stringify(res.user));
        this.isAuthenticated$.next(true);
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated$.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  getLoggedUser(): any {
    const user = localStorage.getItem('user');  // Recupera el usuario desde localStorage
    if (user) {
      try {
        return JSON.parse(user);  // Intenta parsear el usuario si está presente
      } catch (error) {
        console.error("Error al parsear el usuario:", error);  // Si hay un error en el parseo, lo mostramos
        return null;  // En caso de error, devolvemos null
      }
    }
    return null;  // Si el usuario no existe en localStorage, devolvemos null
  }


}
