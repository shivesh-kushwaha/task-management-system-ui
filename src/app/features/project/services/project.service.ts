import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IPagedListRequestDto, toQueryString } from '../../../shared/dtos/paged-list-request.dto';
import { IPagedListResponseDto } from '../../../shared/dtos';
import { IAddProjectDto, IGetProjectByIdDto, IGetProjectPagedListDto, IUpdateProjectDto } from '../dtos';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private readonly api = `${environment.apiUrl}/project`;

    constructor(private readonly http: HttpClient) { }

    public addProject(request: IAddProjectDto): Observable<any> {
        return this.http.post(`${this.api}`, request);
    }

    public getProjectById(id: number): Observable<IGetProjectByIdDto> {
        return this.http.get<IGetProjectByIdDto>(`${this.api}/${id}`);
    }

    public getPagedList(request: IPagedListRequestDto): Observable<IPagedListResponseDto<IGetProjectPagedListDto>> {
        const params = toQueryString(request);
        return this.http.get<IPagedListResponseDto<IGetProjectPagedListDto>>(`${this.api}/paged-list?${params}`);
    }

    public updateProject(request: IUpdateProjectDto): Observable<any> {
        return this.http.put(`${this.api}`, request);
    }

    public deleteProject(id: number): Observable<any> {
        return this.http.delete(`${this.api}/${id}`);
    }
}