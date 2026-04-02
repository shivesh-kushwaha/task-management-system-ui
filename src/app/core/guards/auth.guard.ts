import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TokenService } from '../../shared/services/token.service';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService
  ) { }

  canActivate(): Observable<boolean> | boolean {

    console.log(!this.tokenService.isAccessTokenExpired(), !this.tokenService.isRefreshTokenExpired())
    if (!this.tokenService.isAccessTokenExpired()) {
      return true;
    }

    if (!this.tokenService.isRefreshTokenExpired()) {
      return this.authService.refreshAccessToken().pipe(
        map(() => true),
        catchError(() => {
          this.authService.logout();
          return of(false);
        })
      );
    }

    this.authService.logout();
    return false;
  }
}