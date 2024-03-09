import { Component, OnInit } from '@angular/core';
import { Pagination, PaginationResult } from '@app/models/Pagination';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss']
})
export class PalestranteListaComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private palestranteService: PalestranteService,) { }

  ngOnInit():void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems:1
    } as Pagination;

    this.carregarPalestrantes();
  }

  public msgFiltrarPor: string;
  public pagination = {} as Pagination;
  public palestrantes: Palestrante[] = [];

  termoBuscaChanged: Subject<string> = new Subject<string>();

  public filtrarPalestrantes(evt: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged.pipe(debounceTime(1500)).subscribe((filtrarPor) => {
        this.spinner.show();
        this.msgFiltrarPor = filtrarPor;
        this.palestranteService
          .getPalestrantes(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filtrarPor
          )
          .subscribe({
            next: (response: PaginationResult<Palestrante[]>) => {
              this.palestrantes = response.result;
              this.pagination = response.pagination;
            },
            error: (error: any) => {
              this.toastr.error('Erro ao buscar Eventos.', 'Erro');
              this.spinner.hide();
            },
          })
          .add(() => this.spinner.hide());
      });
    }
    this.termoBuscaChanged.next(evt.value);
  }

  public carregarPalestrantes(filtrar?:string): void {
    this.spinner.show();

    this.palestranteService
      .getPalestrantes(this.pagination.currentPage, this.pagination.itemsPerPage, filtrar)
      .subscribe({
        next: (response: PaginationResult<Palestrante[]>) => {
          console.log(response);
          this.palestrantes = response.result;
          this.pagination = response.pagination;
        },
        error: (error: any) => {
          this.toastr.error('Erro ao buscar Palestrantes.', 'Erro');
          this.spinner.hide();
        },
      })
      .add(() => this.spinner.hide());
  }
}
