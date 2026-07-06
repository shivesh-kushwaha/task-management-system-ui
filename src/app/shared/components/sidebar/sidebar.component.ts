import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionStore } from '../../../core/authorization';
import { PermissionCodeConstant, RoleCodeConstant } from '../../../core/constants';
import { TokenService } from '../../services';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: false
})
export class SidebarComponent {
    @Output() sidebarEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    public isCollapsed = false;

    protected canViewProject: boolean = false;
    protected canViewWorkItem: boolean = false;
    protected canViewUser: boolean = false;
    protected canViewTeam: boolean = false;
    protected canViewMessage: boolean = false;
    protected canViewConfigurations: boolean = false; // From the token

    protected menuItems: any;

    get permissionCodeConstant(): typeof PermissionCodeConstant {
        return PermissionCodeConstant;
    }

    constructor(public readonly _router: Router,
        private readonly _tokenService: TokenService
    ) {
        this._initializePermissionCodes();
        this.menuItems = [
            { label: 'Dashboard', icon: 'bi bi-speedometer2', route: '/dashboard', canView: true },
            { label: 'Projects', icon: 'bi bi-folder', route: '/project/manage', canView: this.canViewProject },
            { label: 'Tasks', icon: 'bi bi-list-task', route: '/task/manage', canView: this.canViewWorkItem },
            { label: 'Teams', icon: 'bi bi-people-fill', route: '/team/manage', canView: this.canViewTeam },
            { label: 'Messages', icon: 'bi bi-chat-dots', route: '/message/manage', canView: this.canViewMessage },
            { label: 'Users', icon: 'bi bi-people', route: '/user/manage', canView: this.canViewUser },
            { label: 'Configurations', icon: 'bi bi-gear', route: '/configuration/manage', canView: this.canViewConfigurations },
        ];
    }

    toggleSidebar(): void {
        this.isCollapsed = !this.isCollapsed;
        this.sidebarEvent.emit(this.isCollapsed);
    }

    private _initializePermissionCodes(): void {
        this.canViewProject = PermissionStore.hasAny([this.permissionCodeConstant.Project.ViewProject]);
        this.canViewTeam = PermissionStore.hasAny([this.permissionCodeConstant.Team.ViewTeam]);
        this.canViewUser = PermissionStore.hasAny([this.permissionCodeConstant.User.ViewUser]);
        this.canViewWorkItem = PermissionStore.hasAny([this.permissionCodeConstant.WorkItem.ViewWorkItem]);
        this.canViewMessage = true;
        this.canViewConfigurations = this._tokenService.getUserRoleCodes()?.some(x => x === RoleCodeConstant.Admin);
    }
}