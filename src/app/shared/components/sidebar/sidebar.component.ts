import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: false
})
export class SidebarComponent {
    @Output() sidebarEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    isCollapsed = false;

    menuItems = [
        { label: 'Dashboard', icon: 'bi bi-speedometer2', route: '/dashboard' },
        { label: 'Projects', icon: 'bi bi-folder', route: '/project/manage' },
        { label: 'Tasks', icon: 'bi bi-list-task', route: '/task' },
        { label: 'Users', icon: 'bi bi-people', route: '/user' },
    ];

    constructor(public router: Router) { }

    toggleSidebar(): void {
        this.isCollapsed = !this.isCollapsed;
        this.sidebarEvent.emit(this.isCollapsed);
    }
}