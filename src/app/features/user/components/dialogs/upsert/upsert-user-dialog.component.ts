import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Modal } from 'bootstrap';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ISelectListItemDto } from '../../../../../shared/dtos';
import { IAddUserDto, IUpdateUserDto, IGetUserPagedListDto } from '../../../dtos';
import { UserService } from '../../../services/user.service';
import { RoleService, UserStatesService } from '../../../services';

@Component({
    selector: 'app-upsert-user-dialog',
    templateUrl: './upsert-user-dialog.component.html',
    standalone: false
})
export class UpsertUserDialogComponent implements AfterViewInit {
    @ViewChild('addUserDialog') elementRef!: ElementRef;

    protected form: FormGroup;
    protected roles: ISelectListItemDto[] = [];
    protected isLoading = false;
    protected id: number = 0;

    private _modal?: Modal | null;
    private _selectedRoles: number[] = [];

    constructor(
        private readonly _fb: FormBuilder,
        private readonly _toastr: ToastrService,
        private readonly _userService: UserService,
        private readonly _roleService: RoleService,
        private readonly _userStatesService: UserStatesService
    ) {
        this.form = this._initializeForm();
    }

    public ngAfterViewInit(): void {
        if (this.elementRef) {
            this._modal = new Modal(this.elementRef.nativeElement, {
                backdrop: 'static',
                focus: false,
            });
        }
    }

    public open(user: IGetUserPagedListDto | null): void {
        this._loadRoles();
        if (user === null) {
            // Add mode
            this.id = 0;
            this._selectedRoles = [];
            this.form.reset({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                roles: []
            });
        } else {
            // Edit mode
            this.id = user.id;
            this._assignForm(user);
        }

        this._modal?.show();
    }

    protected onClose(): void {
        this._close();
    }

    protected onSubmit(): void {
        if (!this._isFormValid()) {
            return;
        }

        if (this.id) {
            this._update();
        } else {
            this._add();
        }
    }

    protected onRoleChange(roleId: number, event: any): void {
        if (event.target.checked) {
            if (!this._selectedRoles.includes(roleId)) {
                this._selectedRoles.push(roleId);
            }
        } else {
            const index = this._selectedRoles.indexOf(roleId);
            if (index > -1) {
                this._selectedRoles.splice(index, 1);
            }
        }
        this.form.get('roles')?.setValue(this._selectedRoles);
        this.form.get('roles')?.markAsTouched();
    }

    protected isRoleSelected(roleKey: number): boolean {
        return this._selectedRoles.includes(roleKey);
    }

    private _add(): void {
        const payload = this._createPayloadToAdd();

        this.isLoading = true;
        this._userService.register(payload).pipe(take(1)).subscribe({
            next: () => {
                this._toastr.success('User added successfully.');
                this.isLoading = false;
                this._close();
                this._userStatesService.notifyUserChanged();
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message || 'An error occurred while adding the user.');
                this.isLoading = false;
            }
        });
    }

    private _update(): void {
        const payload = this._createPayloadToUpdate();

        this.isLoading = true;
        this._userService.updateUser(payload).pipe(take(1)).subscribe({
            next: () => {
                this._toastr.success('User updated successfully.');
                this.isLoading = false;
                this._close();
                this._userStatesService.notifyUserChanged();
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message || 'An error occurred while updating the user.');
                this.isLoading = false;
            }
        });
    }

    private _close(): void {
        this._modal?.hide();
        this._resetForm();
    }

    private _loadRoles(): void {
        this._roleService.getListItem().pipe(take(1)).subscribe({
            next: (response: ISelectListItemDto[]) => {
                this.roles = response;
            },
            error: (err: any) => {
                this._toastr.error('Failed to load roles.');
            }
        });
    }

    private _isFormValid(): boolean {
        if (this.form.invalid) {
            Object.keys(this.form.controls).forEach(key => {
                const control = this.form.get(key);
                control?.markAsTouched();
            });
            return false;
        }
        return true;
    }

    private _initializeForm(): FormGroup {
        return this._fb.group({
            firstName: ['', [Validators.required, Validators.maxLength(50)]],
            lastName: ['', [Validators.required, Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
            roles: [[], [Validators.required, this._validateRoles.bind(this)]]
        });
    }

    private _validateRoles(control: AbstractControl): { [key: string]: any } | null {
        const value = control.value;
        if (!value || (Array.isArray(value) && value.length === 0)) {
            return { 'required': true };
        }
        return null;
    }

    private _assignForm(user: IGetUserPagedListDto): void {
        this._selectedRoles = user.roles.map(role => role.key);

        const roleIds = user.roles.map(role => role.key);

        this.form.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            roles: roleIds || []
        });
    }

    private _createPayloadToAdd(): IAddUserDto {
        const formValue = this.form.value;

        const userData: IAddUserDto = {
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            email: formValue.email,
            phoneNumber: formValue.phoneNumber,
            password: 'Welcome@123', // Default password for new users
            roles: this._selectedRoles
        };

        return userData;
    }

    private _createPayloadToUpdate(): IUpdateUserDto {
        const formValue = this.form.value;

        const userData: IUpdateUserDto = {
            id: this.id,
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            email: formValue.email,
            phoneNumber: formValue.phoneNumber,
            roles: this._selectedRoles
        };

        return userData;
    }

    private _resetForm(): void {
        this.form.reset({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            roles: []
        });
        this._selectedRoles = [];
        this.id = 0;
    }

    protected get f() {
        return this.form.controls;
    }
}