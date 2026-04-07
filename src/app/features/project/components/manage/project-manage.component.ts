import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IGetProjectPagedListDto } from '../../dtos';
import { ProjectService } from '../../services/project.service';
import { IPagedListRequestDto, IPagedListResponseDto, ISearchEventDto } from '../../../../shared/dtos';
import { ProjectTypeEnum } from '../../../../core/enums';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { AppUtil } from '../../../../core/utils/app.util';
import { AddProjectDialogComponent } from '../dialogs/add/add-project-dialog.component';

@Component({
    selector: 'app-projects',
    templateUrl: './project-manage.component.html',
    styleUrls: ['./project-manage.component.scss'],
    standalone: false,
})
export class ProjectManageComponent implements OnInit {
    @ViewChild(AddProjectDialogComponent) addProjectDialogComponent!: AddProjectDialogComponent

    // ── Table state ───────────────────────────────────────────────
    protected projects: IGetProjectPagedListDto[] = [];
    protected totalCount = 0;
    protected isLoading = false;

    protected readonly pageSizeOptions = [5, 10, 25, 50];

    protected request: IPagedListRequestDto = {
        filterKey: AppUtil.EmptyString,
        sort: 'name',
        order: AppUtil.DefaultSortOrder,
        pageIndex: AppUtil.DefaultPageIndex,
        pageSize: AppUtil.DefaultPageSize,
    };

    // ── Modal state ───────────────────────────────────────────────
    protected showDetailModal = false;
    protected detailProject: IGetProjectPagedListDto | null = null;

    protected editingProject: IGetProjectPagedListDto | null = null;
    protected editName = '';

    protected showDeleteConfirm = false;
    protected deletingProject: IGetProjectPagedListDto | null = null;

    protected readonly AppUtil = AppUtil;

    protected get projectTypeEnum(): typeof ProjectTypeEnum {
        return ProjectTypeEnum;
    }

    constructor(
        private readonly projectService: ProjectService,
        private readonly _toastr: ToastrService,
        private readonly cdr: ChangeDetectorRef
    ) { }

    public ngOnInit(): void {
        this.__loadProjects();
    }

    // ── Data loading ──────────────────────────────────────────────
    private __loadProjects(): void {
        this.projectService.getPagedList(this.request).subscribe({
            next: (response: IPagedListResponseDto<IGetProjectPagedListDto>) => {
                this.projects = response.items;
                this.totalCount = response.totalCount;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err: HttpErrorResponse) => {
                this._toastr.error(err.error?.message);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // ── Search ────────────────────────────────────────────────────
    protected onSearchEvent(event: ISearchEventDto): void {
        this.request.pageIndex = 0;
        this.request.filterKey = event.query;
        this.__loadProjects();
    }

    // ── Sorting ───────────────────────────────────────────────────
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
        this.__loadProjects();
    }

    // ── Action handlers ───────────────────────────────────────────
    protected onViewProject(project: IGetProjectPagedListDto): void {
        this.detailProject = project;
        this.showDetailModal = true;
    }

    protected onDeleteProject(project: IGetProjectPagedListDto): void {
        this.deletingProject = project;
        this.showDeleteConfirm = true;
    }

    // ── Pagination ────────────────────────────────────────────────
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

    protected goToPage(page: number): void {
        if (page < 0 || page >= this.totalPages) return;
        this.request.pageIndex = page;
        this.__loadProjects();
    }

    protected onPageSizeChange(): void {
        this.request.pageIndex = 0;
        this.__loadProjects();
    }

    protected onAddProject(): void {
        this.addProjectDialogComponent.open();
    }

    protected onProjectSaved(event: any): void {

    }
}