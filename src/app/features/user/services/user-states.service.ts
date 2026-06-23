import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserStatesService {
    private readonly _userChangedSubject = new BehaviorSubject<boolean>(false);

    constructor() { }

    private _refreshUsers = new Subject<void>();
    public refreshUsers$ = this._refreshUsers.asObservable();

    public notifyUserChanged(): void {
        this._refreshUsers.next();
    }
}