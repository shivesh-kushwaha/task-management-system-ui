import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IGetRolePagedListDto, IUpsertRoleDto } from '../dtos';
import { IPagedListRequestDto, IPagedListResponseDto, ISelectListItemDto, toQueryString } from '../../../shared/dtos';

@Injectable()
export class RoleService {
    private readonly api = `${environment.apiUrl}/role`;

    constructor(private readonly _http: HttpClient) { }

    public getPagedList(request: IPagedListRequestDto): Observable<IPagedListResponseDto<IGetRolePagedListDto>> {
        const params = toQueryString(request);
        return this._http.get<IPagedListResponseDto<IGetRolePagedListDto>>(`${this.api}/paged-list?${params}`);
    }

    public getListItem(): Observable<ISelectListItemDto[]> {
        return this._http.get<ISelectListItemDto[]>(`${this.api}/select-list-item`);
    }

    public upsert(payload: IUpsertRoleDto): Observable<any> {
        return this._http.post(this.api, payload);
    }
}