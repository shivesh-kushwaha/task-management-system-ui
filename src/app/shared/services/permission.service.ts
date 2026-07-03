import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IGetPermissionListByUserIdDto } from '../dtos';
import { environment } from '../../../environments/environment';
import { AuthorizationStore } from '../../core/authorization';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    private readonly _api = `${environment.apiUrl}/permission`;

    constructor(private readonly _http: HttpClient) { }

    private _getListItem(): Observable<Array<IGetPermissionListByUserIdDto>> {
        return this._http.get<Array<IGetPermissionListByUserIdDto>>(`${this._api}`);
    }

    public loadAndStorePermissions(): Observable<Array<IGetPermissionListByUserIdDto>> {
        return this._getListItem().pipe(
            tap((response) => {
                const permissionCodes = response.map(x => x.code);
                AuthorizationStore.setPermissions(permissionCodes);
            })
        );
    }
}