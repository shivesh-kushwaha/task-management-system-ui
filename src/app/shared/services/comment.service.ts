import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddCommentDto, IGetCommentPagedListDto, IGetCommentPagedListRequestDto, IPagedListResponseDto, IUpdateCommentDto, toCommentQueryString } from '../dtos';
import { environment } from '../../../environments/environment';

@Injectable()
export class CommentService {
    private readonly _api = `${environment.apiUrl}/comment`;

    constructor(private readonly _http: HttpClient) { }

    public add(request: IAddCommentDto): Observable<any> {
        return this._http.post(`${this._api}`, request);
    }

    public getPagedList(request: IGetCommentPagedListRequestDto): Observable<IPagedListResponseDto<IGetCommentPagedListDto>> {
        const params = toCommentQueryString(request);
        return this._http.get<IPagedListResponseDto<IGetCommentPagedListDto>>(`${this._api}/paged-list?${params}`);
    }

    public update(request: IUpdateCommentDto): Observable<any> {
        return this._http.put(`${this._api}`, request);
    }

    public delete(id: number): Observable<any> {
        return this._http.delete(`${this._api}/${id}`);
    }
}