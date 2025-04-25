import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginDoctorService } from '../../services/login-doctor.service';

@Component({
  selector: 'app-doctor-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './doctor-login.component.html',
  styleUrls: ['./doctor-login.component.css']
})
export class DoctorLoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showSuccess = false;
  showError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginDoctorService: LoginDoctorService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.showError = false;

      this.loginDoctorService.loginDoctor(this.loginForm.value).subscribe({
        next: (response: any) => {
          this.isLoading = false;

          // التأكد من وجود التوكن وبيانات الدكتور
          if (response.token && response.doctor) {
            this.showSuccess = true;
            this.loginDoctorService.setDoctor(response.doctor, response.token);

            // تخزين الـ role في localStorage لو موجود
            if (response.doctor.role) {
              localStorage.setItem('doctor_role', response.doctor.role);
            }

            // ريدايركت للداشبورد
            setTimeout(() => {
              this.router.navigate(['/doctor-dashboard']);
            }, 1000);
          } else {
            this.showError = true;
            this.errorMessage = 'Invalid response from server. Please try again.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.showError = true;
          console.error('Login error:', error);
          this.errorMessage =
            error.error?.message ||
            error.message ||
            'Invalid email or password. Please try again.';
        }
      });
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}