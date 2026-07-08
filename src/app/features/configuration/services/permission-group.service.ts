// permission.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IUpsertPermissionGroupDto } from '../dtos/permission/upsert-permission-group.dto';
import { ISelectListItemDto } from '../../../shared/dtos';

@Injectable()
export class PermissionGroupService {
    private readonly api = `${environment.apiUrl}/permissionGroup`;

    constructor(private readonly _http: HttpClient) { }

    public upsertPermissionGroup(payload: IUpsertPermissionGroupDto): Observable<any> {
        return this._http.post(`${this.api}`, payload);
    }

    public getPermissionGroupListItem(): Observable<ISelectListItemDto[]> {
        return this._http.get<ISelectListItemDto[]>(`${this.api}/select-list-item`);
    }
}