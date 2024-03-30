import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RedeSocial } from '@app/models/RedeSocial';
import { environment } from '@enviroments/environment';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RedeSocialService {
  baseURL = environment.apiURL + 'api/redeSocial';

  constructor(private http: HttpClient) {}

  /**
   *
   * @param origem Precisa passar a palavra 'palestrante' ou 'evento' - escrito em minusculo.
   * @param id Precisa passar o EventoId caso origem seja Evento, caso a origem seja Palestrante passar 0.
   * @returns Observable<RedeSocial[]>
   */
  public getRedesSociais(origem: string, id: number): Observable<RedeSocial[]> {
    let url =
      id === 0
        ? `${this.baseURL}/${origem}`
        : `${this.baseURL}/${origem}/${id}`;

    return this.http.get<RedeSocial[]>(url).pipe(take(1));
  }

  /**
   *
   * @param origem Precisa passar a palavra 'palestrante' ou 'evento' - escrito em minusculo.
   * @param id Precisa passar o EventoId caso origem seja Evento, caso a origem seja Palestrante passar 0.
   * @param redeSociais precisa adicionar Redes Sociais organizadas em RedeSocial
   * @returns Observable<RedeSocial[]>
   */
  public saveRedesSociais(
    origem: string,
    id: number,
    redeSociais: RedeSocial[]
  ): Observable<RedeSocial[]> {
    let url =
      id === 0
        ? `${this.baseURL}/${origem}`
        : `${this.baseURL}/${origem}/${id}`;

    console.log(redeSociais);
    return this.http.put<RedeSocial[]>(url, redeSociais).pipe(take(1));
  }

  /**
   *
   * @param origem Precisa passar a palavra 'palestrante' ou 'evento' - escrito em minusculo.
   * @param id Precisa passar o EventoId caso origem seja Evento, caso a origem seja Palestrante passar 0.
   * @param redeSocialId precisa usar o Id de Rede Social
   * @returns any
   */
  public deleteRedeSocial(
    origem: string,
    id: number,
    redeSocialId: number
  ): Observable<any> {
    let url =
      id === 0
        ? `${this.baseURL}/${origem}/${redeSocialId}`
        : `${this.baseURL}/${origem}/${id}/${redeSocialId}`;

    return this.http.delete(url).pipe(take(1));
  }
}
