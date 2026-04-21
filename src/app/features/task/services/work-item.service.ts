import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IPagedListRequestDto, toQueryString } from '../../../shared/dtos/paged-list-request.dto';
import { IPagedListResponseDto, ISelectListItemDto } from '../../../shared/dtos';
import { IGetWorkItemPagedListDto } from '../dtos/get-work-item-paged-list.dto';
import { IAddWorkItemDto } from '../dtos';
import { IUpdateWorkItemDto } from '../dtos/update-work-item.dto';
import { IGetWorkItemByIdDto } from '../dtos/get-work-item-by-id.dto';

@Injectable({
    providedIn: 'root'
})
export class WorkItemService {
    private readonly _api = `${environment.apiUrl}/workItem`;

    constructor(private readonly _http: HttpClient) { }

    public addTask(payload: IAddWorkItemDto): Observable<any> {
        return this._http.post(`${this._api}`, payload);
    }

    public getPagedList(request: IPagedListRequestDto): Observable<IPagedListResponseDto<IGetWorkItemPagedListDto>> {
        const params = toQueryString(request);
        return this._http.get<IPagedListResponseDto<IGetWorkItemPagedListDto>>(`${this._api}/paged-list?${params}`);
    }

    public getListItem(): Observable<Array<ISelectListItemDto>> {
        return this._http.get<Array<ISelectListItemDto>>(`${this._api}/select-list-item`);
    }

    public getById(id: number): Observable<IGetWorkItemByIdDto> {
        return this._http.get<IGetWorkItemByIdDto>(`${this._api}/${id}`);
    }

    public updateTask(payload: IUpdateWorkItemDto): Observable<any> {
        return this._http.put(`${this._api}`, payload);
    }

    public deleteWorkItem(id: number): Observable<any> {
        return this._http.delete(`${this._api}/${id}`);
    }
}