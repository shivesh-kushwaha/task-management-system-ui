import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppUtil } from '../../../core/utils/app.util';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    standalone: false
})
export class PaginationComponent {
    @Input() totalCount: number = 0;
    @Input() pageIndex: number = AppUtil.DefaultPageIndex;
    @Input() pageSize: number = AppUtil.DefaultPageSize;
    @Input() pageSizeOptions: number[] = AppUtil.DefaultPageSizeOptions

    @Output() pageChangeEvent = new EventEmitter<number>();
    @Output() pageSizeChangeEvent = new EventEmitter<number>();

    

    protected get totalPages(): number {
        return Math.ceil(this.totalCount / this.pageSize);
    }

    protected get pageNumbers(): number[] {
        const total = this.totalPages;
        const current = this.pageIndex;
        const pages: number[] = [];
        const delta = 2;
        for (let i = Math.max(0, current - delta); i <= Math.min(total - 1, current + delta); i++) {
            pages.push(i);
        }
        return pages;
    }

    protected get startRecord(): number {
        return this.totalCount === 0 ? 0 : this.pageIndex * this.pageSize + 1;
    }

    protected get endRecord(): number {
        return Math.min((this.pageIndex + 1) * this.pageSize, this.totalCount);
    }

    protected goToPage(page: number): void {
        if (page < 0 || page >= this.totalPages) return;
        this.pageChangeEvent.emit(page);
    }

    protected onPageSizeChange(event: any): void {
        const newSize = Number(event.target.value);
        this.pageSizeChangeEvent.emit(newSize);
    }
}