import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (token) {
      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}

Hello