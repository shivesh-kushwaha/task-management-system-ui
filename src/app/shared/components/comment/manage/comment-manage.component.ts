import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TypeEnum } from '../../../../core/enums';
import { CommentService, TokenService } from '../../../services';
import { IGetCommentPagedListDto, IGetCommentPagedListRequestDto, IPagedListResponseDto } from '../../../dtos';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AppUtil } from '../../../../core/utils/app.util';

@Component({
    selector: 'app-comment-manage',
    templateUrl: './comment-manage.component.html',
    standalone: false,
})
export class CommentManageComponent implements OnChanges {
    @Input() type: TypeEnum = TypeEnum.Comment;
    @Input() typeId: number = 0;

    protected comments: IGetCommentPagedListDto[] = [];
    protected totalCount: number = 0;
    protected request: IGetCommentPagedListRequestDto;
    protected isLoading = false;

    // Toggle between "Add Comment" button and the upsert form
    protected showAddButton = true;
    protected selectedId = 0;
    protected description = AppUtil.EmptyString;

    protected readonly TypeEnum = TypeEnum;

    private _commentColumnName = {
        Description: 'description',
        Type: 'type',
        TypeId: 'typeId',
        CreatedAt: 'createdAt',
        Actions: 'actions',
    };

    constructor(
        private readonly _toastr: ToastrService,
        private readonly _cdr: ChangeDetectorRef,
        private readonly _commentService: CommentService,
        private readonly _tokenService: TokenService
    ) {
        this.request = this._initializePagedRequest();
    }

    ngOnChanges(): void {
        if (!AppUtil.isNullOrEmpty(this.type?.toString()) && !AppUtil.isNullOrEmpty(this.typeId?.toString())) {
            this.request = this._initializePagedRequest();
            this._loadComments();
        }
    }

    protected onAddComment(): void {
        this.selectedId = 0;
        this.description = AppUtil.EmptyString;
        this.showAddButton = false;
    }

    protected onEditComment(comment: IGetCommentPagedListDto): void {
        this.selectedId = comment.id;
        this.description = comment.description;
        this.showAddButton = false;
    }

    protected onDeleteComment(comment: IGetCommentPagedListDto): void {
        this._commentService.delete(comment.id).pipe(take(1)).subscribe({
            next: () => {
                this._toastr.success('Comment has been deleted successfully.');
                this._loadComments();
            },
            error: (err: HttpErrorResponse) => {
                this._toastr.error(err.error?.message || 'Delete failed');
            },
        });
    }

    protected onCommentSaved(success: boolean): void {
        this.showAddButton = true;
        if (success) {
            this._loadComments();
        }
    }

    protected onCancelUpsert(): void {
        this.showAddButton = true;
    }

    private _loadComments(): void {
        this.isLoading = true;
        this._commentService.getPagedList(this.request).pipe(take(1)).subscribe({
            next: (response: IPagedListResponseDto<IGetCommentPagedListDto>) => {
                this.comments = response.items;
                this._assignIsLoggedInUser();
                this.totalCount = response.totalCount;
                this.isLoading = false;
                this._cdr.detectChanges();
            },
            error: (err: HttpErrorResponse) => {
                this._toastr.error(err.error?.message);
                this.isLoading = false;
                this._cdr.detectChanges();
            },
        });
    }

    private _initializePagedRequest(): IGetCommentPagedListRequestDto {
        const baseRequest = AppUtil.initializePagedListRequest(this._commentColumnName.CreatedAt);
        return {
            ...baseRequest,
            order: AppUtil.DescendingOrder,
            type: this.type,
            typeId: this.typeId,
        };
    }

    private _assignIsLoggedInUser(): void {
        this.comments.forEach(x => x.isLoggedUser = x.createdById === this._tokenService.getUserId());
        console.log(this._tokenService.getUserId(), this.comments);
    }
}