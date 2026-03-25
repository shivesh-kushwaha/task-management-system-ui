import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    standalone: false
})
export class NavbarComponent {
    isDropdownOpen = false;
    userName = '';

    constructor(
        private readonly router: Router,
        private readonly tokenService: TokenService
    ) {
        this.userName = this.tokenService.getUserName();
    }

    toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    logout(): void {
        this.tokenService.clearTokens();
        this.router.navigate(['/auth/login']);
    }
}