import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { IGetDashboardDto } from '../../dtos';
import { ToastrService } from 'ngx-toastr';
import { PermissionCodeConstant } from '../../../../core/constants';
import { PermissionStore } from '../../../../core/authorization';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit {
    protected isLoading: boolean = false;
    protected dashboard: IGetDashboardDto | null = null;

    protected canViewProject: boolean = false;
    protected canViewUser: boolean = false;
    protected canViewTeam: boolean = false;
    protected canViewWorkItem: boolean = false;

    get permissionCodeConstant(): typeof PermissionCodeConstant {
        return PermissionCodeConstant;
    }

    constructor(private readonly _dashboardService: DashboardService,
        private readonly _toastr: ToastrService) {
        this._initializePermissionCodes();
    }

    ngOnInit(): void {
        this._getDashboard();
    }

    private _getDashboard(): void {
        this.isLoading = true;
        this._dashboardService.getDashboard().subscribe({
            next: (response: IGetDashboardDto) => {
                this.dashboard = response;
                this.isLoading = false;
            },
            error: (err: any) => {
                this._toastr.error(err.error?.message);
                this.isLoading = false;
            }
        });
    }

    private _initializePermissionCodes(): void {
        this.canViewProject = PermissionStore.hasAny([this.permissionCodeConstant.Project.ViewProject]);
        this.canViewTeam = PermissionStore.hasAny([this.permissionCodeConstant.Team.ViewTeam]);
        this.canViewUser = PermissionStore.hasAny([this.permissionCodeConstant.User.ViewUser]);
        this.canViewWorkItem = PermissionStore.hasAny([this.permissionCodeConstant.WorkItem.ViewWorkItem]);
    }
}