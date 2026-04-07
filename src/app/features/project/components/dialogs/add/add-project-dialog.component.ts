import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { AppUtil } from '../../../../../core/utils/app.util';

@Component({
    selector: 'app-add-project-dialog',
    templateUrl: './add-project-dialog.component.html',
    standalone: false
})
export class AddProjectDialogComponent implements AfterViewInit {
    @ViewChild('addProjectDialog') elementRef!: ElementRef;
    @Output() dialogClosedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    public headerMessage: string = AppUtil.EmptyString;

    private _modal?: Modal | null;

    ngAfterViewInit(): void {
        if (this.elementRef) {
            this._modal = new Modal(this.elementRef.nativeElement, {
                backdrop: 'static',
                focus: false,
            });
        }
    }

    open(): void {
        this._modal?.show();
        this.dialogClosedEvent.emit(true);
    }

    onClose(): void {
        this._modal?.hide();
        this.dialogClosedEvent.emit(false);
    }
}