import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs/observable/interval';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as moment from 'moment';
import { environment } from '../../environments/environment';
import { AuthModel } from '../../models/auth.model';

@Injectable()
export class AuthService {

  private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(null);
  private authInfo: BehaviorSubject<AuthModel> = new BehaviorSubject(null);
  private stopTaking: Subject<any> = new Subject();
  private checkSession = interval(60000);


  constructor(private _cookieService: CookieService) {

    if (environment.createFakeCookie) {
      const expirationDate = moment(new Date()).add(1, 'minute').toDate();
      this._cookieService.set('cgiAuthCookie'
        , '[{%22Id%22:%223002%22%2C%22Nombre%22:%22CELAYA%22%2C%22Rol%22:%22TIENDA%22%2C%22Marca%22:%2230%22%2C%22Comprador%22:%220%22}]'
        , expirationDate, '/');
    }

    this.checkSession.takeUntil(this.stopTaking).subscribe(() => {
      this.checkCookieValidity();
    });
    this.checkCookieValidity();
  }

  checkCookieValidity() {

    try {
      if (this._cookieService.check('cgiAuthCookie')) {
        if (!this.isLoggedIn.getValue()) {
          const authInfo = JSON.parse(
            decodeURIComponent(this._cookieService.get('cgiAuthCookie'))
          );

          this.authInfo.next(authInfo);
          this.isLoggedIn.next(true);
        }

      } else {
        console.log('no cookie or cookie invalid ===>');
        this.isLoggedIn.next(false);
        this.stopTaking.next();
      }
    } catch (e) {
      console.log('Error al procesar Cookie Auth =>', e);
      this.isLoggedIn.next(false);
      this.authInfo.next(null);
      this.stopTaking.next();
    }

  }

  isSessionActive(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  getLoggedInInfo = (): AuthModel => this.authInfo.getValue();


}
