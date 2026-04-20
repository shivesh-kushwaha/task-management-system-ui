import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISelectListItemDto } from '../dtos';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private readonly _api = `${environment.apiUrl}/project`;

    constructor(private readonly _http: HttpClient) { }

    public getListItem(): Observable<Array<ISelectListItemDto>> {
        return this._http.get<Array<ISelectListItemDto>>(`${this._api}/select-list-item`);
    }
}