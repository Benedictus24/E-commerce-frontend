import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for template-driven forms
import { AuthService } from '../Services/Authentication'; 
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true, // Mark the component as standalone
  imports: [FormsModule, CommonModule] 
})
export class ResetPasswordComponent {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // Validate password strength
    const passwordValidationError = this.checkPasswordStrength(this.newPassword);
    if (passwordValidationError) {
      Swal.fire({
        title: 'Error!',
        text: passwordValidationError,
        icon: 'error',
        timer: 2000,
        showConfirmButton: true,
        confirmButtonText: 'Close', 
      });
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
      });
      return;
    }

    // Call the AuthService to get the reset token by email
    this.authService.getResetToken(this.email).subscribe({
      next: (response: any) => {
        const token = response.token;
        
        this.authService.resetPassword(this.email, token, this.newPassword).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Your password has been reset successfully!',
              timer: 5000,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate(['/login']);
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error resetting password. Please try again.',
            });
          },
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No user found with this email',
        });
      }
    });
  }

  // Password validation method
  private checkPasswordStrength(pass: string): string {
    let errorMsg = '';
    if (pass.length < 8) {
      errorMsg += 'Minimum password length should be 8 characters.\n';
    }
    if (!/[a-z]/.test(pass) || !/[A-Z]/.test(pass) || !/\d/.test(pass)) {
      errorMsg += 'Password should be alphanumeric.\n';
    }
    if (!/[<>@!#$%^&*()_+\[\]{}?:;|\',./~`-]/.test(pass)) {
      errorMsg += 'Password should contain a special character.\n';
    }
    return errorMsg.trim();
  }
}
