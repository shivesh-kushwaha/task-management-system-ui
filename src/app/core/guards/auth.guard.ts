import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TokenService } from '../../shared/services/token.service';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
    private readonly _toastr: ToastrService
  ) { }

  canActivate(): Observable<boolean> | boolean {

    if (!this.tokenService.isAccessTokenExpired()) {
      return true;
    }

    return this.authService.refreshAccessToken().pipe(
      map(() => true),
      catchError(() => {
        this.authService.logout();
        return of(false);
      })
    );
  }
}