import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthLoginDto } from '../dtos';
import { LoginResponseDto } from '../../../shared/dtos';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  login(dto: AuthLoginDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.api}/login`, dto);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}