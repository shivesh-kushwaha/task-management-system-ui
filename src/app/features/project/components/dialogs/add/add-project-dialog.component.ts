import { Component, EventEmitter, Output } from '@angular/core';

declare const bootstrap: any;

@Component({
    selector: 'app-add-project-dialog',
    templateUrl: './add-project-dialog.component.html',
    standalone: false
})
export class AddProjectDialogComponent {
    @Output() dialogClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

    open(): void {
        const modalElement = document.getElementById('simpleModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });
            modal.show();
        }
    }

    close(): void {
        const modalElement = document.getElementById('simpleModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
                this.dialogClosed.emit();
            }
        }
    }
}