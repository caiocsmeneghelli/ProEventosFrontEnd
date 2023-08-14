import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class EventoService {
  constructor(private http: HttpClient) {}

  baseUrl = 'https://localhost:7173/api/eventos';
  getEventos() {
    return this.http.get(this.baseUrl);
  }
}
