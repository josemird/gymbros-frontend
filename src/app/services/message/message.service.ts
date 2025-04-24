import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private http = inject(HttpClient);
  private apiUrl = 'https://vps-ff89e3e0.vps.ovh.net/api';

  getMessages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/message`);
  }

  sendMessage(receiver_id: number, content: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/message`, {
      receiver_id,
      content: typeof content === 'string' ? content : JSON.stringify(content)
    });
  }

  markAsRead(messageId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/message/${messageId}/read`, {});
  }
}
