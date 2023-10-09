import { Component, OnInit } from '@angular/core';
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
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
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
  evento = {} as Evento;
  eventoId: number = 0;
  estadoSalvar = 'post' as string;

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
  constructor(
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private loteService: LoteService
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
        },
        error: (error: any) => {
          console.error(error);
          this.toastr.error('Erro ao tentar carregar evento.', 'Erro!');
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    }
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
      imagemURL: ['', Validators.required],
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
    this.spinner.show();
    if(this.form.controls['lotes'].valid){
      console.log(this.form.value.lotes);
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
      this.spinner.hide();
    }
  }
}
