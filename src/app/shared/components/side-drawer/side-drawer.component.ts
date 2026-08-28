import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { AppUtil } from '../../../core/utils/app.util';

@Component({
    selector: 'app-side-drawer',
    templateUrl: './side-drawer.component.html',
    styleUrls: ['./side-drawer.component.scss'],
    standalone: false
})
export class SideDrawerComponent implements OnChanges {
    @Input() visible = false;
    @Input() title = AppUtil.EmptyString;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() closed = new EventEmitter<void>();

    close(): void {
        this.visible = false;
        this.visibleChange.emit(false);
        this.closed.emit();
        document.body.style.overflow = '';
    }

    ngOnChanges(): void {
        if (this.visible) {
            document.body.style.overflow = 'hidden';
        }
    }
}