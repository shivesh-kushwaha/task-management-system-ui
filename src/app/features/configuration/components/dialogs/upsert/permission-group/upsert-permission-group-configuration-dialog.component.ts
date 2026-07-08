import { Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { take, Subject } from 'rxjs';
import { IUpsertPermissionGroupDto } from '../../../../dtos/permission/upsert-permission-group.dto';
import { PermissionGroupService } from '../../../../services/permission-group.service';

@Component({
    selector: 'app-upsert-permission-group-configuration-dialog',
    templateUrl: './upsert-permission-group-configuration-dialog.component.html',
    standalone: false
})
export class UpsertPermissionGroupDialogComponent implements AfterViewInit, OnDestroy {
    @ViewChild('upsertPermissionGroupDialog') elementRef!: ElementRef;
    @Output() groupSaved = new EventEmitter<void>(); // emit after successful add/update

    protected form: FormGroup;
    protected isEditMode = false;
    protected isSubmitting = false;
    private _groupId: number | null = null;
    private _modal?: Modal | null;
    private _destroy$ = new Subject<void>();

    constructor(
        private _fb: FormBuilder,
        private _toastr: ToastrService,
        private _permissionGroupService: PermissionGroupService
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

    /** Open dialog in Add mode */
    public openAdd(): void {
        this.isEditMode = false;
        this._groupId = null;
        this.form.reset({ name: '' });
        this.isSubmitting = false;
        this._modal?.show();
    }

    /** Open dialog in Edit mode, pass existing group data */
    public openEdit(group: IUpsertPermissionGroupDto): void {
        this.isEditMode = true;
        this._groupId = group.key;
        this.form.patchValue({ name: group.value });
        this.isSubmitting = false;
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

        this.isSubmitting = true;

        const payload = this._createPayload();

        this._permissionGroupService.upsertPermissionGroup(payload)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this._toastr.success(
                        `Permission group ${this.isEditMode ? 'updated' : 'added'} successfully`
                    );
                    this.isSubmitting = false;
                    this._modal?.hide();
                    this.groupSaved.emit();
                },
                error: (err: any) => {
                    this._toastr.error(err.error?.message || 'Operation failed');
                    this.isSubmitting = false;
                }
            });
    }

    protected get f() {
        return this.form.controls;
    }

    private _initializeForm(): FormGroup {
        return this._fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]]
        });
    }

    private _createPayload(): IUpsertPermissionGroupDto {
        const name = this.form.value.name.trim();

        const payload: IUpsertPermissionGroupDto = {
            key: 0,
            value: name
        };

        if (this.isEditMode && this._groupId) {
            payload.key = this._groupId;
        }

        return payload;
    }
}