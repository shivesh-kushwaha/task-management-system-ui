import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IGetDashboardDto } from '../dtos';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private readonly _api = `${environment.apiUrl}/dashboard`;

    constructor(private readonly _http: HttpClient) { }

    public getDashboard(): Observable<IGetDashboardDto> {
        return this._http.get<IGetDashboardDto>(`${this._api}`);
    }
}