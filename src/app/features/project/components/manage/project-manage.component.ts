import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IGetProjectPagedListDto } from '../../dtos';
import { ProjectService } from '../../services/project.service';
import { IDialogConfirmDto, IPagedListRequestDto, IPagedListResponseDto, ISearchEventDto } from '../../../../shared/dtos';
import { ModuleTitleEnum, ProjectTypeEnum, SearchTypeEnum } from '../../../../core/enums';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { AppUtil } from '../../../../core/utils/app.util';
import { Subject, take, takeUntil } from 'rxjs';
import { ProjectStatesService } from '../../services/project-states.service';
import { DialogConfirmComponent } from '../../../../shared/components';
import { DialogStatesService } from '../../../../shared/services';
import { Router } from '@angular/router';
import { UpsertProjectDialogComponent } from '../dialogs/upsert/upsert-project-dialog.component';

@Component({
    selector: 'app-projects',
    templateUrl: './project-manage.component.html',
    styleUrls: ['./project-manage.component.scss'],
    standalone: false,
})
export class ProjectManageComponent implements OnInit, OnDestroy {
    @ViewChild(UpsertProjectDialogComponent) upsertProjectDialogComponent!: UpsertProjectDialogComponent
    @ViewChild(DialogConfirmComponent) dialogConfirmComponent!: DialogConfirmComponent;

    protected projects: IGetProjectPagedListDto[] = [];
    protected totalCount = 0;
    protected isLoading = false;

    protected request: IPagedListRequestDto;

    protected readonly AppUtil = AppUtil;
    protected readonly ProjectTypeEnum = ProjectTypeEnum;
    protected readonly ModuleTitleEnum = ModuleTitleEnum;

    projectColumnName = {
        Name: 'name',
        Type: 'type',
        WorkItems: 'totalWorkItem',
        CreatedAt: 'createdAt',
        CreatedBy: 'createdByFullName',
        Actions: 'actions'
    };

    private _projectIdToDelete: number = 0;

    private _destroy$ = new Subject<void>();

    constructor(
        private readonly _projectService: ProjectService,
        private readonly _projectStatesService: ProjectStatesService,
        private readonly _dialogStatesService: DialogStatesService,
        private readonly _router: Router,
        private readonly _toastr: ToastrService,
        private readonly _cdr: ChangeDetectorRef
    ) {
        this.request = AppUtil.initializePagedListRequest(this.projectColumnName.CreatedAt);
    }

    public ngOnInit(): void {
        this._loadProjects();

        this._projectStatesService.refreshProjects$
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                this._loadProjects();
            });

        this._dialogStatesService.dialogConfirmOpened$
            .pipe(takeUntil(this._destroy$))
            .subscribe((load: boolean = false) => {
                if (load)
                    this._deleteProject(this._projectIdToDelete);
                this._projectIdToDelete = 0;
            });
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    protected onSearchEvent(event: ISearchEventDto): void {
        this.request.pageIndex = this.AppUtil.DefaultPageIndex;
        this.request.filterKey = event.query;
        if (event.type == SearchTypeEnum.Reset) {
            this.request = this.AppUtil.initializePagedListRequest(this.projectColumnName.Name);
        }
        this._loadProjects();
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
        this._loadProjects();
    }

    protected onAddProject(): void {
        this.upsertProjectDialogComponent.open(null);
    }

    protected onEditProject(project: IGetProjectPagedListDto): void {
        this.upsertProjectDialogComponent.open(project);
    }

    protected onViewProject(project: IGetProjectPagedListDto): void {
        this._router.navigate(['/project', project.id]);
    }

    protected onDeleteProject(project: IGetProjectPagedListDto): void {
        this._projectIdToDelete = project.id;
        const dialogConfirmDto: IDialogConfirmDto = {
            heading: AppUtil.DefaultDeletDialogeHeading,
            message: AppUtil.getDefaultDeleteDialogMessage(this.ModuleTitleEnum.Project) + '?'
        }
        this.dialogConfirmComponent.open(dialogConfirmDto);
    }

    protected goToPage(page: number): void {
        if (page < 0 || page >= this.totalPages) return;
        this.request.pageIndex = page;
        this._loadProjects();
    }

    protected onPageSizeChange(newSize: number): void {
        this.request.pageSize = newSize;
        this.request.pageIndex = 0;
        this._loadProjects();
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

    private _loadProjects(): void {
        this._projectService.getPagedList(this.request).pipe(take(1)).subscribe({
            next: (response: IPagedListResponseDto<IGetProjectPagedListDto>) => {
                this.projects = response.items;
                this.totalCount = response.totalCount;
                this.isLoading = false;
                this._cdr.detectChanges();
            },
            error: (err: HttpErrorResponse) => {
                this._toastr.error(err.error?.message);
                this.isLoading = false;
                this._cdr.detectChanges();
            }
        });
    }

    private _deleteProject(id: number): void {
        this._projectService.deleteProject(id).subscribe({
            next: () => {
                this._toastr.success('Project deleted successfully.');
                this._loadProjects();
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
            }
        })
    }
}