import { Component, Input, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit(): void {
  }

}
