import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs/observable/interval';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as moment from 'moment';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(null);
  private stopTaking: Subject<any> = new Subject();
  private checkSession = interval(60000); // intervalo de tiempo para checar cookie cada minuto;


  constructor(private _cookieService: CookieService) {

    if (environment.createFakeCookie) {
      const expirationDate = moment(new Date()).add(1, 'minute').toDate();
      this._cookieService.set('cgiAuthCookie', 'allowAcces:true', expirationDate, '/');
      this._cookieService.set('cgiAuthCookie', 'allowAcces:true', expirationDate, '/');
    }


    this.checkSession.takeUntil(this.stopTaking).subscribe(() => {
      this.checkCookieValidity();
    });


    this.checkCookieValidity();

  }


  checkCookieValidity() {

    console.log('entrando');

    if (this._cookieService.check('cgiAuthCookie')) {

      if (!this.loggedIn.getValue()) {
        this.loggedIn.next(true);
      }

    } else {
      console.log('no cookie or cookie invalid ===>');
      this.loggedIn.next(false);
      this.stopTaking.next();
    }

  }

  isSessionActive(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

}
