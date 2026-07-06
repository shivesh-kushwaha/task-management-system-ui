import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { PermissionService, TokenService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import { PermissionStore } from '../../../core/authorization';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: false
})
export class LayoutComponent implements OnInit, OnDestroy {
  protected isLoggedIn = false;
  protected isSidebarCollapsed: boolean = false;
  protected isPermissionLoaded: boolean = false;

  private readonly sub: Subscription;

  constructor(
    private readonly _router: Router,
    private readonly _tokenService: TokenService,
    private readonly _permissionService: PermissionService,
    private readonly _toastr: ToastrService
  ) {
    this.isLoggedIn = this._resolveLoginState();

    this.sub = this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isLoggedIn = this._resolveLoginState();
    });
  }

  ngOnInit(): void {
    this._loadPermissions();
  }

  protected onSidebarChanged(event: boolean): void {
    this.isSidebarCollapsed = event;
  }

  private _resolveLoginState(): boolean {
    const isAuthRoute = this._router.url.startsWith('/auth');
    return !isAuthRoute && this._tokenService.isLoggedIn();
  }

  private _loadPermissions(): void {
    this.isPermissionLoaded = false;
    this._permissionService.loadAndStorePermissions().subscribe({
      next: () => {
        this.isPermissionLoaded = true;
      },
      error: (err: any) => {
        this.isPermissionLoaded = true;
        this._toastr.error(err.error?.message);
      }
    });
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}