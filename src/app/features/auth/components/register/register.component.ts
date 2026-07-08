import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../user/services/user.service';
import { AppConstant } from '../../../../core/constants';
import { AddUserDto } from '../../dtos';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    standalone: false
})
export class RegisterComponent {
    registerForm: FormGroup;
    isLoading = false;
    errorMessage = '';
    showPassword = false;
    showConfirmPassword = false;
    appConstant = AppConstant;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.maxLength(50)]],
            lastName: ['', [Validators.required, Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(AppConstant.emailMaxLength)]],
            password: ['', [Validators.required, Validators.minLength(AppConstant.passwordMinLength), Validators.maxLength(AppConstant.passwordMaxLength)]],
            confirmPassword: ['', [Validators.required]],
            phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
        }, { validators: passwordMatchValidator });
    }

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPassword(): void {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    onSubmit(): void {
        if (this.registerForm.invalid) return;

        this.isLoading = true;
        this.errorMessage = '';

        const { confirmPassword, ...dto } = this.registerForm.value;
        const addUserDto: AddUserDto = dto;

        this.userService.register(addUserDto).subscribe({
            next: () => {
                this.router.navigate(['/auth/login']);
            },
            error: (err) => {
                this.errorMessage = err.error?.message ?? 'Registration failed. Please try again.';
                this.isLoading = false;
            }
        });
    }
}