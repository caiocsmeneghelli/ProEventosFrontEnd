import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';

@Component({
  selector: 'app-eventos-lista',
  templateUrl: './eventos-lista.component.html',
  styleUrls: ['./eventos-lista.component.scss'],
})
export class EventosListaComponent implements OnInit {
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public eventoId = 0;
  public temaEvento = '';

  modalRef = {} as BsModalRef;
  larguraImg: number = 50;
  margemImg: number = 2;
  mostrarImg: boolean = true;
  exibirImg: boolean = true;

  private _filtroLista: string = '';

  public get filtroLista() {
    return this._filtroLista;
  }
  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: Evento) =>
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
  }

  public alterarImagem() {
    this.mostrarImg = !this.mostrarImg;
    this.exibirImg = this.mostrarImg;
  }
  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (response: Evento[]) => {
        this.eventos = response;
        this.eventosFiltrados = response;
      },
      error: (error: any) => {
        this.toastr.error('Erro ao buscar Eventos.', 'Erro');
        this.spinner.hide();
      },
      complete: () => this.spinner.hide(),
    });
  }

  openModal(
    event: any,
    template: TemplateRef<any>,
    temaEvento: string,
    eventoId: number
  ): void {
    event.stopPropagation();

    this.eventoId = eventoId;
    this.temaEvento = temaEvento;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        console.log(result);
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
