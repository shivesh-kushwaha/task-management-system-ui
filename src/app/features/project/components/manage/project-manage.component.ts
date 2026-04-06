import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { IGetProjectPagedListDto } from '../../dtos';
import { ProjectService } from '../../services/project.service';
import { IPagedListRequestDto, IPagedListResponseDto, ISearchEventDto } from '../../../../shared/dtos';
import { ProjectTypeEnum } from '../../../../core/enums';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-projects',
    templateUrl: './project-manage.component.html',
    styleUrls: ['./project-manage.component.scss'],
    standalone: false,
})
export class ProjectManageComponent implements OnInit {

    // ── Table state ───────────────────────────────────────────────
    projects: IGetProjectPagedListDto[] = [];
    totalCount = 0;
    isLoading = false;

    request: IPagedListRequestDto = {
        filterKey: '',
        sort: 'name',
        order: 'asc',
        pageIndex: 0,
        pageSize: 10,
    };

    readonly pageSizeOptions = [5, 10, 25, 50];

    // ── Modal state ───────────────────────────────────────────────
    showDetailModal = false;
    detailProject: IGetProjectPagedListDto | null = null;

    editingProject: IGetProjectPagedListDto | null = null;
    editName = '';

    showDeleteConfirm = false;
    deletingProject: IGetProjectPagedListDto | null = null;

    // ── Toast state ───────────────────────────────────────────────
    toastMsg = '';
    toastType = '';
    toastVisible = false;

    protected get projectTypeEnum(): typeof ProjectTypeEnum {
        return ProjectTypeEnum;
    }

    constructor(private projectService: ProjectService,
        private readonly _toastr: ToastrService,
        private readonly cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.loadProjects();
    }

    // ── Data loading ──────────────────────────────────────────────
    loadProjects(): void {
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

    // ── Search (debounce via input event) ─────────────────────────
    protected onSearchEvent(event: ISearchEventDto): void {
        this.request.pageIndex = 0;
        this.request.filterKey = event.query;
        this.loadProjects();
    }

    // ── Sorting ───────────────────────────────────────────────────
    sort(col: string): void {
        if (this.request.sort === col) {
            this.request.order = this.request.order === 'asc' ? 'desc' : 'asc';
        } else {
            this.request.sort = col;
            this.request.order = 'asc';
        }
        this.request.pageIndex = 0;
        this.loadProjects();
    }


    // ── Pagination ────────────────────────────────────────────────
    get totalPages(): number {
        return Math.ceil(this.totalCount / this.request.pageSize);
    }

    get pageNumbers(): number[] {
        const total = this.totalPages;
        const current = this.request.pageIndex;
        const pages: number[] = [];
        const delta = 2;
        for (let i = Math.max(0, current - delta); i <= Math.min(total - 1, current + delta); i++) {
            pages.push(i);
        }
        return pages;
    }

    get startRecord(): number {
        return this.totalCount === 0 ? 0 : this.request.pageIndex * this.request.pageSize + 1;
    }

    get endRecord(): number {
        return Math.min((this.request.pageIndex + 1) * this.request.pageSize, this.totalCount);
    }

    goToPage(page: number): void {
        if (page < 0 || page >= this.totalPages) return;
        this.request.pageIndex = page;
        this.loadProjects();
    }

    onPageSizeChange(): void {
        this.request.pageIndex = 0;
        this.loadProjects();
    }
}