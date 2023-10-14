import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable()

export class EventoService {
  constructor(private http: HttpClient) {}

  baseUrl = 'https://localhost:7047/api/evento';
  public getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseUrl);
  }

  public getEventosByTema(tema:string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/tema/${tema}`);
  }

  public getEventoById(id:number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`);
  }

  public post(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.baseUrl, evento);
  }

  public put(evento:Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/${evento.id}`, evento);
  }

  public deleteEvento(id:number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  public postUpload(eventoId: number, file: File): Observable<Evento>{
    const fileToUpload = file as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http
      .post<Evento>(`${this.baseUrl}/upload-image/${eventoId}`, formData);
  }
}
