import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@enviroments/environment';
import { Pagination, PaginationResult } from '@app/models/Pagination';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-eventos-lista',
  templateUrl: './eventos-lista.component.html',
  styleUrls: ['./eventos-lista.component.scss'],
})
export class EventosListaComponent implements OnInit {
  public eventos: Evento[] = [];
  public eventoId = 0;
  public pagination = {} as Pagination;

  modalRef = {} as BsModalRef;
  larguraImg: number = 100;
  margemImg: number = 2;
  mostrarImg: boolean = true;
  exibirImg: boolean = true;

  termoBuscaChanged: Subject<string> = new Subject<string>();

  public filtrarEventos(evt: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged
      .pipe(debounceTime(5000))
      .subscribe((filtrarPor) => {
          this.spinner.show();
          this.eventoService
            .getEventos(
              this.pagination.currentPage,
              this.pagination.itemsPerPage,
              filtrarPor
            )
            .subscribe({
              next: (response: PaginationResult<Evento[]>) => {
                this.eventos = response.result;
                this.pagination = response.pagination;
              },
              error: (error: any) => {
                this.toastr.error('Erro ao buscar Eventos.', 'Erro');
                this.spinner.hide();
              },
            })
            .add(() => this.spinner.hide());
        });
        this.termoBuscaChanged.next(evt.value);
    }
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 4,
      totalItems: 1,
    } as Pagination;

    this.getEventos();
  }

  public alterarImagem() {
    this.mostrarImg = !this.mostrarImg;
    this.exibirImg = this.mostrarImg;
  }

  public mostrarImagem(imagemUrl: string): string {
    return imagemUrl !== ''
      ? `${environment.apiURL}resources/images/${imagemUrl}`
      : 'assets/img/semimagem.jpg';
  }

  public getEventos(): void {
    this.spinner.show();

    this.eventoService
      .getEventos(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe({
        next: (response: PaginationResult<Evento[]>) => {
          this.eventos = response.result;
          this.pagination = response.pagination;
        },
        error: (error: any) => {
          this.toastr.error('Erro ao buscar Eventos.', 'Erro');
          this.spinner.hide();
        },
      })
      .add(() => this.spinner.hide());
  }

  openModal(
    event: any,
    template: TemplateRef<any>,
    temaEvento: string,
    eventoId: number
  ): void {
    event.stopPropagation();

    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.getEventos();
  }

  confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        this.toastr.success('O Evento foi deletado com sucesso.', 'Deletado');
        this.spinner.hide();
        this.getEventos();
      },
      (error: any) => {
        console.log(error);
        this.toastr.error(
          `Erro ao tentar deletar o evento ${this.eventoId}`,
          'Error'
        );
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  decline(): void {
    this.modalRef.hide();
  }

  detalharEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
