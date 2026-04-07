import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AppUtil } from "../../../../core/utils/app.util";

@Component({
    selector: 'app-dialog-header',
    templateUrl: './dialog-header.component.html',
    standalone: false
})
export class DialogHeaderComponent {
    @Input() heading: string = AppUtil.EmptyString;
    @Output() closeEvent: EventEmitter<void> = new EventEmitter<void>();
    
    protected close(): void {
        this.closeEvent.emit();
    }
}