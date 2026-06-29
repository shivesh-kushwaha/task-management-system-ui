import { Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { take, Subject } from 'rxjs';
import { ISelectListItemDto } from '../../../../../../shared/dtos';
import { PermissionService } from '../../../../services/permission.service';
import { IAddPermissionDto } from '../../../../dtos';
import { PermissionGroupService } from '../../../../services/permission-group.service';

@Component({
    selector: 'app-add-permission-configuration-dialog',
    templateUrl: './add-permission-configuration-dialog.component.html',
    standalone: false
})
export class AddPermissionConfigurationDialogComponent implements AfterViewInit, OnDestroy {
    @ViewChild('addPermissionDialog') elementRef!: ElementRef;
    @Output() permissionAdded = new EventEmitter<void>();

    protected form: FormGroup;
    protected permissionGroups: ISelectListItemDto[] = [];
    protected isLoading = false;
    private _roleId!: number;
    private _modal?: Modal | null;
    private _destroy$ = new Subject<void>();

    constructor(
        private readonly _fb: FormBuilder,
        private readonly _toastr: ToastrService,
        private readonly _permissionService: PermissionService,
        private readonly _permissionGroupService: PermissionGroupService
    ) {
        this.form = this._initializeForm();
    }

    public ngAfterViewInit(): void {
        if (this.elementRef) {
            this._modal = new Modal(this.elementRef.nativeElement, {
                backdrop: 'static',
                focus: false
            });
        }
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
        this._modal?.dispose();
    }

    // Open dialog with roleId and load permission groups
    public open(roleId: number): void {
        this._roleId = roleId;
        this._loadPermissionGroups();
        this.form.reset({
            permissionGroupId: null,
            name: '',
            code: ''
        });
        this.isLoading = false;
        this._modal?.show();
    }

    protected onClose(): void {
        this._modal?.hide();
    }

    protected onSubmit(): void {
        if (this.form.invalid) {
            Object.keys(this.form.controls).forEach(key => {
                this.form.get(key)?.markAsTouched();
            });
            return;
        }

        const payload: IAddPermissionDto = {
            permissionGroupId: this.form.value.permissionGroupId,
            name: this.form.value.name.trim(),
            code: this.form.value.code.trim()
        };

        this.isLoading = true;
        this._permissionService.addPermission(payload)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this._toastr.success('Permission added successfully');
                    this.isLoading = false;
                    this._modal?.hide();
                    this.permissionAdded.emit(); // notify parent to refresh
                },
                error: (err) => {
                    this._toastr.error(err.error?.message || 'Failed to add permission');
                    this.isLoading = false;
                }
            });
    }

    protected get f() {
        return this.form.controls;
    }

    private _loadPermissionGroups(): void {
        this.isLoading = true;
        this._permissionGroupService.getPermissionGroupListItem()
            .pipe(take(1))
            .subscribe({
                next: (response: ISelectListItemDto[]) => {
                    this.permissionGroups = response;
                    this.isLoading = false;
                },
                error: (err: any) => {
                    this._toastr.error(err.error?.message);
                    this.isLoading = false;
                }
            })
    }

    private _initializeForm(): FormGroup {
        return this._fb.group({
            permissionGroupId: [null, [Validators.required]],
            name: ['', [Validators.required, Validators.maxLength(100)]],
            code: ['', [Validators.required, Validators.maxLength(50)]]
        });
    }
}