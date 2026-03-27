import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthLoginDto } from '../dtos';
import { environment } from '../../../../environments/environment';
import { ILoginResponseDto } from '../../../core/dtos';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  login(dto: AuthLoginDto): Observable<ILoginResponseDto> {
    return this.http.post<ILoginResponseDto>(`${this.api}/login`, dto);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}