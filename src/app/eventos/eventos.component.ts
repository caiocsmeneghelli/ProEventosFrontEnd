import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Evento } from '../models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
  providers: [EventoService]
})
export class EventosComponent implements OnInit {

  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];

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

  constructor(private eventoService: EventoService,
    private modalService: BsModalService) {}

  public ngOnInit(): void {
    this.getEventos();
  }

  public alterarImagem() {
    this.mostrarImg = !this.mostrarImg;
    this.exibirImg = this.mostrarImg;
  }
  public getEventos(): void {
    this.eventoService.getEventos().subscribe(
      (response: Evento[]) => {
        this.eventos = response;
        this.eventosFiltrados = response;
      },
      (error) => console.log(error)
    );
  }

  openModal(template: TemplateRef<any>): void{
    this.modalRef = this.modalService.show(template, {class:'modal-sm'});
  }

  confirm(): void{
    this.modalRef.hide();
  }

  decline(): void{
    this.modalRef.hide();
  }
}
