import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddProjectDto, IUpdateProjectDto } from '../../dtos';
import { ProjectTypeEnum } from '../../../../core/enums';

@Component({
  selector: 'app-upsert-project',
  templateUrl: './upsert-project.component.html',
  standalone: false,
})
export class UpsertProjectComponent implements OnInit {
  @Input() projectId: number | null = null; // null = Add mode, number = Edit mode

  // In edit mode, pass the existing project data via this input
  @Input() existingProject: IUpdateProjectDto | null = null;

  form!: FormGroup;
  projectTypeOptions = Object.entries(ProjectTypeEnum)
    .filter(([, value]) => typeof value === 'number')
    .map(([key, value]) => ({ label: key, value }));

  get isEditMode(): boolean {
    return this.projectId !== null;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [
        this.existingProject?.name ?? '',
        [Validators.required, Validators.maxLength(200)],
      ],
      description: [this.existingProject?.description ?? ''],
      type: [
        this.existingProject?.type ?? '',
        Validators.required,
      ],
      teamId: [this.existingProject?.teamId ?? null],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      const payload: IUpdateProjectDto = {
        id: this.projectId!,
        ...this.form.value,
      };
      console.log('Update payload:', payload);
      // TODO: call your update service here
    } else {
      const payload: IAddProjectDto = { ...this.form.value };
      console.log('Add payload:', payload);
      // TODO: call your add service here
    }
  }

  onCancel(): void {
    this.form.reset();
    // TODO: navigate away or close modal
  }
}