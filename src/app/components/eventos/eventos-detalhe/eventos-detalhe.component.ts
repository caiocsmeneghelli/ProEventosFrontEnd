import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-eventos-detalhe',
  templateUrl: './eventos-detalhe.component.html',
  styleUrls: ['./eventos-detalhe.component.scss']
})
export class EventosDetalheComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({});
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.validation();
  }

  public validation(): void{
    this.form = new FormGroup({
      tema: new FormControl(),
      local: new FormControl(),
      dataEvento: new FormControl(),
      qtdPessoas: new FormControl(),
      imagemURL: new FormControl(),
      telefone: new FormControl(),
      email: new FormControl()
    })
  }
}
