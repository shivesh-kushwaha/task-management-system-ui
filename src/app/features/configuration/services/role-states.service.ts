import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class RoleStatesService {
    private _refreshRoles = new Subject<void>();
    public refreshRoles$ = this._refreshRoles.asObservable();

    public notifyRoleChanged(): void {
        this._refreshRoles.next();
    }
}