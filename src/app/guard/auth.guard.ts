import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _cookieService: CookieService, private _authService: AuthService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._authService.isSessionActive();
  }

}
