import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GymService {

  constructor(private http: HttpClient) {}

  private apiUrl = 'https://vps-ff89e3e0.vps.ovh.net/api';

    getGyms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gyms`);
  }
}
