//Descripción: Servicio de Angular que se encarga de realizar peticiones HTTP a la API para obtener información sobre gimnasios, José Miguel Ramírez Domínguez.

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GymService {

  constructor(private http: HttpClient) {}

  private apiUrl = 'https://gymbros-backend.up.railway.app/api';

    getGyms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gyms`);
  }
}
