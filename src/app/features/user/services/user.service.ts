import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddUserDto } from '../dtos/add-user.dto';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private api = `${environment.apiUrl}/user`;

    constructor(private readonly http: HttpClient) { }

    public register(dto: AddUserDto): Observable<void> {
        return this.http.post<void>(`${this.api}/register`, dto);
    }
}