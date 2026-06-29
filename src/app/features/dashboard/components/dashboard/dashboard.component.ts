import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { IGetDashboardDto } from '../../dtos';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationStore } from '../../../../core/authorization';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit {
    protected isLoading: boolean = false;
    protected dashboard: IGetDashboardDto | null = null;

    constructor(private readonly _dashboardService: DashboardService,
        private readonly _toastr: ToastrService) { }

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
}