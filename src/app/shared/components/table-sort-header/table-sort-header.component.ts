import { Component, Input } from '@angular/core';
import { AppUtil } from '../../../core/utils/app.util';

@Component({
    selector: 'app-table-sort-header',
    templateUrl: './table-sort-header.component.html',
    standalone: false,
})
export class TableSortHeaderComponent {
    @Input() columnName: string = AppUtil.EmptyString;
    @Input() currentSort: string = AppUtil.EmptyString;
    @Input() currentOrder: string = AppUtil.AscendingOrder;

    protected readonly AppUtil = AppUtil;
}