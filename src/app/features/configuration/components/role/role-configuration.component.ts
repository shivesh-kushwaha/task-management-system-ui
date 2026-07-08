import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

import { AppUtil } from '../../../../core/utils/app.util';
import { SearchTypeEnum } from '../../../../core/enums';
import { IPagedListRequestDto, IPagedListResponseDto, ISearchEventDto } from '../../../../shared/dtos';
import { UpsertRoleConfigurationDialogComponent } from '../dialogs/upsert/role/upsert-role-configuration-dialog.component';
import { IGetRolePagedListDto } from '../../dtos';
import { RoleService, RoleStatesService } from '../../services';

@Component({
    selector: 'app-role-configuration',
    templateUrl: './role-configuration.component.html',
    standalone: false
})
export class RoleConfigurationComponent implements OnInit, OnDestroy {
    @ViewChild(UpsertRoleConfigurationDialogComponent) upsertDialog!: UpsertRoleConfigurationDialogComponent;

    protected roles: IGetRolePagedListDto[] = [];
    protected totalCount = 0;
    protected isLoading = false;

    protected request: IPagedListRequestDto;

    protected readonly AppUtil = AppUtil;

    // Column names for sorting
    columnNames = {
        Name: 'name',
        Code: 'code',
        Description: 'description'
    };

    private _destroy$ = new Subject<void>();

    constructor(
        private readonly _roleService: RoleService,
        private readonly _roleStatesService: RoleStatesService,
        private readonly _toastr: ToastrService
    ) {
        this.request = AppUtil.initializePagedListRequest(this.columnNames.Name);
    }

    ngOnInit(): void {
        this._loadRoles();

        // Refresh list when a role is added/updated
        this._roleStatesService.refreshRoles$
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                this._loadRoles();
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
            this.request = AppUtil.initializePagedListRequest(this.columnNames.Name);
        }
        this._loadRoles();
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
        this._loadRoles();
    }

    protected onAddRole(): void {
        this.upsertDialog.openAdd();
    }

    protected onEditRole(role: IGetRolePagedListDto): void {
        // Convert to IUpsertRoleDto shape
        this.upsertDialog.openEdit({
            id: role.id,
            name: role.name,
            code: role.code,
            description: role.description
        });
    }

    protected onRoleSaved(): void {
        this._loadRoles();
    }

    // Pagination
    protected goToPage(page: number): void {
        if (page < 0 || page >= this.totalPages) return;
        this.request.pageIndex = page;
        this._loadRoles();
    }

    protected onPageSizeChange(newSize: number): void {
        this.request.pageSize = newSize;
        this.request.pageIndex = 0;
        this._loadRoles();
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

    private _loadRoles(): void {
        this._roleService.getPagedList(this.request).subscribe({
            next: (response: IPagedListResponseDto<IGetRolePagedListDto>) => {
                this.roles = response.items;
                this.totalCount = response.totalCount;
                this.isLoading = false;
            },
            error: (err: HttpErrorResponse) => {
                this._toastr.error(err.error?.message || 'Failed to load roles');
                this.isLoading = false;
            }
        });
    }
}