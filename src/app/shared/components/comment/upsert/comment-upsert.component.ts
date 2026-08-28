import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { TypeEnum } from '../../../../core/enums';
import { IAddCommentDto, IUpdateCommentDto } from '../../../dtos';
import { AppUtil } from '../../../../core/utils/app.util';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'app-comment-upsert',
  templateUrl: './comment-upsert.component.html',
  standalone: false,
})
export class CommentUpsertComponent implements OnChanges {
  @Input() type: TypeEnum = TypeEnum.Comment;
  @Input() typeId: number = 0;
  @Input() id: number = 0;
  @Input() description: string = AppUtil.EmptyString;

  @Output() commentAddedOrUpdatedEvent = new EventEmitter<boolean>();
  @Output() cancelled = new EventEmitter<void>();

  protected form!: FormGroup;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _commentService: CommentService,
  ) {
    this._initializeForm();
  }

  ngOnChanges(): void {
    if (this.id > 0 && this.description) {
      this._assignForm();
    } else {
      this._resetForm();
    }
  }

  protected onCancel(): void {
    this.cancelled.emit();
    this._resetForm();
  }

  protected onSubmit(): void {
    if (!this._isFormValid()) {
      return;
    }

    if (this.id > 0) {
      this._update();
    } else {
      this._add();
    }
  }

  private _isFormValid(): boolean {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return false;
    }
    return true;
  }

  private _add(): void {
    const payload: IAddCommentDto = {
      description: this.form.value.description,
      type: this.type,
      typeId: this.typeId,
    };

    this._commentService.add(payload).pipe(take(1)).subscribe({
      next: () => {
        this._toastr.success('Comment has been added successfully.');
        this.commentAddedOrUpdatedEvent.emit(true);
        this._resetForm();
      },
      error: (err: HttpErrorResponse) => {
        this._toastr.error(err.error?.message || 'Add failed');
      },
    });
  }

  private _update(): void {
    const payload: IUpdateCommentDto = {
      id: this.id,
      description: this.form.value.description,
      type: this.type,
      typeId: this.typeId,
    };

    this._commentService.update(payload).pipe(take(1)).subscribe({
      next: () => {
        this._toastr.success('Comment has been updated successfully.');
        this.commentAddedOrUpdatedEvent.emit(true);
        this._resetForm();
      },
      error: (err: HttpErrorResponse) => {
        this._toastr.error(err.error?.message || 'Update failed');
      },
    });
  }

  private _initializeForm(): void {
    this.form = this._fb.group({
      description: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  private _assignForm(): void {
    this.form.patchValue({
      description: this.description || '',
    });
  }

  private _resetForm(): void {
    this.form.reset({ description: '' });
    this.id = 0;
    this.description = AppUtil.EmptyString;
  }

  protected get f() {
    return this.form.controls;
  }
}