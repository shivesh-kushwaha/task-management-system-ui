import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    IAddWorkItemDto,
    IGetWorkItemByIdDto,
    IGetWorkItemPagedListDto,
    IPagedListRequestDto,
    IPagedListResponseDto,
    ISelectListItemDto,
    IUpdateWorkItemDto,
    toWorkItemQueryString
} from '../dtos';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WorkItemService {
    private readonly _api = `${environment.apiUrl}/workItem`;

    constructor(private readonly _http: HttpClient) { }

    public addWorkItem(payload: IAddWorkItemDto): Observable<any> {
        return this._http.post(`${this._api}`, payload);
    }

    public getPagedList(request: IPagedListRequestDto): Observable<IPagedListResponseDto<IGetWorkItemPagedListDto>> {
        const params = toWorkItemQueryString(request);
        return this._http.get<IPagedListResponseDto<IGetWorkItemPagedListDto>>(`${this._api}/paged-list?${params}`);
    }

    public getListItem(): Observable<Array<ISelectListItemDto>> {
        return this._http.get<Array<ISelectListItemDto>>(`${this._api}/select-list-item`);
    }

    public getById(id: number): Observable<IGetWorkItemByIdDto> {
        return this._http.get<IGetWorkItemByIdDto>(`${this._api}/${id}`);
    }

    public updateWorkItem(payload: IUpdateWorkItemDto): Observable<any> {
        return this._http.put(`${this._api}`, payload);
    }

    public deleteWorkItem(id: number): Observable<any> {
        return this._http.delete(`${this._api}/${id}`);
    }

}