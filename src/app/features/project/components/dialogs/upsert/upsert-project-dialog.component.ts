import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getProjectTypes, ProjectTypeEnum } from '../../../../../core/enums';
import { ISelectListItemDto } from '../../../../../shared/dtos';
import { IAddProjectDto, IGetProjectPagedListDto } from '../../../dtos';
import { AppUtil } from '../../../../../core/utils/app.util';
import { ProjectService } from '../../../services/project.service';
import { ToastrService } from 'ngx-toastr';
import { ProjectStatesService } from '../../../services/project-states.service';
import { TeamService } from '../../../services';
import { take } from 'rxjs';

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
        if (project === null) {
            this._initializeForm();
        } else {
            this._loadTeams();
            this._assignForm(project);
        }
        this._modal?.show();
    }

    protected onClose(): void {
        this._close();
    }

    protected onTypeChanged(): void {
        this.form.get('type')?.valueChanges.pipe(take(1)).subscribe((type: ProjectTypeEnum) => {
            const teamIdControl = this.form.get('teamId');
            console.log(type);
            if (type === ProjectTypeEnum.Team) {
                teamIdControl?.setValidators([Validators.required]);
                this._loadTeams();
            } else {
                teamIdControl?.clearValidators();
                teamIdControl?.setValue(null);
                this.teams = [];
            }
            teamIdControl?.updateValueAndValidity();
        });
    }

    protected onSubmit(): void {
        if (!this._isFormValid()) {
            return;
        }

        const payload = this._createPayload();

        this.isLoading = true;
        this._projectService.addProject(payload).pipe(take(1)).subscribe({
            next: () => {
                this._toastr.success('Project added successfully.');
                this.isLoading = false;
                this._close();
                this._projectStatesService.projectAddedNotify();
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

    private _createPayload(): IAddProjectDto {
        const formValue = this.form.value;

        const projectData: IAddProjectDto = {
            name: formValue.name,
            description: formValue.description || null,
            type: formValue.type,
            teamId: formValue.type === ProjectTypeEnum.Team ? formValue.teamId : null
        };

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