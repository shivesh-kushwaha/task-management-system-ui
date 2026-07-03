import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationStore } from '../../../core/authorization';
import { PermissionCodeConstant } from '../../../core/constants';

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

    protected menuItems: any;

    get permissionCodeConstant(): typeof PermissionCodeConstant {
        return PermissionCodeConstant;
    }

    constructor(public router: Router) {
        this._initializePermissionCodes();
        this.menuItems = [
            { label: 'Dashboard', icon: 'bi bi-speedometer2', route: '/dashboard', canView: true },
            { label: 'Projects', icon: 'bi bi-folder', route: '/project/manage', canView: this.canViewProject },
            { label: 'Tasks', icon: 'bi bi-list-task', route: '/task/manage', canView: this.canViewWorkItem },
            { label: 'Teams', icon: 'bi bi-people-fill', route: '/team/manage', canView: true },
            { label: 'Users', icon: 'bi bi-people', route: '/user/manage', canView: this.canViewUser },
            { label: 'Configurations', icon: 'bi bi-gear', route: '/configuration/manage', canView: true },
        ];
    }

    toggleSidebar(): void {
        this.isCollapsed = !this.isCollapsed;
        this.sidebarEvent.emit(this.isCollapsed);
    }

    private _initializePermissionCodes(): void {
        this.canViewProject = AuthorizationStore.hasAny([this.permissionCodeConstant.Project.ViewProject]);
        this.canViewTeam = AuthorizationStore.hasAny([this.permissionCodeConstant.Team.ViewTeam]);
        this.canViewUser = AuthorizationStore.hasAny([this.permissionCodeConstant.User.ViewUser]);
        this.canViewWorkItem = AuthorizationStore.hasAny([this.permissionCodeConstant.WorkItem.ViewWorkItem]);
    }
}