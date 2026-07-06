import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { DialogConfirmComponent } from "../../../../shared/components";
import { AppUtil } from "../../../../core/utils/app.util";
import { IGetUserPagedListDto, IGetWorkItemListByIdDto } from "../../dtos";
import { IDialogConfirmDto, IPagedListRequestDto, IPagedListResponseDto, ISearchEventDto } from "../../../../shared/dtos";
import { ModuleTitleEnum, SearchTypeEnum } from "../../../../core/enums";
import { DialogStatesService } from "../../../../shared/services";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { firstValueFrom, Subject, take, takeUntil } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { UserService, UserStatesService } from "../../services";
import { DialogAssociatedItemsComponent } from "../dialogs/associated-items/dialog-associated-items.coponent";
import { UpsertUserDialogComponent } from "../dialogs/upsert/upsert-user-dialog.component";
import { PermissionCodeConstant } from "../../../../core/constants";
import { PermissionStore } from "../../../../core/authorization";

@Component({
    selector: 'app-user-manage',
    templateUrl: './user-manage.component.html',
    standalone: false,
})
export class UserManageComponent implements OnInit {
    @ViewChild(DialogConfirmComponent) dialogConfirmComponent!: DialogConfirmComponent;
    @ViewChild(DialogAssociatedItemsComponent) dialogAssociatedItemsComponent!: DialogAssociatedItemsComponent;
    @ViewChild(UpsertUserDialogComponent) upsertUserDialogComponent!: UpsertUserDialogComponent;

    public associatedWorkItems: IGetWorkItemListByIdDto[];

    protected users: IGetUserPagedListDto[] = [];
    protected totalCount = 0;
    protected isLoading = false;
    protected request: IPagedListRequestDto;

    protected canAdd: boolean = false;
    protected canUpdate: boolean = false;
    protected canDelete: boolean = false;
    protected canView: boolean = false;

    protected readonly AppUtil = AppUtil;
    protected readonly ModuleTitleEnum = ModuleTitleEnum;

    protected userColumnName = {
        Name: 'name',
        Email: 'email',
        CreatedAt: 'createdAt',
        Roles: 'roles',
        Actions: 'actions'
    };

    private _userIdToDelete: number = 0;
    private _destroy$ = new Subject<void>();

    get permissionCodeConstant(): typeof PermissionCodeConstant {
        return PermissionCodeConstant;
    }

    constructor(
        private readonly _userService: UserService,
        private readonly _userStatesService: UserStatesService,
        private readonly _dialogStatesService: DialogStatesService,
        private readonly _router: Router,
        private readonly _toastr: ToastrService,
        private readonly _cdr: ChangeDetectorRef
    ) {
        this.request = AppUtil.initializePagedListRequest(this.userColumnName.CreatedAt);
        this.associatedWorkItems = [];
        this._initializePermissionCodes();
    }

    public ngOnInit(): void {
        this._loadUsers();

        this._userStatesService.refreshUsers$
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                this._loadUsers();
            });

        this._dialogStatesService.dialogConfirmOpened$
            .pipe(takeUntil(this._destroy$))
            .subscribe((load: boolean = false) => {
                if (load)
                    this._deleteUser(this._userIdToDelete);
                this._userIdToDelete = 0;
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
            this.request = this.AppUtil.initializePagedListRequest(this.userColumnName.Name);
        }
        this._loadUsers();
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
        this._loadUsers();
    }

    protected onAddUser(): void {
        this.upsertUserDialogComponent.open(null);
    }

    protected onEditUser(user: IGetUserPagedListDto): void {
        this.upsertUserDialogComponent.open(user);
    }

    protected onViewUser(user: IGetUserPagedListDto): void {
        this._router.navigate(['user', user.id]);
    }

    protected async onDeleteUser(user: IGetUserPagedListDto): Promise<void> {
        this._userIdToDelete = user.id;

        const isValid = await this._validateUser(this._userIdToDelete);

        if (!isValid) {
            this._openWorkItemsDialog();
            return
        };

        const dialogConfirmDto: IDialogConfirmDto = {
            heading: AppUtil.DefaultDeletDialogeHeading,
            message: AppUtil.getDefaultDeleteDialogMessage(this.ModuleTitleEnum.User) + '?'
        };
        this.dialogConfirmComponent.open(dialogConfirmDto);
    }

    protected goToPage(page: number): void {
        if (page < 0 || page >= this.totalPages) return;
        this.request.pageIndex = page;
        this._loadUsers();
    }

    protected onPageSizeChange(newSize: number): void {
        this.request.pageSize = newSize;
        this.request.pageIndex = 0;
        this._loadUsers();
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

    private _loadUsers(): void {
        this._userService.getPagedList(this.request).pipe(take(1)).subscribe({
            next: (response: IPagedListResponseDto<IGetUserPagedListDto>) => {
                this.users = response.items;
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

    private async _validateUser(id: number): Promise<boolean> {
        try {
            const response: IGetWorkItemListByIdDto[] = await firstValueFrom(
                this._userService.getWorkItemListById(id)
            );

            this.associatedWorkItems = response;
            return this.associatedWorkItems.length === 0;
        } catch (err: any) {
            this._toastr.error(err.error?.message);
            return false;
        }
    }

    private _openWorkItemsDialog(): void {
        // open dialog list of project and work items.
        // Project | Task/SubTask in list format
        this.dialogAssociatedItemsComponent.open(this.associatedWorkItems);
    }

    private _deleteUser(id: number): void {
        this._userService.delete(id).subscribe({
            next: () => {
                this._toastr.success('User deleted successfully.');
                this._loadUsers();
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
            }
        });
    }

    private _initializePermissionCodes(): void {
        this.canView = PermissionStore.hasAny([this.permissionCodeConstant.User.ViewUser]);
        this.canAdd = PermissionStore.hasAny([this.permissionCodeConstant.User.AddUser]);
        this.canDelete = PermissionStore.hasAny([this.permissionCodeConstant.User.DeleteUser]);
        this.canUpdate = PermissionStore.hasAny([this.permissionCodeConstant.User.UpdateUser]);
    }
}