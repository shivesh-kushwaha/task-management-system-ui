import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-configuration-manage',
    templateUrl: './configuration-manage.component.html',
    styleUrls: ['./configuration-manage.component.scss'],
    standalone: false
})
export class ConfigurationManageComponent implements OnInit {
    protected isLoading: boolean = false;

    protected menuItems = [
        { label: 'Permissions', route: '/configuration/manage/permission' },
        { label: 'Roles', route: '/configuration/manage/role' },
        { label: 'Exception Logs', route: '/configuration/manage/exception-log' },
        { label: 'Security', route: '/configuration/manage/security' },
        { label: 'Notifications', route: '/configuration/manage/notifications' },
        { label: 'Integrations', route: '/configuration/manage/integrations' },
        { label: 'Backup', route: '/configuration/manage/backup' },
        { label: 'Logs', route: '/configuration/manage/logs' },
    ];

    constructor(
        private readonly _router: Router,
        private readonly _toastr: ToastrService
    ) { }

    ngOnInit(): void {
        // If no route is active, navigate to first item
        if (!this._router.url.includes('/configuration/manage/')) {
            this._router.navigate([this.menuItems[0].route]);
        }
    }

    /**
     * Check if the given route is currently active
     */
    isActive(route: string): boolean {
        return this._router.url.includes(route);
    }

    /**
     * Navigate to the given route
     */
    navigateTo(route: string): void {
        this.isLoading = true;

        this._router.navigate([route]).then((success) => {
            this.isLoading = false;
            if (success) {
                const activeItem = this.menuItems.find(item => item.route === route);
            }
        }).catch(() => {
            this.isLoading = false;
            this._toastr.error('Failed to navigate', 'Error');
        });
    }
}