import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, tap } from 'rxjs';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.scss']
})
export class PalestranteDetalheComponent implements OnInit {
  public form!: FormGroup;
  public situacaoForm = '';
  public corDescricao = '';


  constructor(
    private fb: FormBuilder,
    public palestranteService: PalestranteService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.validation();
    this.verificaForm();
  }

  private validation(): void{
    this.form = this.fb.group({
      miniCurriculo: ['']
    });
  }

  private verificaForm(): void{
    this.form.valueChanges
    .pipe(
      map(() => {
        this.situacaoForm = 'Minicurriculo está sendo Atualizado';
        this.corDescricao = 'text-warning';
      }),
      debounceTime(1000),
      tap(() => this.spinner.show())
    ).subscribe(
      () => {
        this.palestranteService.put({...this.form.value})
        .subscribe(
          () => {
            this.situacaoForm = 'Minicurriculo foi atualizado';
            this.corDescricao = 'text-success';
          },
          (error) => {
            this.toastr.error('Erro ao tentar atualizar Palestrante.', 'Erro');
            console.log(error);
          }
        ).add(() => this.spinner.hide());

      }
      )
  }

  public get f(): any{
    return this.form.controls;
  }
}
