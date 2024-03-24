import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RedeSocial } from '@app/models/RedeSocial';
import { environment } from '@enviroments/environment';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedeSocialService {
  baseURL = environment.apiURL + 'api/redeSocial';


constructor(private http: HttpClient) { }

/**
 *
 * @param origem Precisa passar a palavra 'palestrante' ou 'evento' - escrito em minusculo.
 * @param id Precisa passar o EventoId caso origem seja Evento
 * @returns Observable<RedeSocial[]>
 */
  public getRedesSociais(origem: string, id: number): Observable<RedeSocial[]>{
    let url =
      id === 0 ? `${this.baseURL}/${origem}` : `${this.baseURL}/${origem}/${id}`;

      return this.http.get<RedeSocial[]>(url).pipe(take(1))
  }
}
