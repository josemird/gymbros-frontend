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
      next: user => this.currentUser.next(user),
      error: () => this.currentUser.next(null)
    });
  }

  getCurrentUser(): any {
    return this.currentUser.value;
  }

  getCurrentUser$(): Observable<any> {
    return this.currentUser.asObservable();
  }
}
