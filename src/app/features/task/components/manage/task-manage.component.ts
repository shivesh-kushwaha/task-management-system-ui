import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { AppUtil } from '../../../../core/utils/app.util';
import { ModuleTitleEnum, SearchTypeEnum } from '../../../../core/enums';
import { IDialogConfirmDto, IPagedListRequestDto, IPagedListResponseDto, ISearchEventDto } from '../../../../shared/dtos';
import { IGetWorkItemPagedListDto } from '../../dtos';
import { RecordStatusEnum, WorkItemPriorityEnum } from '../../../../core/enums'; // adjust path
import { WorkItemService, WorkItemStatesService } from '../../services';
import { UpsertTaskDialogComponent } from '../dialogs/upsert/upsert-task-dialog.component';
import { DialogConfirmComponent } from '../../../../shared/components';
import { DialogStatesService } from '../../../../shared/services';
import { Router } from '@angular/router';

@Component({
    selector: 'app-task',
    templateUrl: './task-manage.component.html',
    standalone: false,
})
export class TaskManageComponent implements OnInit, OnDestroy {
    @ViewChild(UpsertTaskDialogComponent) upsertTaskDialogComponent!: UpsertTaskDialogComponent;
    @ViewChild(DialogConfirmComponent) dialogConfirmComponent!: DialogConfirmComponent;


    protected items: IGetWorkItemPagedListDto[] = [];
    protected totalCount = 0;
    protected isLoading = false;

    protected request: IPagedListRequestDto;
    protected readonly AppUtil = AppUtil;
    protected readonly RecordStatusEnum = RecordStatusEnum;
    protected readonly WorkItemPriorityEnum = WorkItemPriorityEnum;
    protected readonly ModuleTitleEnum = ModuleTitleEnum;

    private _destroy$ = new Subject<void>();
    private _workItemIdToDelete: number = 0;

    columnNames = {
        Title: 'title',
        Type: 'type',
        DueDate: 'dueDate',
        CreatedAt: 'createdAt',
        Status: 'status',
        Priority: 'priority',
        CreatedBy: 'createdByFullName',
        SubTasks: 'totalSubTasks',
    };

    constructor(
        private readonly _workItemService: WorkItemService,
        private readonly _workItemStatesService: WorkItemStatesService,
        private readonly _dialogStatesService: DialogStatesService,
        private readonly _router: Router,
        private readonly _toastr: ToastrService,
        private readonly _cdr: ChangeDetectorRef,
    ) {
        this.request = AppUtil.initializePagedListRequest(this.columnNames.CreatedAt);
    }

    ngOnInit(): void {
        this._loadWorkItems();

        this._workItemStatesService.refreshWorkItems$
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                this._loadWorkItems();
            });

        this._dialogStatesService.dialogConfirmOpened$
            .pipe(takeUntil(this._destroy$))
            .subscribe((load: boolean = false) => {
                if (load)
                    this._deleteWorkItem(this._workItemIdToDelete);
                this._workItemIdToDelete = 0;
            });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    protected onSearchEvent(event: ISearchEventDto): void {
        this.request.pageIndex = AppUtil.DefaultPageIndex;
        this.request.filterKey = event.query;
        if (event.type === SearchTypeEnum.Reset) {
            this.request = AppUtil.initializePagedListRequest(this.columnNames.CreatedAt);
        }
        this._loadWorkItems();
    }

    protected sort(col: string): void {
        if (this.request.sort === col) {
            this.request.order = this.request.order === AppUtil.AscendingOrder
                ? AppUtil.DescendingOrder
                : AppUtil.AscendingOrder;
        } else {
            this.request.sort = col;
            this.request.order = AppUtil.AscendingOrder;
        }
        this.request.pageIndex = 0;
        this._loadWorkItems();
    }

    protected goToPage(page: number): void {
        if (page < 0 || page >= this.totalPages) return;
        this.request.pageIndex = page;
        this._loadWorkItems();
    }

    protected onPageSizeChange(newSize: number): void {
        this.request.pageSize = newSize;
        this.request.pageIndex = 0;
        this._loadWorkItems();
    }

    protected get totalPages(): number {
        return Math.ceil(this.totalCount / this.request.pageSize);
    }

    protected get pageNumbers(): number[] {
        const total = this.totalPages;
        const current = this.request.pageIndex;
        const pages: number[] = [];
        const delta = 2;
        for (let i = Math.max(0, current - delta); i <= Math.min(total - 1, current + delta); i++) {
            pages.push(i);
        }
        return pages;
    }

    protected get startRecord(): number {
        return this.totalCount === 0 ? 0 : this.request.pageIndex * this.request.pageSize + 1;
    }

    protected get endRecord(): number {
        return Math.min((this.request.pageIndex + 1) * this.request.pageSize, this.totalCount);
    }

    protected getPriorityLabel(priority: WorkItemPriorityEnum): string {
        return WorkItemPriorityEnum[priority] || 'Unknown';
    }

    protected onAddWorkItem(): void {
        this.upsertTaskDialogComponent.open(null);
    }

    protected onEditWorkItem(workItem: IGetWorkItemPagedListDto): void {
        this.upsertTaskDialogComponent.open(workItem);
    }

    protected onViewWorkItem(workItem: IGetWorkItemPagedListDto): void {
        this._router.navigate(['/task', workItem.id]);
    }

    protected onDeleteWorkItem(workItem: IGetWorkItemPagedListDto): void {
        this._workItemIdToDelete = workItem.id;
        const dialogConfirmDto: IDialogConfirmDto = {
            heading: AppUtil.DefaultDeletDialogeHeading,
            message: AppUtil.getDefaultDeleteDialogMessage(this.ModuleTitleEnum.Task) + '?'
        }
        this.dialogConfirmComponent.open(dialogConfirmDto);
    }

    private _loadWorkItems(): void {
        this._workItemService.getPagedList(this.request).subscribe({
            next: (response: IPagedListResponseDto<IGetWorkItemPagedListDto>) => {
                this.items = response.items;
                this.totalCount = response.totalCount;
                this.isLoading = false;
                this._cdr.detectChanges();
            },
            error: (err: HttpErrorResponse) => {
                this._toastr.error(err.error?.message || 'Failed to load work items');
                this.isLoading = false;
                this._cdr.detectChanges();
            },
        });
    }

    private _deleteWorkItem(id: number): void {
        this._workItemService.deleteWorkItem(id).subscribe({
            next: () => {
                this._toastr.success('Task deleted successfully.');
                this._loadWorkItems();
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
            }
        })
    }
}