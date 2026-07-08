import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { take, Subject } from 'rxjs';
import { RoleService, RoleStatesService } from '../../../../services';
import { IUpsertRoleDto } from '../../../../dtos';

@Component({
    selector: 'app-upsert-role-configuration-dialog',
    templateUrl: './upsert-role-configuration-dialog.component.html',
    standalone: false
})
export class UpsertRoleConfigurationDialogComponent implements AfterViewInit, OnDestroy {
    @ViewChild('upsertRoleDialog') elementRef!: ElementRef;
    @Output() roleSaved = new EventEmitter<void>();

    protected form: FormGroup;
    protected isEditMode = false;
    protected isSubmitting = false;
    private _roleId: number | null = null;
    private _modal?: Modal | null;
    private _destroy$ = new Subject<void>();

    constructor(
        private readonly _fb: FormBuilder,
        private readonly _toastr: ToastrService,
        private readonly _roleService: RoleService,
        private readonly _roleStatesService: RoleStatesService
    ) {
        this.form = this._initializeForm();
    }

    ngAfterViewInit(): void {
        if (this.elementRef) {
            this._modal = new Modal(this.elementRef.nativeElement, {
                backdrop: 'static',
                focus: false
            });
        }
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
        this._modal?.dispose();
    }

    /** Open dialog in Add mode */
    openAdd(): void {
        this.isEditMode = false;
        this._roleId = null;
        this.form.reset({ name: '', code: '', description: '' });
        this.isSubmitting = false;
        this._modal?.show();
    }

    /** Open dialog in Edit mode */
    openEdit(role: IUpsertRoleDto): void {
        this.isEditMode = true;
        this._roleId = role.id || null;
        this.form.patchValue({
            name: role.name,
            code: role.code,
            description: role.description || ''
        });
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

        const payload: IUpsertRoleDto = {
            id: this._roleId,
            name: this.form.value.name.trim(),
            code: this.form.value.code.trim().toUpperCase(),
            description: this.form.value.description?.trim() || null
        };

        this.isSubmitting = true;
        this._roleService.upsert(payload)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this._toastr.success(`Role ${this.isEditMode ? 'updated' : 'added'} successfully`);
                    this.isSubmitting = false;
                    this._modal?.hide();
                    this._roleStatesService.notifyRoleChanged();
                    this.roleSaved.emit();
                },
                error: (err: any) => {
                    this._toastr.error(err.error?.message || 'Operation failed');
                    this.isSubmitting = false;
                }
            });
    }

    private _initializeForm(): FormGroup {
        return this._fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            code: ['', [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern(/^[A-Z0-9_]+$/) // uppercase letters, numbers, underscore
            ]],
            description: ['', Validators.maxLength(500)]
        });
    }

    protected get f() {
        return this.form.controls;
    }
}