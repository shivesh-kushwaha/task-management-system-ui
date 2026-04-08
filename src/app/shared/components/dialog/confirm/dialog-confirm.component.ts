import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { DialogStatesService } from '../../../services';
import { IDialogConfirmDto } from '../../../dtos';
import { AppUtil } from '../../../../core/utils/app.util';

@Component({
    selector: 'app-dialog-confirm',
    templateUrl: './dialog-confirm.component.html',
    standalone: false
})
export class DialogConfirmComponent implements AfterViewInit {
    @ViewChild('dialogConfirm') elementRef!: ElementRef;

    protected heading: string = AppUtil.EmptyString;
    protected message: string = AppUtil.EmptyString;

    private _modal?: Modal | null;

    constructor(private readonly _dialogStates: DialogStatesService) { }

    public ngAfterViewInit(): void {
        if (this.elementRef) {
            this._modal = new Modal(this.elementRef.nativeElement, {
                backdrop: 'static',
                focus: false,
            });
        }
    }

    public open(request: IDialogConfirmDto): void {
        this.heading = request.heading;
        this.message = request.message;
        this._show();
    }

    protected onClose(): void {
        this._dialogStates.dialogConfirmOpenedNotify$(false);
        this._hide();
    }

    protected onSubmit(): void {
        this._dialogStates.dialogConfirmOpenedNotify$(true);
        this._hide();
    }

    private _show(): void {
        this._modal?.show();
    }

    private _hide(): void {
        this._modal?.hide();
    }
}