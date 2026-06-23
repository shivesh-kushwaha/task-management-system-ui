import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ISelectListItemDto } from '../../../shared/dtos';

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private readonly _apiUrl = `${environment.apiUrl}/role`;

    constructor(private readonly _http: HttpClient) { }

    public getListItem(): Observable<ISelectListItemDto[]> {
        return this._http.get<ISelectListItemDto[]>(`${this._apiUrl}/select-list-item`);
    }

    public getAllRoles(): Observable<any[]> {
        return this._http.get<any[]>(`${this._apiUrl}`);
    }

    public getRoleById(id: number): Observable<any> {
        return this._http.get<any>(`${this._apiUrl}/${id}`);
    }
}