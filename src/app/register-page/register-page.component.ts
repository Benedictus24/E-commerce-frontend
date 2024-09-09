import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Services/Authentication';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  name: string = '';
  surname: string = '';
  address: string = '';
  email: string = '';
  password: string = '';
  token: string = '';
  showPassword = false;


  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // Check for empty fields
    if (!this.name || !this.surname || !this.address || !this.email || !this.password) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill out all fields.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    // Email validation
    if (!this.email.includes('@')) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter a valid email address.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    // Password validation
    const passwordValidationError = this.checkPasswordStrength(this.password);
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

    // Proceed with registration
    const user = {
      name: this.name,
      surname: this.surname,
      address: this.address,
      email: this.email,
      password: this.password,
      token: ""
    };

    this.authService.register(user).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: 'You have successfully registered',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        const errorMsg = error.message || 'Registration failed. Please try again.';
        if (errorMsg === 'User already exists on the system.') {
          Swal.fire({
            title: 'Error!',
            text: 'User already exists on the system.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: errorMsg,
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          });
        }
        console.error('Registration error', error);
      }
    });
  }

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

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
