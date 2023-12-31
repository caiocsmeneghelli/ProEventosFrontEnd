import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {
  @Input() titulo = '';
  @Input() subtitulo = 'Desde 2023';
  @Input() iconClass = 'fa fa-user';
  @Input() botaoListar = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  listar():void{
    this.router.navigate([`/${this.titulo.toLocaleLowerCase()}/lista`]);
  }
}
