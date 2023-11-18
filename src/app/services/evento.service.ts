import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';
import { environment } from '@enviroments/environment';

@Injectable()
export class EventoService {
  constructor(private http: HttpClient) {}

  baseUrl = environment.apiURL + 'api/evento';
  tokenHeader = new HttpHeaders({
    Authorization:
      'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIyIiwidW5pcXVlX25hbWUiOiJjYWlvY3NtZW5lZ2hlbGxpIiwibmJmIjoxNzAwMzM2OTIxLCJleHAiOjE3MDA0MjMzMjAsImlhdCI6MTcwMDMzNjkyMX0.7TkjGs_4VuFkxE7MFWOnBUD0pArGAXXJ24-LAHJa-pB0Kl2TRD1YHVIP40oAQXVwDSdCYDDhiZxsNB3c4mP-eA',
  });

  public getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseUrl, { headers: this.tokenHeader });
  }

  public getEventosByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/tema/${tema}`);
  }

  public getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`);
  }

  public post(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.baseUrl, evento);
  }

  public put(evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/${evento.id}`, evento);
  }

  public deleteEvento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  public postUpload(eventoId: number, file: File): Observable<Evento> {
    const fileToUpload = file as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http.post<Evento>(
      `${this.baseUrl}/upload-image/${eventoId}`,
      formData
    );
  }
}
