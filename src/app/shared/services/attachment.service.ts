import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TypeEnum } from '../../core/enums';

@Injectable({ providedIn: 'root' })
export class AttachmentService {
    private readonly _apiEndpoint = `${environment.apiUrl}/attachment`;

    constructor(private readonly _http: HttpClient) { }

    public uploadSingle(type: TypeEnum, typeId: number, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('type', type.toString());
        formData.append('typeId', typeId.toString());
        formData.append('file', file, file.name);

        return this._http.post(`${this._apiEndpoint}/upload-single`, formData);
    }

    public uploadMultiple(type: TypeEnum, typeId: number, files: File[]): Observable<any> {
        const formData = new FormData();
        formData.append('type', type.toString());
        formData.append('typeId', typeId.toString());

        files.forEach(file => {
            formData.append('files', file, file.name);
        });

        return this._http.post(`${this._apiEndpoint}/upload-multiple`, formData);
    }
}