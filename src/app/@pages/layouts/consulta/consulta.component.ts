import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RootLayout } from '../root/root.component';
import { pagesToggleService } from '../../services/toggler.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


declare var pg: any;

@Component({
  selector: 'app-consulta-component',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConsultaComponent extends RootLayout implements OnInit {

  constructor(public _toggler: pagesToggleService
    , private _router: Router
    , private _cookieService: CookieService) {
    super(_toggler, _router);

  }

  ngOnInit() {
    pg.isHorizontalLayout = true;
    this.changeLayout('horizontal-menu');
    this.changeLayout('horizontal-app-menu');




  }

}

