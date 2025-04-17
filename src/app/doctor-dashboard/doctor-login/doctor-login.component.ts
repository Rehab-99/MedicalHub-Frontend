import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginDoctorService } from '../../services/login-doctor.service';

@Component({
  selector: 'app-doctor-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink ],
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
    private LoginDoctorService: LoginDoctorService
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

      this.LoginDoctorService.loginDoctor(this.loginForm.value).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.showSuccess = true;
          this.LoginDoctorService.setToken(response.token);
          this.LoginDoctorService.setDoctor(response.doctor, response.token);
          this.router.navigate(['/doctor-dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = error.error.message || 'An error occurred during login.';
        }
      });
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}