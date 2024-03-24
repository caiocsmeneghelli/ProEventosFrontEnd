import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationResult } from '@app/models/Pagination';
import { Palestrante } from '@app/models/Palestrante';
import { environment } from '@enviroments/environment';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PalestranteService {

  constructor(private http: HttpClient) {}

  baseUrl = environment.apiURL + 'api/palestrante';

  public getPalestrantes(page?: number, itemsPerPage?: number, term: string = ""): Observable<PaginationResult<Palestrante[]>> {
    const paginationResult: PaginationResult<Palestrante[]> = new PaginationResult<Palestrante[]>();

    let params = new HttpParams;

    if(page != null && itemsPerPage != null){
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if(term != null && term != ''){
      params = params.append('term', term);
    }

    return this.http
      .get<Palestrante[]>(this.baseUrl + '/all', {observe: 'response', params})
      .pipe(take(1), map((response)=>{
        paginationResult.result = response.body as Palestrante[];
        if(response.headers.has('Pagination')){
          paginationResult.pagination = JSON.parse(response.headers.get('Pagination') as string);
        }
        return paginationResult;
      }));
  }

  public getPalestrante(): Observable<Palestrante> {
    return this.http.get<Palestrante>(`${this.baseUrl}`);
  }

  public post(): Observable<Palestrante> {
    return this.http.post<Palestrante>(this.baseUrl, {} as Palestrante);
  }

  public put(palestrante: Palestrante): Observable<Palestrante> {
    return this.http.put<Palestrante>(`${this.baseUrl}`, palestrante);
  }
}
