import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { AppUtil } from '../../../../core/utils/app.util';
import { IGetExceptionLogPagedListDto, IGetExceptionLogPagedListRequestDto } from '../../dtos';
import { ExceptionLogService } from '../../services/exception-log.service';
import { LogTypeEnum, TypeEnum, SearchTypeEnum, getLogTypeEnum, getTypeEnum } from '../../../../core/enums';
import { IPagedListResponseDto, ISearchEventDto, ISelectListItemDto } from '../../../../shared/dtos';
import { Router } from '@angular/router';

@Component({
    selector: 'app-exception-log',
    templateUrl: './exception-log.component.html',
    standalone: false,
})
export class ExceptionLogComponent implements OnInit, OnDestroy {
    protected logs: IGetExceptionLogPagedListDto[] = [];
    protected totalCount = 0;
    protected isLoading = false;
    protected request: IGetExceptionLogPagedListRequestDto;

    protected readonly entityTypes: ISelectListItemDto[] = getTypeEnum();
    protected readonly logTypes: ISelectListItemDto[] = getLogTypeEnum();

    protected readonly AppUtil = AppUtil;
    protected readonly LogTypeEnum = LogTypeEnum;
    protected readonly EntityTypeEnum = TypeEnum;

    private _destroy$ = new Subject<void>();
    private readonly defaultSortColumn = 'createdAt';

    constructor(
        private readonly _exceptionLogService: ExceptionLogService,
        private readonly _toastr: ToastrService,
        private readonly _cdr: ChangeDetectorRef,
        private readonly _router: Router
    ) {
        this.request = this._initRequest();
    }

    public ngOnInit(): void {
        this._loadLogs();
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    protected onSearchEvent(event: ISearchEventDto): void {
        this.request.filterKey = event.query || '';
        this.request.pageIndex = 0;

        if (event.type === SearchTypeEnum.Reset) {
            this._resetFilters();
            this._loadLogs();
        } else {
            this._loadLogs();
        }
    }

    protected onFilterChange(): void {
        this.request.pageIndex = 0;
        this._loadLogs();
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
        this._loadLogs();
    }

    protected goToPage(page: number): void {
        if (page < 0 || page >= this.totalPages) return;
        this.request.pageIndex = page;
        this._loadLogs();
    }

    protected onPageSizeChange(newSize: number): void {
        this.request.pageSize = newSize;
        this.request.pageIndex = 0;
        this._loadLogs();
    }

    protected get totalPages(): number {
        return Math.ceil(this.totalCount / this.request.pageSize);
    }

    protected viewLog(log: IGetExceptionLogPagedListDto): void {
        this._router.navigate(['configuration/manage/exception-log', log.id]);
    }

    private _resetFilters(): void {
        this.request.entityType = null;
        this.request.logType = null;
        this.request.fromDate = null;
        this.request.toDate = null;
    }

    private _initRequest(): IGetExceptionLogPagedListRequestDto {
        return {
            filterKey: '',
            sort: this.defaultSortColumn,
            order: AppUtil.DescendingOrder,
            pageIndex: 0,
            pageSize: 10,
            logType: null,
            entityType: null,
            fromDate: null,
            toDate: null,
        };
    }

    private _loadLogs(): void {
        this._exceptionLogService.getPagedList(this.request)
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: (response: IPagedListResponseDto<IGetExceptionLogPagedListDto>) => {
                    this.logs = response.items;
                    this.totalCount = response.totalCount;
                    this.isLoading = false;
                    this._cdr.detectChanges();
                },
                error: (err: HttpErrorResponse) => {
                    this._toastr.error(err.error?.message || 'Failed to load exception logs');
                    this.isLoading = false;
                    this._cdr.detectChanges();
                }
            });
    }
}