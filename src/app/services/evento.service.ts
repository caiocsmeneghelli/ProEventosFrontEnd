import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable()

export class EventoService {
  constructor(private http: HttpClient) {}

  baseUrl = 'https://localhost:7047/api/evento';
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseUrl);
  }

  getEventosByTema(tema:string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/tema/${tema}`);
  }

  getEventoById(id:number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`);
  }
}
