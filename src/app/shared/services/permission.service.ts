import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGetPermissionListByUserIdDto } from '../dtos';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    private readonly _api = `${environment.apiUrl}/permission`;

    constructor(private readonly _http: HttpClient) { }

    public getListItem(): Observable<Array<IGetPermissionListByUserIdDto>> {
        return this._http.get<Array<IGetPermissionListByUserIdDto>>(`${this._api}`);
    }
}