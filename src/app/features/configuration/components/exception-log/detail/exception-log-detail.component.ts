import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { IGetExceptionLogByIdDto } from '../../../dtos';
import { ExceptionLogService } from '../../../services';
import { AppUtil } from '../../../../../core/utils/app.util';

@Component({
    selector: 'app-exception-log-detail',
    templateUrl: './exception-log-detail.component.html',
    // styleUrls: ['./exception-log-detail.component.scss'],
    standalone: false,
})
export class ExceptionLogDetailComponent implements OnInit, OnDestroy {
    protected log?: IGetExceptionLogByIdDto;
    protected readonly AppUtil = AppUtil;

    private readonly _destroy$ = new Subject<void>();

    constructor(
        private readonly _route: ActivatedRoute,
        private readonly _router: Router,
        private readonly _exceptionLogService: ExceptionLogService,
        private readonly _toastr: ToastrService,
        private readonly _cdr: ChangeDetectorRef
    ) { }

    public ngOnInit(): void {
        const idParam = this._route.snapshot.paramMap.get('id');
        if (!idParam) {
            this._toastr.error('No log ID provided');
            this._goBack();
            return;
        }
        const id = parseInt(idParam, 10);
        if (isNaN(id)) {
            this._toastr.error('Invalid log ID');
            this._goBack();
            return;
        }
        this._loadLog(id);
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    protected onGoBack(): void {
        this._goBack();
    }

    private _goBack(): void {
        this._router.navigate(['configuration/manage/exception-log']);
    }

    private _loadLog(id: number): void {
        this._exceptionLogService.getById(id)
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: (data) => {
                    this.log = data;
                    this._cdr.detectChanges();
                },
                error: (err: HttpErrorResponse) => {
                    this._toastr.error(err.error?.message || 'Failed to load exception log');
                    this._goBack();
                }
            });
    }
}