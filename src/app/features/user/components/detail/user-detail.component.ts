import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RecordStatusEnum } from '../../../../core/enums';
import { AppUtil } from '../../../../core/utils/app.util';
import { UserService } from '../../services/user.service';
import { IGetUserByIdDto } from '../../dtos';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    standalone: false
})
export class UserDetailComponent implements OnInit {
    protected user: IGetUserByIdDto | null = null;
    protected isLoading: boolean = true;

    private _id: number = 0;

    protected readonly RecordStatusEnum = RecordStatusEnum;
    protected readonly AppUtil = AppUtil;

    constructor(
        private readonly _userService: UserService,
        private readonly _route: ActivatedRoute,
        private readonly _router: Router,
        private readonly _toastr: ToastrService
    ) {
        this._id = Number(this._route.snapshot.params['id']);
    }

    public ngOnInit(): void {
        this._loadUser();
    }

    protected onGoBack(): void {
        this._router.navigate(['/user/manage']);
    }

    private _loadUser(): void {
        this.isLoading = true;
        this._userService.getById(this._id).subscribe({
            next: (response: IGetUserByIdDto) => {
                this.user = response;
                this.isLoading = false;
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message || 'Failed to load user details');
                this.isLoading = false;
            }
        });
    }
}