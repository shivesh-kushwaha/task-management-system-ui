import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { AppConstant } from '../../../../core/constants';
import { ToastrService } from 'ngx-toastr';
import { PermissionService } from '../../../../shared/services';
import { AuthLoginDto } from '../../../../shared/dtos';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
  standalone: false
})
export class AuthLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  appConstant = AppConstant;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private readonly _permissionService: PermissionService,
    private router: Router,
    private readonly _toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(AppConstant.emailMaxLength)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(AppConstant.passwordMinLength),
        Validators.maxLength(AppConstant.passwordMaxLength)
      ]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true; 

    const dto: AuthLoginDto = this.loginForm.value;

    this.authService.login(dto).subscribe({
      next: (response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this._loadPermissions();
      },
      error: (err: any) => {
        this._toastr.error(err.error?.message);
        this.isLoading = false;
      }
    });
  }

  private _loadPermissions(): void {
    this._permissionService.loadAndStorePermissions().subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}