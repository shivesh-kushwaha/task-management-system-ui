import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class DialogStatesService {
    private _dilogConfirmOpened = new Subject<boolean>();
    public dialogConfirmOpened$ = this._dilogConfirmOpened.asObservable();

    public dialogConfirmOpenedNotify$(load: boolean = false): void {
        this._dilogConfirmOpened.next(load);
    }
}