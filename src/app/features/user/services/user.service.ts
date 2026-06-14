import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddUserDto } from '../../auth/dtos/add-user.dto';
import { environment } from '../../../../environments/environment';
import { IPagedListRequestDto, IPagedListResponseDto, toQueryString } from '../../../shared/dtos';
import { IGetUserPagedListDto, IGetWorkItemListByIdDto } from '../dtos';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private api = `${environment.apiUrl}/user`;

    constructor(private readonly http: HttpClient) { }

    public register(dto: AddUserDto): Observable<void> {
        return this.http.post<void>(`${this.api}/register`, dto);
    }

    public getPagedList(request: IPagedListRequestDto): Observable<IPagedListResponseDto<IGetUserPagedListDto>> {
        const params = toQueryString(request);
        return this.http.get<IPagedListResponseDto<IGetUserPagedListDto>>(`${this.api}/paged-list?${params}`);
    }

    public getWorkItemListById(id: number): Observable<IGetWorkItemListByIdDto[]> {
        return this.http.get<IGetWorkItemListByIdDto[]>(`${this.api}/work-item-list/${id}`);
    }

    public delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/${id}`);
    }
}