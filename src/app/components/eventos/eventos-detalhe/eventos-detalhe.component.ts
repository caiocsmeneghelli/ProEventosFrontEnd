import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-eventos-detalhe',
  templateUrl: './eventos-detalhe.component.html',
  styleUrls: ['./eventos-detalhe.component.scss'],
})
export class EventosDetalheComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({});
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.validation();
  }

  public validation(): void {
    this.form = new FormGroup({
      tema: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
      ]),
      local: new FormControl('', Validators.required),
      dataEvento: new FormControl('', Validators.required),
      qtdPessoas: new FormControl('', [
        Validators.required,
        Validators.max(120000),
      ]),
      telefone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      imagemURL: new FormControl('', Validators.required),
    });
  }
}
