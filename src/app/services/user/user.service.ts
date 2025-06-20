//Descripción: Servicio de usuario que maneja la autenticación, obtención y actualización de datos del usuario, incluyendo la carga de fotos y la gestión de contraseñas, José Miguel Ramírez Domínguez.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://gymbros-backend.up.railway.app/api/';
  private currentUser = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  fetchCurrentUser(): void {
    this.http.get<any>(`${this.apiUrl}/profile`).subscribe({
      next: user => {
        this.currentUser.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: () => this.currentUser.next(null)
    });
  }

  getCurrentUser(): any {
    return this.currentUser.value;
  }

  setCurrentUser(user: any): void {
    this.currentUser.next(user);
  }

  watchCurrentUser$(): Observable<any> {
    return this.currentUser.asObservable();
  }

  updateCurrentUser(data: any): Observable<any> {
    const userId = this.getCurrentUser()?.id;
    return this.http.patch(`${this.apiUrl}/user/${userId}`, data);
  }

  changePassword(newPassword: string): Observable<any> {
    const userId = this.getCurrentUser()?.id;
    return this.http.patch(`${this.apiUrl}/user/${userId}`, { password: newPassword });
  }

  deleteCurrentUser(): Observable<any> {
    const userId = this.getCurrentUser()?.id;
    return this.http.delete(`${this.apiUrl}/user/${userId}`);
  }

  uploadPhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.post(`${this.apiUrl}/user/photo`, formData);
  }

   getAllUsernamesAndEmails(): Observable<{ username: string, email: string }[]> {
    return this.http.get<{users: any[]}>(`${this.apiUrl}/user`).pipe(
      map(res => {
        const result = res.users.map(u => ({ username: u.username, email: u.email }));
        return result;
      })
    );
  }

}
