import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TokenService } from '../../services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: false
})
export class LayoutComponent {
  protected isLoggedIn = false;

  constructor(
    private readonly router: Router,
    private readonly tokenService: TokenService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isLoggedIn = this.tokenService.isLoggedIn();
    });
  }
}