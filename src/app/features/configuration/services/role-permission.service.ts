// permission.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IUpsertRolePermissionDto } from '../dtos/permission/upsert-role-permission.dto';

@Injectable()
export class RolePermissionService {
    private readonly api = `${environment.apiUrl}/rolePermission`;

    constructor(private readonly _http: HttpClient) { }

    public upsert(payload: IUpsertRolePermissionDto): Observable<any> {
        return this._http.post(this.api, payload);
    }
}