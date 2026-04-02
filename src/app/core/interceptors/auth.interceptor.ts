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

        if (this.isRefreshUrl(req.url) || this.isLoginUrl(req.url) || this.isRegisterUrl(req.url)) {
            return next.handle(req);
        }

        if (!this.tokenService.isAccessTokenExpired()) {
            return next.handle(
                this.attachToken(req, this.tokenService.getAccessToken()!)
            );
        }

        if (!this.tokenService.isRefreshTokenExpired()) {
            return this.authService.refreshAccessToken().pipe(
                switchMap(newAccessToken =>
                    next.handle(this.attachToken(req, newAccessToken))
                ),
                catchError(err => {
                    this.authService.logout(); // ← missing this
                    return throwError(() => err);
                })
            );
        }

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