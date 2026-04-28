import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { WorkItemService, WorkItemStatesService } from '../../../../services';
import { IAddWorkItemDto, IGetWorkItemPagedListDto, ISelectListItemDto, IUpdateWorkItemDto } from '../../../../../shared/dtos';
import { ProjectService, UserService, WorkItemTypeService } from '../../../../../shared/services';
import { AppUtil } from '../../../../../core/utils/app.util';

@Component({
    selector: 'app-upsert-work-item-dialog',
    templateUrl: './upsert-work-item-dialog.component.html',
    standalone: false,
})
export class UpsertWorkItemDialogComponent implements AfterViewInit {
    @ViewChild('taskDialog') elementRef!: ElementRef;

    protected form: FormGroup;
    protected isLoading = false;
    protected id: number = 0;
    protected showParentSection = false;
    protected projects: ISelectListItemDto[];
    protected parentTasks: ISelectListItemDto[];
    protected users: ISelectListItemDto[];
    protected workItemTypes: ISelectListItemDto[];
    protected parentIdFromRoute: number = 0;
    protected heading: string = AppUtil.EmptyString;

    private _modal?: Modal | null;

    constructor(
        private readonly _fb: FormBuilder,
        private readonly _toastr: ToastrService,
        private readonly _workItemStatesService: WorkItemStatesService,
        private readonly _workItemService: WorkItemService,
        private readonly _projectService: ProjectService,
        private readonly _workItemTypeService: WorkItemTypeService,
        private readonly _userService: UserService,
        private readonly _route: ActivatedRoute,
    ) {
        this.projects = [];
        this.parentTasks = [];
        this.users = [];
        this.workItemTypes = [];
        this.form = this._initializeForm();
    }

    ngAfterViewInit(): void {
        if (this.elementRef) {
            this._modal = new Modal(this.elementRef.nativeElement, {
                backdrop: 'static',
                focus: false,
            });
        }
    }

    public open(task: IGetWorkItemPagedListDto | null): void {
        this._loadProjects();
        this._loadUsers();
        this._loadParentTasks();
        this._loadLoadWorkItemTypes();

        this.showParentSection = false;
        this.parentIdFromRoute = this._route.snapshot.params['id'];

        if (task === null) {
            this.id = 0;
            this._resetForm();
            this.form.get('projectId')?.clearValidators();
            this.form.get('projectId')?.updateValueAndValidity();
            this.heading = 'Add Sub Task';

            if (this.parentIdFromRoute) {
                this.heading = 'Add Sub Task';
                const parentIdNum = Number(this.parentIdFromRoute);
                if (!isNaN(parentIdNum) && parentIdNum > 0) {
                    this.showParentSection = true;
                    this.form.patchValue({ parentId: parentIdNum });
                    this.form.get('parentId')?.setValidators([Validators.required]);
                    this.form.get('parentId')?.updateValueAndValidity();
                } else {
                    this.showParentSection = false;
                    this.form.get('parentId')?.clearValidators();
                    this.form.get('parentId')?.setValue(null);
                }
            }
        } else {
            this.heading = this.parentIdFromRoute ? 'Update Sub Task' : 'Update Task';
            this.id = task.id;
            this._assignForm(task);
            this.showParentSection = !!this.parentIdFromRoute;
            this.form.get('parentId')?.clearValidators();
            this.form.get('parentId')?.updateValueAndValidity();

            const selected = this.workItemTypes.find(opt => opt.value === task.type);
            this.form.get('typeId')?.setValue(selected ? selected.key : null);
        }
        this._modal?.show();
    }

    protected onClose(): void {
        this._close();
    }

    protected onSubmit(): void {
        if (!this._isFormValid()) return;
        if (this.id) this._update();
        else this._add();
    }


    // -----------------------------------------------------------------
    // Private methods
    // -----------------------------------------------------------------
    private _loadProjects(): void {
        this._projectService.getListItem().pipe(take(1)).subscribe({
            next: (response: ISelectListItemDto[]) => {
                Object.assign(this.projects, response);
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
            }
        });
    }

    private _loadUsers(): void {
        this._userService.getListItem().pipe(take(1)).subscribe({
            next: (response: ISelectListItemDto[]) => {
                Object.assign(this.users, response);
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
            }
        });
    }

    private _loadParentTasks(): void {
        this._workItemService.getListItem().pipe(take(1)).subscribe({
            next: (response: ISelectListItemDto[]) => {
                Object.assign(this.parentTasks, response);
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
            }
        });
    }

    private _loadLoadWorkItemTypes(): void {
        this._workItemTypeService.getListItem().pipe(take(1)).subscribe({
            next: (response: ISelectListItemDto[]) => {
                Object.assign(this.workItemTypes, response);
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
            }
        });
    }

    private _add(): void {
        const payload = this._createPayloadToAdd();
        this.isLoading = true;
        this._workItemService.addWorkItem(payload).pipe(take(1)).subscribe({
            next: () => {
                const message = this.parentIdFromRoute ? 'Sub task' : 'Task';
                this._toastr.success(message + 'added successfully.');
                this.isLoading = false;
                this._close();
                this._workItemStatesService.notifyWorkItemChanged();
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
                this.isLoading = false;
            },
        });
    }

    private _update(): void {
        const payload = this._createPayloadToUpdate();
        this.isLoading = true;
        this._workItemService.updateWorkItem(payload).pipe(take(1)).subscribe({
            next: () => {
                const message = this.parentIdFromRoute ? 'Sub task' : 'Task';
                this._toastr.success(message + 'updated successfully.');
                this.isLoading = false;
                this._close();
                this._workItemStatesService.notifyWorkItemChanged();
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
                this.isLoading = false;
            },
        });
    }

    private _close(): void {
        this._modal?.hide();
        this._resetForm();
        this.id = 0;
        this.showParentSection = false;
    }

    private _initializeForm(): FormGroup {
        return this._fb.group({
            projectId: [null],                         // optional – no validators
            parentId: [null],
            title: ['', [Validators.required, Validators.maxLength(200)]],
            description: ['', Validators.maxLength(1000)],
            typeId: [null, Validators.required],
            assignedToId: [null],
            dueDate: ['', Validators.required],
        });
    }

    private _assignForm(task: IGetWorkItemPagedListDto): void {
        this.form.patchValue({
            projectId: task.projectId || null,
            parentId: task.parentId || null,
            title: task.title,
            description: task.description || '',
            assignedToId: task.assignedToId || null,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '',
        });
    }

    private _createPayloadToAdd(): IAddWorkItemDto {
        const f = this.form.value;

        return {
            projectId: f.projectId,
            parentId: f.parentId || null,
            title: f.title,
            description: f.description || null,
            typeId: f.typeId,
            assignedToId: f.assignedToId || null,
            dueDate: f.dueDate,
        };
    }

    private _createPayloadToUpdate(): IUpdateWorkItemDto {
        const base = this._createPayloadToAdd();
        return { ...base, id: this.id };
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

    private _resetForm(): void {
        this.form.reset({
            projectId: null,
            parentId: null,
            title: '',
            description: '',
            typeId: null,
            assignedToId: null,
            dueDate: '',
        });
        this.form.get('projectId')?.clearValidators();
        this.form.get('parentId')?.clearValidators();
        this.form.get('projectId')?.updateValueAndValidity();
        this.form.get('parentId')?.updateValueAndValidity();
    }

    protected get f() {
        return this.form.controls;
    }
}