import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddUserDto } from '../../auth/dtos/add-user.dto';
import { environment } from '../../../../environments/environment';
import { IPagedListRequestDto, IPagedListResponseDto, toQueryString } from '../../../shared/dtos';
import { IGetUserPagedListDto, IGetWorkItemListByIdDto, IUpdateUserDto } from '../dtos';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly _api = `${environment.apiUrl}/user`;

    constructor(private readonly _http: HttpClient) { }

    public register(dto: AddUserDto): Observable<void> {
        return this._http.post<void>(`${this._api}/register`, dto);
    }

    public getPagedList(request: IPagedListRequestDto): Observable<IPagedListResponseDto<IGetUserPagedListDto>> {
        const params = toQueryString(request);
        return this._http.get<IPagedListResponseDto<IGetUserPagedListDto>>(`${this._api}/paged-list?${params}`);
    }

    public getWorkItemListById(id: number): Observable<IGetWorkItemListByIdDto[]> {
        return this._http.get<IGetWorkItemListByIdDto[]>(`${this._api}/work-item-list/${id}`);
    }
 
    public updateUser(payload: IUpdateUserDto): Observable<void> {
        return this._http.put<void>(`${this._api}`, payload);
    }

    public delete(id: number): Observable<void> {
        return this._http.delete<void>(`${this._api}/${id}`);
    }
}