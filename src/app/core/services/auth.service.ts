import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ILoginResponseDto } from '../dtos';
import { TokenService } from '../../shared/services/token.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/refreshToken`;

  // ── Single shared refresh lock ───────────────────────────────
  // Both AuthGuard and AuthInterceptor call refreshAccessToken().
  // This lock ensures only ONE HTTP call is made even when both
  // fire at the same moment (e.g. page load with expired token).
  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly tokenService: TokenService
  ) {}

  // ── Refresh ──────────────────────────────────────────────────
  // Returns Observable<string> — emits the new access token.
  // Callers never touch isRefreshing or refreshSubject directly.
  refreshAccessToken(): Observable<string> {
    const refreshToken = this.tokenService.getRefreshToken();

    // Fail fast if refresh token is missing or already expired
    if (!refreshToken || this.tokenService.isRefreshTokenExpired()) {
      this.forceLogout();
      return throwError(() => new Error('Session expired. Please login again.'));
    }

    // If a refresh is already in progress, queue this caller —
    // it will receive the new token once the in-flight call completes
    if (this.isRefreshing) {
      return this.refreshSubject.pipe(
        filter((token): token is string => token !== null),
        take(1)
      );
    }

    // Start the refresh flow
    this.isRefreshing = true;
    this.refreshSubject.next(null); // block any queued callers

    return this.http
      .post<ILoginResponseDto>(`${this.api}?token=${refreshToken}`, {})
      .pipe(
        tap(response => {
          // ── Save tokens here, once, never in callers ─────────
          this.tokenService.setTokens(response.accessToken, response.refreshToken);
          this.refreshSubject.next(response.accessToken); // unblock queue
        }),
        switchMap(response =>
          // Emit just the access token string so callers are simple
          new Observable<string>(obs => {
            obs.next(response.accessToken);
            obs.complete();
          })
        ),
        catchError(err => {
          // Refresh endpoint returned 4xx / network failed
          this.forceLogout();
          return throwError(() => err);
        }),
        finalize(() => {
          this.isRefreshing = false; // always reset
        })
      );
  }

  // ── Public logout entry point ────────────────────────────────
  logout(): void {
    this.forceLogout();
  }

  // ── Single place that clears state and redirects ─────────────
  private forceLogout(): void {
    this.tokenService.clearTokens();       // wipe localStorage first
    this.isRefreshing = false;             // reset lock
    this.refreshSubject.next(null);        // unblock any stuck queue
    this.router.navigate(['/auth/login']); // then navigate
  }
}