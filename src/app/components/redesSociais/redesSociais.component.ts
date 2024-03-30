import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RedeSocial } from '@app/models/RedeSocial';
import { RedeSocialService } from '@app/services/redeSocial.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-redesSociais',
  templateUrl: './redesSociais.component.html',
  styleUrls: ['./redesSociais.component.scss'],
})
export class RedesSociaisComponent implements OnInit {
  modalRef: BsModalRef;
  @Input() eventoId = 0;
  public formRS: FormGroup;
  public redeSocialAtual = { id: 0, nome: '', indice: 0 };

  constructor(
    private fb: FormBuilder,
    private redeSocialService: RedeSocialService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.validation();
    if (this.eventoId === 0) {
      this.carregarRedesSociais('palestrante');
    } else {
      this.carregarRedesSociais('evento', this.eventoId);
    }
  }

  private carregarRedesSociais(origem: string, id: number = 0): void {
    this.spinner.show();

    this.redeSocialService.getRedesSociais(origem, id).subscribe(
      (redesSociaisRetorno: RedeSocial[]) => {
        redesSociaisRetorno.forEach((redeSocial) => {
          this.redesSociais.push(this.criarRedeSocial(redeSocial));
        });
      },
      (error: any) => {
        this.toastr.error('Erro ao tentar buscar Redes Sociais', 'Erro');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

  public get redesSociais(): FormArray {
    return this.formRS.get('redesSociais') as FormArray;
  }

  public validation(): void {
    this.formRS = this.fb.group({
      redesSociais: this.fb.array([]),
    });
  }

  public adicionarRedeSocial(): void {
    this.redesSociais.push(this.criarRedeSocial({ id: 0 } as RedeSocial));
  }

  public criarRedeSocial(redeSocial: RedeSocial): FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required],
    });
  }

  public retornaTitulo(nome: string): string {
    return nome == null || nome == '' ? 'Rede Social' : nome;
  }

  public cssValidator(campoForm: FormControl | AbstractControl | null): any {
    return { 'is-invalid': campoForm?.errors && campoForm?.touched };
  }

  public removerRedeSocial(template: TemplateRef<any>, indice: number): void {
    this.redeSocialAtual.id = this.redesSociais.get(indice + '.id')?.value;
    this.redeSocialAtual.nome = this.redesSociais.get(indice + '.nome')?.value;
    this.redeSocialAtual.indice = indice;

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public salvarRedesSociais(): void {
    let origem = this.eventoId !== 0 ? 'evento' : 'palestrante';

    if (this.formRS.controls['redesSociais'].valid) {
      this.spinner.show();
      this.redeSocialService
        .saveRedesSociais(origem, this.eventoId, this.formRS.value.redesSociais)
        .subscribe(
          () =>
            this.toastr.success('Redes Sociais salvas com sucesso.', 'Sucesso'),
          (error: any) => {
            this.toastr.error('Erro ao tentar salvar Redes Sociais.', 'Erro');
            console.error(error);
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  public confirmDeleteRedeSocial(): void {
    let origem = this.eventoId !== 0 ? 'evento' : 'palestrante';

    this.modalRef.hide();
    this.spinner.show();

    if(this.redeSocialAtual.id == null){
      this.redesSociais.removeAt(this.redeSocialAtual.indice);
      this.toastr.success('Rede Social removida com sucesso.', 'Success');
    }

    this.redeSocialService
      .deleteRedeSocial(origem, this.eventoId, this.redeSocialAtual.id)
      .subscribe(
        () => {
          this.toastr.success('Rede Social removida com sucesso.', 'Success');
          this.redesSociais.removeAt(this.redeSocialAtual.indice);
        },
        (error: any) => {
          this.toastr.error(
            `Erro ao tentar deletar a Rede Social ${this.redeSocialAtual.nome}`,
            'Erro'
          );
          console.log(error);
        }
      )
      .add(() => this.spinner.hide());
  }

  public declineDeleteRedeSocial(): void {
    this.modalRef.hide();
  }
}
