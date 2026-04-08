import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class ProjectStatesService {
    private _projectAdded = new Subject<void>();
    public projectAdded$ = this._projectAdded.asObservable();

    public projectAddedNotify(): void {
        this._projectAdded.next();
    }
}