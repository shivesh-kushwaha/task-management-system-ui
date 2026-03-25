import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppConstants } from '../../../../core/constants';
import { AuthLoginDto } from '../../dtos';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
  standalone: false
})
export class AuthLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  appConstants = AppConstants;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(AppConstants.emailMaxLength)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(AppConstants.passwordMinLength),
        Validators.maxLength(AppConstants.passwordMaxLength)
      ]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const dto: AuthLoginDto = this.loginForm.value;

    this.authService.login(dto).subscribe({
      next: (response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.log(err)
        this.errorMessage = err.error?.message ?? 'Login failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}