import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, take } from 'rxjs';
import { PermissionService } from '../../services/permission.service';
import { ISearchEventDto, ISelectListItemDto } from '../../../../shared/dtos';
import { SearchTypeEnum } from '../../../../core/enums';
import { AddPermissionConfigurationDialogComponent } from '../dialogs/add/permission/add-permission-configuration-dialog.component';
import { IGetPermissionGroupedListByRoleIdDto, IGetPermissionListItemDto } from '../../dtos';
import { UpsertPermissionGroupDialogComponent } from '../dialogs/upsert/permission-group/upsert-permission-group-configuration-dialog.component';
import { IUpsertRolePermissionDto } from '../../dtos/permission/upsert-role-permission.dto';
import { RolePermissionService, RoleService } from '../../services';
import { AppUtil } from '../../../../core/utils/app.util';

@Component({
    selector: 'app-permission-configuration',
    templateUrl: './permission-configuration.component.html',
    styleUrls: ['./permission-configuration.component.scss'],
    standalone: false
})
export class PermissionConfigurationComponent implements OnInit, OnDestroy {
    @ViewChild('addPermissionDialog') addPermissionDialog!: AddPermissionConfigurationDialogComponent;
    @ViewChild('upsertGroupDialog') upsertGroupDialog!: UpsertPermissionGroupDialogComponent;

    // Role selection
    protected roles: ISelectListItemDto[] = [];
    protected selectedRoleId: number | null = null;

    // Permission data
    protected isLoading = true;
    protected isSaving = false;
    protected groups: IGetPermissionGroupedListByRoleIdDto[] = [];
    protected filteredGroups: IGetPermissionGroupedListByRoleIdDto[] = [];
    protected hasChanges = false;
    private _originalGroups: IGetPermissionGroupedListByRoleIdDto[] = [];
    private _destroy$ = new Subject<void>();

    constructor(
        private readonly _permissionService: PermissionService,
        private readonly _rolePermissionService: RolePermissionService,
        private readonly _roleService: RoleService,
        private readonly _toastr: ToastrService,
        private readonly _cdr: ChangeDetectorRef
    ) { }

    public ngOnInit(): void {
        this._loadRoles();
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    // ------------------- Role Dropdown -------------------
    private _loadRoles(): void {
        // Load all roles (adjust pageSize as needed)
        this._roleService.getListItem()
            .pipe(take(1))
            .subscribe({
                next: (res) => {
                    this.roles = res;
                    if (this.roles.length > 0) {
                        // Select the first role by default
                        this.selectedRoleId = this.roles[0].key;
                        this._loadPermissions();
                    } else {
                        this._toastr.warning('No roles available');
                    }
                },
                error: () => this._toastr.error('Failed to load roles')
            });
    }

    protected onRoleChange(): void {
        if (this.selectedRoleId !== null) {
            this._loadPermissions();
        }
    }

    // ------------------- Permissions -------------------
    private _loadPermissions(): void {
        if (this.selectedRoleId === null) {
            this._toastr.warning('Please select a role');
            return;
        }
        this.isLoading = true;
        this._permissionService.getGroupedByRoleId(this.selectedRoleId)
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: (response: IGetPermissionGroupedListByRoleIdDto[]) => {
                    // Add collapse state to each group
                    this.groups = response.map(g => ({ ...g, isCollapsed: false }));
                    this.filteredGroups = [...this.groups];
                    this._originalGroups = JSON.parse(JSON.stringify(this.groups));
                    this.hasChanges = false;
                    this.isLoading = false;
                    this._cdr.detectChanges();
                },
                error: (err) => {
                    this._toastr.error(err.error?.message || 'Failed to load permissions');
                    this.isLoading = false;
                }
            });
    }

    // ------------------- Search -------------------
    protected onSearchEvent(event: ISearchEventDto): void {
        const query = event.query?.trim().toLowerCase() || '';
        if (event.type === SearchTypeEnum.Reset || !query) {
            this.filteredGroups = [...this.groups];
        } else {
            this.filteredGroups = this.groups
                .map(group => ({
                    ...group,
                    permissions: group.permissions.filter(p =>
                        p.value.toLowerCase().includes(query)
                    )
                }))
                .filter(group => group.permissions.length > 0);
        }
    }

    // ------------------- Toggle / Checkbox Handlers -------------------
    protected toggleGroupAll(group: IGetPermissionGroupedListByRoleIdDto, event: any): void {
        const checked = event.target.checked;
        group.permissions.forEach((p: IGetPermissionListItemDto) => p.isChecked = checked);
        this._permissionChecked(group);
    }

    protected onPermissionChecked(group: IGetPermissionGroupedListByRoleIdDto): void {
        this._permissionChecked(group);
    }

    private _permissionChecked(group: IGetPermissionGroupedListByRoleIdDto): void {
        group.isAllPermissionChecked = group.permissions.every(x => x.isChecked);
        this._compareHasChanges();
    }

    private _compareHasChanges(): void {
        this.hasChanges = JSON.stringify(this.groups) !== JSON.stringify(this._originalGroups);
    }

    // ------------------- Save -------------------
    protected upsertRolePermission(): void {
        if (this.selectedRoleId === null) {
            this._toastr.warning('No role selected');
            return;
        }
        this.isSaving = true;
        const payload = this._createPayload();
        this._rolePermissionService.upsert(payload)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this._toastr.success('Permissions saved successfully');
                    this.isSaving = false;
                    this.hasChanges = false;
                    this._originalGroups = JSON.parse(JSON.stringify(this.groups));
                    this._cdr.detectChanges();
                },
                error: (err) => {
                    this._toastr.error(err.error?.message || 'Update failed');
                    this.isSaving = false;
                }
            });
    }

    private _createPayload(): IUpsertRolePermissionDto {
        const payload: IUpsertRolePermissionDto = {
            roleId: this.selectedRoleId!,
            permissionIds: []
        };
        this.groups.forEach(g => {
            g.permissions.forEach(p => {
                if (p.isChecked) payload.permissionIds.push(p.key);
            });
        });
        return payload;
    }

    // ------------------- Dialog Handlers -------------------
    protected onAddPermission(): void {
        if (this.selectedRoleId === null) {
            this._toastr.warning('Please select a role first');
            return;
        }
        this.addPermissionDialog.open(this.selectedRoleId);
    }

    protected onPermissionAdded(): void {
        this._loadPermissions();
    }

    protected onAddPermissionGroup(): void {
        this.upsertGroupDialog.openAdd();
    }

    protected onPermissionGroupSaved(): void {
        this._loadPermissions();
    }
}