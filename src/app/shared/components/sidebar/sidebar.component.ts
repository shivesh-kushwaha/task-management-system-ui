import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    standalone: false
})
export class SidebarComponent {
    isCollapsed = false;

    menuItems = [
        { label: 'Dashboard', icon: 'bi bi-speedometer2', route: '/dashboard' },
        { label: 'Projects', icon: 'bi bi-folder', route: '/projects' },
        { label: 'Task', icon: 'bi bi-list-task', route: '/task' },
        { label: 'Users', icon: 'bi bi-people', route: '/users' },
    ];

    constructor(public router: Router) { }

    toggleSidebar(): void {
        this.isCollapsed = !this.isCollapsed;
    }
}