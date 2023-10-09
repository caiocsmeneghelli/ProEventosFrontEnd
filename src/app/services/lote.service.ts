import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lote } from '@app/models/Lote';
import { Observable } from 'rxjs';

@Injectable()
export class LoteService {
  constructor(private http: HttpClient) {}

  baseUrl = 'https://localhost:7047/api/lote';
  public getLotesByEventoId(eventoId: number): Observable<Lote[]> {
    return this.http.get<Lote[]>(`${this.baseUrl}/${eventoId}`);
  }

  public saveLotes(eventoId: number, lotes:Lote[]): Observable<Lote[]> {
    return this.http.put<Lote[]>(`${this.baseUrl}/${eventoId}`, lotes);
  }

  public deleteLote(loteId:number, eventoId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${eventoId}/${loteId}`);
  }
}
