import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { AppUtil } from '../../../../core/utils/app.util';
import { ModuleTitleEnum, SearchTypeEnum, WorkItemTypeEnum } from '../../../../core/enums';
import { IDialogConfirmDto, IGetWorkItemPagedListDto, IPagedListRequestDto, IPagedListResponseDto, ISearchEventDto, IWorkItemPagedListRequestDto } from '../../../dtos';
import { RecordStatusEnum, WorkItemPriorityEnum } from '../../../../core/enums';
import { DialogConfirmComponent, UpsertWorkItemDialogComponent } from '../..';
import { DialogStatesService, WorkItemService, WorkItemStatesService } from '../../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-work-item-manage',
    templateUrl: './work-item-manage.component.html',
    standalone: false,
})
export class WorkItemManageComponent implements OnInit, OnDestroy {
    @Input() workItemType: WorkItemTypeEnum = WorkItemTypeEnum.task;

    @ViewChild(UpsertWorkItemDialogComponent) upsertTaskDialogComponent!: UpsertWorkItemDialogComponent;
    @ViewChild(DialogConfirmComponent) dialogConfirmComponent!: DialogConfirmComponent;

    protected items: IGetWorkItemPagedListDto[] = [];
    protected totalCount: number = 0;
    protected id: number = 0;
    protected isLoading = false;

    protected request: IWorkItemPagedListRequestDto;
    protected readonly AppUtil = AppUtil;
    protected readonly RecordStatusEnum = RecordStatusEnum;
    protected readonly WorkItemPriorityEnum = WorkItemPriorityEnum;
    protected readonly ModuleTitleEnum = ModuleTitleEnum;
    protected readonly WorkItemTypeEnum = WorkItemTypeEnum;

    private _destroy$ = new Subject<void>();
    private _workItemIdToDelete: number = 0;

    columnNames = {
        Title: 'title',
        ProjectName: 'projectName',
        Type: 'type',
        DueDate: 'dueDate',
        CreatedAt: 'createdAt',
        Status: 'status',
        Priority: 'priority',
        CreatedBy: 'createdByFullName',
        SubTasks: 'totalSubTasks',
    };

    constructor(private readonly _workItemService: WorkItemService,
        private readonly _workItemStatesService: WorkItemStatesService,
        private readonly _dialogStatesService: DialogStatesService,
        private readonly _router: Router,
        private readonly _route: ActivatedRoute,
        private readonly _toastr: ToastrService,
        private readonly _cdr: ChangeDetectorRef) {
        this.id = this._route.snapshot.params['id'];
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
        if (this.id) {
            this._router.navigate([`/task/${this.id}/sub-task`, workItem.id]);
        } else {
            this._router.navigate(['/task', workItem.id]);
        }
    }

    protected onDeleteWorkItem(workItem: IGetWorkItemPagedListDto): void {
        this._workItemIdToDelete = workItem.id;
        const workItemType = this.id ? this.ModuleTitleEnum.SubTask : this.ModuleTitleEnum.Task
        const dialogConfirmDto: IDialogConfirmDto = {
            heading: AppUtil.DefaultDeletDialogeHeading,
            message: AppUtil.getDefaultDeleteDialogMessage(workItemType) + '?'
        }
        this.dialogConfirmComponent.open(dialogConfirmDto);
    }

    private _loadWorkItems(): void {
        this.request.parentId = this.id ?? null;
        this._workItemService.getPagedList(this.request).subscribe({
            next: (response: IPagedListResponseDto<IGetWorkItemPagedListDto>) => {
                this.items = response.items;
                this.totalCount = response.totalCount;
                this.isLoading = false;
                this._cdr.detectChanges();
            },
            error: (err: HttpErrorResponse) => {
                this._toastr.error(err.error?.message);
                this.isLoading = false;
                this._cdr.detectChanges();
            },
        });
    }

    private _deleteWorkItem(id: number): void {
        this._workItemService.deleteWorkItem(id).subscribe({
            next: () => {
                const message = `${id ? 'Sub Task' : 'Task'} deleted successfully.`;
                this._toastr.success(message);
                this._loadWorkItems();
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
            }
        })
    }
}