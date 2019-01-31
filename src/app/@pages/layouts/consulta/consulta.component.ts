import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RootLayout } from '../root/root.component';

declare var pg: any;

@Component({
  selector: 'app-consulta-component',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConsultaComponent extends RootLayout implements OnInit {

  ngOnInit() {
    pg.isHorizontalLayout = true;
    this.changeLayout('horizontal-menu');
    this.changeLayout('horizontal-app-menu');
  }

}

