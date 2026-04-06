import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { TokenService } from '../../services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: false
})
export class LayoutComponent implements OnDestroy {
  protected isLoggedIn = false;
  private readonly sub: Subscription;
  protected isSidebarCollapsed: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly tokenService: TokenService
  ) {
    this.isLoggedIn = this.resolveLoginState();

    this.sub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isLoggedIn = this.resolveLoginState();
    });
  }

  protected onSidebarChanged(event: boolean): void {
    this.isSidebarCollapsed = event;
  }

  private resolveLoginState(): boolean {
    const isAuthRoute = this.router.url.startsWith('/auth');
    return !isAuthRoute && this.tokenService.isLoggedIn();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}