import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://vps-ff89e3e0.vps.ovh.net/api';
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

  uploadPhoto(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/photo`, formData);
  }



}
