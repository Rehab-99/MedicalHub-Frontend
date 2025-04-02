import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HttpClientModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  showSuccess = false;
  showError = false;
  errorMessage = '';
  apiUrl = 'http://127.0.0.1:8000/api/password/reset-link';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.isLoading = true;
      this.showError = false;
      this.showSuccess = false;

      const formData = {
        email: this.resetForm.get('email')?.value
      };

      this.http.post(this.apiUrl, formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showSuccess = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = error.error.message || 'An error occurred while sending reset link.';
        }
      });
    }
  }

  get email() { return this.resetForm.get('email'); }
} 