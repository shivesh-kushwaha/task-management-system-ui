import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ISelectListItemDto } from '../../../shared/dtos';

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private readonly api = `${environment.apiUrl}/team`;

    constructor(private readonly http: HttpClient) { }

    public getListItem(): Observable<Array<ISelectListItemDto>> {
        return this.http.get<Array<ISelectListItemDto>>(`${this.api}/select-list-item`);
    }
}