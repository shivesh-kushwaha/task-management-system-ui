import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IPagedListRequestDto, toQueryString } from '../../../shared/dtos/paged-list-request.dto';
import { IPagedListResponseDto } from '../../../shared/dtos';
import { IGetProjectPagedListDto } from '../dtos';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private api = `${environment.apiUrl}/project`;

    constructor(private readonly http: HttpClient) { }

    public getPagedList(request: IPagedListRequestDto): Observable<IPagedListResponseDto<IGetProjectPagedListDto>> {
        const params = toQueryString(request);
        return this.http.get<IPagedListResponseDto<IGetProjectPagedListDto>>(`${this.api}/paged-list?${params}`);
    }
}