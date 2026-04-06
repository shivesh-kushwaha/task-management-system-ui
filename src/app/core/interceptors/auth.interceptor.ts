import { Injectable } from '@angular/core';
import {
    HttpRequest, HttpHandler, HttpEvent, HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../../shared/services/token.service';
import { ILoginResponseDto } from '../dtos';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService,
        private readonly loadingService: LoadingService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Skip loading for auth URLs
        if (this.isRefreshUrl(req.url) || this.isLoginUrl(req.url) || this.isRegisterUrl(req.url)) {
            return next.handle(req);
        }

        // Check if token is expired
        if (!this.tokenService.isAccessTokenExpired()) {
            this.loadingService.show();
            return next.handle(this.attachToken(req, this.tokenService.getAccessToken()!)).pipe(
                finalize(() => this.loadingService.hide())
            );
        }

        // Token expired, try refresh
        if (this.tokenService.getRefreshToken()) {
            this.loadingService.show();
            return this.authService.refreshAccessToken().pipe(
                switchMap((response: ILoginResponseDto) => {
                    this.tokenService.setTokens(response.accessToken, response.refreshToken);
                    return next.handle(this.attachToken(req, response.accessToken));
                }),
                catchError(err => {
                    this.authService.logout();
                    return throwError(() => err);
                }),
                finalize(() => this.loadingService.hide())
            );
        }

        // No refresh token available - session expired
        this.authService.logout();
        return throwError(() => new Error('Session expired.'));
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