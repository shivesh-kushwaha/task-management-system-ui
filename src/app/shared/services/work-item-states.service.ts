import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class WorkItemStatesService {
    private _refreshWorkItems = new Subject<void>();
    public refreshWorkItems$ = this._refreshWorkItems.asObservable();

    public notifyWorkItemChanged(): void {
        this._refreshWorkItems.next();
    }
}