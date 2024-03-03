import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import { UserService } from '@app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  userUpdate = {} as UserUpdate;
  constructor(
  ) {}

  ngOnInit(): void {
  }

  public setFormValue(usuario: UserUpdate): void{
    console.log(usuario);
    this.userUpdate = usuario;
  }

  // Conveniente para pegar um FormField apenas com a letra F
  get f(): any {
    return '';
  }

  public get isPalestrante(): boolean{
    return this.userUpdate.funcao === 'Palestrante';
  }
}
