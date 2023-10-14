import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { environment } from '@enviroments/environment';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-eventos-detalhe',
  templateUrl: './eventos-detalhe.component.html',
  styleUrls: ['./eventos-detalhe.component.scss'],
})
export class EventosDetalheComponent implements OnInit {
  form!: FormGroup;
  modalRef= {} as BsModalRef;
  evento = {} as Evento;
  eventoId: number = 0;
  estadoSalvar = 'post' as string;
  loteAtual = {id: 0, nome: "", index: 0};
  imagemUrl = 'assets/img/upload.jpg';
  file!: File;

  get modoEditar() : boolean{
    return this.estadoSalvar === 'put';
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY HH:mm',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  get bsConfigLote(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private loteService: LoteService,
    private modalService: BsModalService
  ) {
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {
    const eventoIdParam = this.activatedRouter.snapshot.paramMap.get('id');
    this.eventoId = eventoIdParam !== null ? +eventoIdParam : 0;

    if (this.eventoId !== 0) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      // +this.eventoId -> transforma em number
      this.eventoService.getEventoById(this.eventoId).subscribe({
        next: (evento: Evento) => {
          // this.evento = Object.assign({}, evento);
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
          // this.carregarLotes();

          if(this.evento.imagemURL != ''){
            this.imagemUrl = environment.apiURL + 'resources/images/' + this.evento.imagemURL;
          }
          this.renderLotes(this.evento);
        },
        error: (error: any) => {
          console.error(error);
          this.toastr.error('Erro ao tentar carregar evento.', 'Erro!');
        },
        // complete: () => {
        //   this.spinner.hide();
        // },
      }).add(() => this.spinner.hide());
    }
  }

  // forma de fazer buscando no backend
  public carregarLotes() : void{
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotesRetorno: Lote[]) => {
        lotesRetorno.forEach(lote => {
          this.lotes.push(this.criarLote(lote));
        });
      },
      (error: any) => {
        this.toastr.error('Erro ao tentar buscar lotes', 'Erro');
        console.log(error);
      }
    ).add(() => this.spinner.hide());
  }

  public renderLotes(evento: Evento){
    evento.lotes.forEach(lote => {
      this.lotes.push(this.criarLote(lote));
    });
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void {
    this.form = this.formBuilder.group({
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: [''],
      lotes: this.formBuilder.array([]),
    });
  }

  adicionarLote(): void {
    this.lotes.push(this.criarLote({id:0} as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.formBuilder.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio, Validators.required],
      dataFim: [lote.dataFim, Validators.required],
    });
  }

  public mudarValorData(value: Date, i: number, campo: string) : void{
    this.lotes.value[i][campo] = value;
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl | null): any {
    return { 'is-invalid': campoForm?.errors && campoForm?.touched };
  }

  public salvarEvento(): void {
    this.spinner.show();
    if (this.form.valid) {
      let service = {} as Observable<Evento>;

      if (this.estadoSalvar === 'post') {
        this.evento = { ...this.form.value };
        service = this.eventoService.post(this.evento);
      } else {
        this.evento = { id: this.evento.id, ...this.form.value };
        service = this.eventoService.put(this.evento);
      }

      service.subscribe(
        (eventoRetorno: Evento) => {
          this.toastr.success('Evento salvo com sucesso.', 'Sucesso');
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
        },
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Erro ao salvar evento.', 'Erro');
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  public salvarLotes(): void{
    if(this.form.controls['lotes'].valid){
      this.spinner.show();
      this.loteService.saveLotes(this.eventoId, this.form.value.lotes)
      .subscribe(
        () => {
          this.toastr.success('Lotes salvos com Sucesso', 'Sucesso');
          this.lotes.reset();
        },
        (error: any) => {
          this.toastr.error('Error ao tentar salvar lotes.', 'Erro');
          console.error(error);
        }
      ).add(() => this.spinner.hide());
    }
  }

  public removerLote(template: TemplateRef<any>, index: number): void{
    this.loteAtual.id = this.lotes.get(index + '.id')?.value;
    this.loteAtual.nome = this.lotes.get(index + '.nome')?.value;
    this.loteAtual.index = index;

    this.modalRef = this.modalService.show(template, {class:'modal-sm'});
  }

  public confirmDeleteLote(): void{
    this.modalRef.hide();
    this.spinner.show();

    console.log(this.eventoId, this.loteAtual.id);
    this.loteService.deleteLote(this.eventoId, this.loteAtual.id).subscribe(
      () => {
        this.toastr.success("Lote " + this.loteAtual.nome + " excluído.", "Sucesso");
        this.lotes.removeAt(this.loteAtual.index);
      },
      (error: any) => {
        this.toastr.error("Falha ao excluir lote.", "Erro");
        console.log(error);
      }
    ).add(() => this.spinner.hide())
  }

  public declineDeleteLote(): void{
    this.modalRef.hide();
  }

  public retornaTituloLote(control: string): string{
    return control === null || control === '' ? 'Nome do Lote'
      : control;
  }

  public onFileChange(ev: any): void{
    const reader = new FileReader();

    reader.onload = (event:any ) => this.imagemUrl = event.target.result;

    this.file = ev.target.files[0];
    reader.readAsDataURL(this.file);

    this.uploadImagem();
  }

  private uploadImagem(): void{
    this.spinner.show();

    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      () => {
        this.carregarEvento();
        this.toastr.success('Imagem atualizada.', "Sucesso");
      },
      (erro: any) => {
        this.toastr.error("Erro ao atualizar imagem.", "Erro");
        console.log(erro);
      },
    ).add(() => this.spinner.hide());
  }


}
