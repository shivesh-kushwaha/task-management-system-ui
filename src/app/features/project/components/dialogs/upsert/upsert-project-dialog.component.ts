import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { getProjectTypes, ProjectTypeEnum } from '../../../../../core/enums';
import { ISelectListItemDto } from '../../../../../shared/dtos';
import { IAddProjectDto, IGetProjectPagedListDto, IUpdateProjectDto } from '../../../dtos';
import { AppUtil } from '../../../../../core/utils/app.util';
import { ProjectService } from '../../../services/project.service';
import { ProjectStatesService } from '../../../services/project-states.service';
import { TeamService } from '../../../services';

@Component({
    selector: 'app-upsert-project-dialog',
    templateUrl: './upsert-project-dialog.component.html',
    standalone: false
})
export class UpsertProjectDialogComponent implements AfterViewInit {
    @ViewChild('addProjectDialog') elementRef!: ElementRef;

    protected form: FormGroup;
    protected projectTypes: ISelectListItemDto[];
    protected teams: ISelectListItemDto[];
    protected isLoading = false;

    protected readonly ProjectTypeEnum = ProjectTypeEnum;

    private _modal?: Modal | null;
    private id: number = 0;

    constructor(private readonly _fb: FormBuilder,
        private readonly _toastr: ToastrService,
        private readonly _projectStatesService: ProjectStatesService,
        private readonly _projectService: ProjectService,
        private readonly _teamService: TeamService) {
        this.projectTypes = getProjectTypes();
        this.teams = [];
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

    public open(project: IGetProjectPagedListDto | null): void {
        this._loadTeams();
        if (project === null) {
            this._initializeForm();
        } else {
            this.id = project.id;
            this._assignForm(project);
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

        if (this.id) 
            this._update();
        else
            this._add();
    }

    private _add(): void {
        const payload = this._createPayloadToAdd();

        this.isLoading = true;
        this._projectService.addProject(payload).pipe(take(1)).subscribe({
            next: () => {
                this._toastr.success('Project added successfully.');
                this.isLoading = false;
                this._close();
                this._projectStatesService.notifyProjectChanged();
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
                this.isLoading = false;
            }
        });
    }

    private _update(): void {
        const payload = this._createPayloadToUpdate();

        this.isLoading = true;
        this._projectService.updateProject(payload).pipe(take(1)).subscribe({
            next: () => {
                this._toastr.success('Project updated successfully.');
                this.isLoading = false;
                this._close();
                this._projectStatesService.notifyProjectChanged();
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
                this.isLoading = false;
            }
        });
    }

    private _close(): void {
        this._modal?.hide();
        this._resetForm();
    }

    private _loadTeams(): void {
        this._teamService.getListItem().pipe(take(1)).subscribe({
            next: (response: ISelectListItemDto[]) => {
                this.teams = response;
            },
            error: (err: any) => {
                this._toastr.error('err.error?.message');
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
            name: [AppUtil.EmptyString, [Validators.required, Validators.maxLength(100)]],
            description: [AppUtil.EmptyString, [Validators.maxLength(500)]],
            type: [null, [Validators.required]],
            teamId: [null]
        });
    }

    private _assignForm(project: IGetProjectPagedListDto): void {
        this.form.patchValue({
            name: project.name,
            description: project.description || AppUtil.EmptyString,
            type: project.type,
            teamId: project.teamId || null
        });
    }

    private _createPayloadToAdd(): IAddProjectDto {
        const formValue = this.form.value;

        const projectData: IAddProjectDto = {
            name: formValue.name,
            description: formValue.description || null,
            type: formValue.type,
            teamId: formValue.type === ProjectTypeEnum.Team ? formValue.teamId : null
        };

        return projectData;
    }

    private _createPayloadToUpdate(): IUpdateProjectDto {
        const formValue = this.form.value;

        const projectData: IUpdateProjectDto = {
            id: this.id,
            name: formValue.name,
            description: formValue.description,
            type: formValue.type,
            teamId: formValue.type === ProjectTypeEnum.Team ? formValue.teamId: null
        }

        return projectData;
    }

    private _resetForm(): void {
        this.form.reset({
            name: AppUtil.EmptyString,
            description: AppUtil.EmptyString,
            type: null,
            teamId: null
        });
    }

    protected get f() {
        return this.form.controls;
    }
}