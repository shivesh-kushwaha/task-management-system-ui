import { Component, Input, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PermissionService } from '../../services/permission.service';
import { ISearchEventDto } from '../../../../shared/dtos';
import { SearchTypeEnum } from '../../../../core/enums';
import { Subject, takeUntil, take } from 'rxjs';
import { AddPermissionConfigurationDialogComponent } from '../dialogs/add/permission/add-permission-configuration-dialog.component';
import { IGetPermissionGroupedListByRoleIdDto, IGetPermissionListItemDto } from '../../dtos';
import { UpsertPermissionGroupDialogComponent } from '../dialogs/upsert/permission-group/upsert-permission-group-configuration-dialog.component';
import { IUpsertRolePermissionDto } from '../../dtos/permission/upsert-role-permission.dto';
import { RolePermissionService } from '../../services';

@Component({
    selector: 'app-permission-configuration',
    templateUrl: './permission-configuration.component.html',
    styleUrls: ['./permission-configuration.component.scss'],
    standalone: false
})
export class PermissionConfigurationComponent implements OnInit, OnDestroy {
    @ViewChild('addPermissionDialog') addPermissionDialog!: AddPermissionConfigurationDialogComponent;
    @ViewChild('upsertGroupDialog') upsertGroupDialog!: UpsertPermissionGroupDialogComponent;

    @Input() roleId: number = 1; // Role ID passed from parent (or route)

    protected isLoading = false;
    protected isSaving = false;
    protected groups: IGetPermissionGroupedListByRoleIdDto[] = [];
    protected filteredGroups: IGetPermissionGroupedListByRoleIdDto[] = [];
    protected hasChanges = false;
    private _originalGroups: IGetPermissionGroupedListByRoleIdDto[] = [];
    private _destroy$ = new Subject<void>();

    constructor(
        private readonly _permissionService: PermissionService,
        private readonly _rolePermissionService: RolePermissionService,
        private readonly _toastr: ToastrService,
        private readonly _cdr: ChangeDetectorRef
    ) { }

    public ngOnInit(): void {
        this._loadPermissions();
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    // Search
    protected onSearchEvent(event: ISearchEventDto): void {
        const query = event.query?.trim().toLowerCase() || '';
        if (event.type === SearchTypeEnum.Reset || !query) {
            this.filteredGroups = [...this.groups];
        } else {
            this.filteredGroups = this.groups
                .map(group => ({
                    ...group,
                    permissions: group.permissions.filter(p => p.value.toLowerCase().includes(query))
                }))
                .filter(group => group.permissions.length > 0);
        }
    }

    // Toggle all permissions in a group
    protected toggleGroupAll(group: IGetPermissionGroupedListByRoleIdDto, event: any): void {
        const checked = event.target.checked;
        group.permissions.forEach((p: IGetPermissionListItemDto) => p.isChecked = checked);
        this._permissionChecked(group);
        this._compareHasChanges();
    }

    // Called when any permission checkbox changes
    protected onPermissionChecked(group: IGetPermissionGroupedListByRoleIdDto): void {
        this._permissionChecked(group);
    }

    // Save updates
    protected upsertRolePermission(): void {
        this.isSaving = true;
        const payload = this._createPayload();
        this._rolePermissionService.upsert(payload)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this._toastr.success('Permissions saved successfully');
                    this.isSaving = false;
                    this.hasChanges = false;
                    // Refresh original state
                    this._originalGroups = JSON.parse(JSON.stringify(this.groups));
                    this._cdr.detectChanges();
                },
                error: (err) => {
                    this._toastr.error(err.error?.message || 'Update failed');
                    this.isSaving = false;
                }
            });
    }

    protected onAddPermission(): void {
        this.addPermissionDialog.open(this.roleId);
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

    private _loadPermissions(): void {
        if (!this.roleId) {
            this._toastr.warning('No role selected');
            return;
        }
        this.isLoading = true;
        this._permissionService.getGroupedByRoleId(this.roleId)
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: (response: IGetPermissionGroupedListByRoleIdDto[]) => {
                    // Add collapse state to each group
                    this.groups = response;
                    this.filteredGroups = [...this.groups];
                    this._originalGroups = JSON.parse(JSON.stringify(this.groups)); // deep copy for change detection
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

    private _permissionChecked(group: IGetPermissionGroupedListByRoleIdDto): void {
        group.isAllPermissionChecked = group.permissions.every(x => x.isChecked);
        this._compareHasChanges();
    }

    // Compare current state with original to determine if changes exist
    private _compareHasChanges(): void {
        this.hasChanges = JSON.stringify(this.groups) !== JSON.stringify(this._originalGroups);
    }

    private _createPayload(): IUpsertRolePermissionDto {
        const upsertRolePermission: IUpsertRolePermissionDto = {
            roleId: this.roleId,
            permissionIds: []
        }

        this.groups.forEach(g => {
            g.permissions.forEach(p => {
                if (p.isChecked) upsertRolePermission.permissionIds.push(p.key);
            });
        });

        return upsertRolePermission;
    }
}