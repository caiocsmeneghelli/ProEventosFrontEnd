import { Component, OnInit } from '@angular/core';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import { UserService } from '@app/services/user.service';
import { environment } from '@enviroments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  public userUpdate = {} as UserUpdate;
  public imagemUrl = '';
  public file: File;

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  public setFormValue(usuario: UserUpdate): void {
    this.userUpdate = usuario;
    if(this.userUpdate.imagemURL){
      this.imagemUrl = environment.apiURL + `resources/perfil/${this.userUpdate.imagemURL}`;
    }else{
      this.imagemUrl = './assets/img/perfil.png';
    }
    console.log(usuario);
  }

  public get isPalestrante(): boolean {
    return this.userUpdate.funcao === 'Palestrante';
  }

  public onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => (this.imagemUrl = event.target.result);

    this.file = ev.target.files[0];
    reader.readAsDataURL(this.file);

    this.uploadImagem();
  }

  private uploadImagem(): void {
    this.spinner.show();
    this.userService
      .postUpload(this.file)
      .subscribe(
        () => this.toastr.success('Imagem atualizada com Sucesso.', 'Sucesso'),
        (error: any) => {
          this.toastr.error('Erro ao realizar upload de imagem.', 'Erro');
          console.error(error);
        }
      )
      .add(() => this.spinner.hide());
  }
}
