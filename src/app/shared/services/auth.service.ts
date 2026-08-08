import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ILoginResponseDto } from '../../core/dtos';
import { AuthLoginDto, ILogoutDto } from '../dtos';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _api = `${environment.apiUrl}/auth`;

  constructor(private readonly _http: HttpClient) { }

  public login(dto: AuthLoginDto): Observable<ILoginResponseDto> {
    return this._http.post<ILoginResponseDto>(`${this._api}/login`, dto);
  }

  public logout(request: ILogoutDto): Observable<any> {
    return this._http.post<any>(`${this._api}/logout`, request);
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}