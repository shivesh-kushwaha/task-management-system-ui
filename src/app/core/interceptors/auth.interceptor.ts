import { Injectable } from '@angular/core';
import {
    HttpRequest, HttpHandler, HttpEvent, HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../../shared/services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Never intercept the refresh endpoint — infinite loop prevention
        if (this.isRefreshUrl(req.url) || this.isLoginUrl(req.url) || this.isRefreshUrl(req.url)) {
            return next.handle(req);
        }

        // ── Case 1: Access token valid → attach and send ───────────
        if (!this.tokenService.isAccessTokenExpired()) {
            return next.handle(
                this.attachToken(req, this.tokenService.getAccessToken()!)
            );
        }

        // ── Case 2: Access expired, refresh valid → refresh first ──
        // refreshAccessToken() handles: lock, HTTP call, saving tokens,
        // queuing concurrent callers, and forceLogout on failure.
        // Interceptor only needs to retry with the new token it receives.
        if (!this.tokenService.isRefreshTokenExpired()) {
            return this.authService.refreshAccessToken().pipe(
                switchMap(newAccessToken =>
                    next.handle(this.attachToken(req, newAccessToken))
                ),
                catchError(err => throwError(() => err))
                // forceLogout already called inside refreshAccessToken()
            );
        }

        // ── Case 3: Both tokens expired → kill request, force logout ─
        this.authService.logout();
        return throwError(() => new Error('Session expired. Please login again.'));
    }

    private attachToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }

    private isRefreshUrl(url: string): boolean {
        return url.includes('/refreshToken');
    }

    private isLoginUrl(url: string): boolean {
        return url.includes('/login');
    }

    private isRegisterUrl(url: string): boolean {
        return url.includes('/register');
    }

}