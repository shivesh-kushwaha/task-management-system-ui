import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getProjectTypes, ProjectTypeEnum } from '../../../../../core/enums';
import { ISelectListItemDto } from '../../../../../shared/dtos';
import { IAddProjectDto } from '../../../dtos';
import { AppUtil } from '../../../../../core/utils/app.util';
import { ProjectService } from '../../../services/project.service';
import { ToastrService } from 'ngx-toastr';
import { ProjectStatesService } from '../../../services/project-states.service';

@Component({
    selector: 'app-add-project-dialog',
    templateUrl: './add-project-dialog.component.html',
    standalone: false
})
export class AddProjectDialogComponent implements AfterViewInit {
    @ViewChild('addProjectDialog') elementRef!: ElementRef;

    protected form: FormGroup;
    protected projectTypes: ISelectListItemDto[];
    protected teams: ISelectListItemDto[];
    protected isLoading = false;
    
    protected readonly ProjectTypeEnum = ProjectTypeEnum;

    private _modal?: Modal | null;

    constructor(private readonly _fb: FormBuilder,
        private readonly _toastr: ToastrService,
        private readonly _projectService: ProjectService,
        private readonly _projectStatesService: ProjectStatesService) {
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

    public open(): void {
        this._initializeForm();
        this._modal?.show();
    }

    protected onClose(): void {
        this._close();
    }

    protected onTypeChanged(): void {
        this.form.get('type')?.valueChanges.subscribe((type: ProjectTypeEnum) => {
            const teamIdControl = this.form.get('teamId');

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
        this._projectService.addProject(payload).subscribe({
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
        this.teams = [
            { key: 1, value: 'Development Team' },
            { key: 2, value: 'Design Team' },
            { key: 3, value: 'QA Team' },
            { key: 4, value: 'Management Team' }
        ];
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