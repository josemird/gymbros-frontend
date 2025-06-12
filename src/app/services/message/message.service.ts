//Descripción: Servicio de mensajería que interactúa con la API para enviar, recibir y marcar mensajes como leídos, José Miguel Ramírez Domínguez.

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

  sendMessage(receiver_id: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/message`, {
      receiver_id,
      content
    });
  }

  markAsRead(messageId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/message/${messageId}/read`, {});
  }

  getUnreadMessages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/message/unread`);
  }

  getUnreadCounts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/message/unread/count`);
  }

}
