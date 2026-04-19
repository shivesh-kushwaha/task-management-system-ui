import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class ProjectStatesService {
    private _refreshProjects = new Subject<void>();
    public refreshProjects$ = this._refreshProjects.asObservable();

    public notifyProjectChanged(): void {
        this._refreshProjects.next();
    }
}