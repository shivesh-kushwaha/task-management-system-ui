import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagedListResponseDto } from '../../../shared/dtos';
import { IGetExceptionLogByIdDto, IGetExceptionLogPagedListDto, IGetExceptionLogPagedListRequestDto, toExceptionLogQueryString } from '../dtos';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ExceptionLogService {
    private readonly _apiUrl = `${environment.apiUrl}/exceptionLog`;

    constructor(private readonly _http: HttpClient) { }

    getPagedList(request: IGetExceptionLogPagedListRequestDto): Observable<IPagedListResponseDto<IGetExceptionLogPagedListDto>> {
        const params = toExceptionLogQueryString(request);
        return this._http.get<IPagedListResponseDto<IGetExceptionLogPagedListDto>>(`${this._apiUrl}/paged-list?${params}`);
    }

    getById(id: number): Observable<IGetExceptionLogByIdDto> {
        return this._http.get<IGetExceptionLogByIdDto>(`${this._apiUrl}/${id}`);
    }
}