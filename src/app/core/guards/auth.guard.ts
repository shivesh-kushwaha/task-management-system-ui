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
    // ← No Router here. authService.logout() owns navigation.
  ) {}

  canActivate(): Observable<boolean> | boolean {

    // ── Case 1: Access token valid → allow immediately ─────────
    if (!this.tokenService.isAccessTokenExpired()) {
      return true;
    }

    // ── Case 2: Access expired, refresh still valid → refresh ──
    // refreshAccessToken() internally checks refresh expiry,
    // owns the lock, saves new tokens, and calls forceLogout()
    // on failure — guard does none of that itself.
    if (!this.tokenService.isRefreshTokenExpired()) {
      return this.authService.refreshAccessToken().pipe(
        map(() => true),       // new token saved → allow navigation
        catchError(() => of(false))
        // forceLogout() already called inside refreshAccessToken()
        // on error — tokens cleared, redirect already triggered
      );
    }

    // ── Case 3: Both tokens expired → delegate logout entirely ─
    this.authService.logout(); // clearTokens + navigate, one place
    return false;
  }
}