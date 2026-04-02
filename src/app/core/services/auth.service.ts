import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ILoginResponseDto } from '../dtos';
import { TokenService } from '../../shared/services/token.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/refreshToken`;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly tokenService: TokenService
  ) { }

  refreshAccessToken(): Observable<string> {
    const refreshToken = this.tokenService.getRefreshToken();

    return this.http
      .post<ILoginResponseDto>(`${this.api}`, { refreshToken })
      .pipe(
        tap(response => {
          this.tokenService.setTokens(response.accessToken, response.refreshToken);
        }),
        map(response => response.accessToken),
        catchError(err => {
          this.forceLogout();
          return throwError(() => err);
        })
      );
  }

  logout(): void {
    this.forceLogout();
  }

  private forceLogout(): void {
    this.tokenService.clearTokens();
    this.router.navigate(['/auth/login']);
  }
}