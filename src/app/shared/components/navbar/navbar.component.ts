import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services';
import { PermissionStore } from '../../../core/authorization';
import { AppUtil } from '../../../core/utils/app.util';

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
        private readonly _tokenService: TokenService
    ) {
        this.userName = _tokenService.getUserName();
    }

    toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    logout(): void {
        this._tokenService.clearTokens();
        PermissionStore.clearPermissions();
        this._router.navigate(['/auth/login']);
    }
}