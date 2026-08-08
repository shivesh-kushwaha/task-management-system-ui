import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, TokenService } from '../../services';
import { PermissionStore } from '../../../core/authorization';
import { AppUtil } from '../../../core/utils/app.util';
import { ILogoutDto } from '../../dtos';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: false
})
export class NavbarComponent {
    public isDropdownOpen = false;
    public userName = AppUtil.EmptyString;

    constructor(
        private readonly _router: Router,
        private readonly _tokenService: TokenService,
        private readonly _authService: AuthService,
        private readonly _toastrService: ToastrService
    ) {
        this.userName = _tokenService.getUserName();
    }

    toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    protected logout(): void {
        const refreshToken = localStorage.getItem('refreshToken') ?? AppUtil.EmptyString;

        const request: ILogoutDto = {
            refreshToken: refreshToken
        };

        this._authService.logout(request).pipe(take(1)).subscribe({
            next: () => {
                this._tokenService.clearTokens();
                PermissionStore.clearPermissions();
                this._router.navigate(['/auth/login']);
            },
            error: (err: HttpErrorResponse) => {
                this._toastrService.error(err.error?.message);
            }
        });
    }
}