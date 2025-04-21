import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LikeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://vps-ff89e3e0.vps.ovh.net/api';

  getLikes(): Observable<{ likes: {
    [x: string]: any; liked_user_id: number
}[] }> {
    return this.http.get<{ likes: { liked_user_id: number }[] }>(`${this.apiUrl}/like`);
  }

  likeUser(userId: number) {
    return this.http.post(`${this.apiUrl}/like`, { liked_user_id: userId });
  }

  unlikeUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/like/${userId}`);
  }
}
