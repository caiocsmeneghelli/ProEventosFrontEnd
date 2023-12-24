import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { Evento } from '../models/Evento';
import { environment } from '@enviroments/environment';
import { Pagination, PaginationResult } from '@app/models/Pagination';

@Injectable()
export class EventoService {
  constructor(private http: HttpClient) {}

  baseUrl = environment.apiURL + 'api/evento';
  // localStorageString = localStorage.getItem('user') as string;
  // arr =
  //   this.localStorageString != '' ? JSON.parse(this.localStorageString) : '';
  // token = this.arr != null ? this.arr.token : '';
  // tokenHeader = new HttpHeaders({
  //   Authorization: `Bearer ${this.token}`,
  // });

  public getEventos(page?: number, itemsPerPage?: number, term?: string): Observable<PaginationResult<Evento[]>> {
    const paginationResult: PaginationResult<Evento[]> = new PaginationResult<Evento[]>();

    let params =  new HttpParams;

    if(page != null && itemsPerPage != null){
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if(term != null && term != ''){
      params = params.append('term', term);
    }

    return this.http
      .get<Evento[]>(this.baseUrl, {observe: 'response', params})
      .pipe(take(1), map((response)=>{
        paginationResult.result = response.body as Evento[];
        if(response.headers.has('Pagination')){
          paginationResult.pagination = JSON.parse(response.headers.get('Pagination') as string);
        }
        return paginationResult;
      }));
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
