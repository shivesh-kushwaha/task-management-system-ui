// permission.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IAddPermissionDto, IGetPermissionGroupedListByRoleIdDto, IUpdatePermissionsDto } from '../dtos';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class PermissionService {
    private readonly api = `${environment.apiUrl}/permission`;

    constructor(private readonly _http: HttpClient) { }

    public getGroupedByRoleId(roleId: number): Observable<IGetPermissionGroupedListByRoleIdDto[]> {
        return this._http.get<IGetPermissionGroupedListByRoleIdDto[]>(`${this.api}/grouped-list/${roleId}`);
    }

    public addPermission(payload: IAddPermissionDto): Observable<any> {
        return this._http.post(this.api, payload);
    }
}