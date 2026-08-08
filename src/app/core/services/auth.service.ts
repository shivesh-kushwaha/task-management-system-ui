import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ILoginResponseDto } from '../dtos';
import { TokenService } from '../../shared/services/token.service';
import { environment } from '../../../environments/environment';
import { PermissionStore } from '../authorization';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/refreshToken`;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly tokenService: TokenService
  ) { }

  refreshAccessToken(): Observable<ILoginResponseDto> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post<ILoginResponseDto>(`${this.api}?token=${refreshToken}`, {});
  }

  logout(): void {
    this.forceLogout();
  }

  private forceLogout(): void {
    PermissionStore.clearPermissions();
    this.tokenService.clearTokens();
    this.router.navigate(['/auth/login']);
  }
}