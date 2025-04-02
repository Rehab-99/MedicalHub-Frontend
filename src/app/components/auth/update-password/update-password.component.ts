import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HttpClientModule],
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  updateForm: FormGroup;
  isLoading = false;
  showSuccess = false;
  showError = false;
  errorMessage = '';
  apiUrl = 'http://127.0.0.1:8000/api/password/update';
  token: string = '';
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.updateForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Get token and email from URL query parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      
      // If no token or email, redirect to login
      if (!this.token || !this.email) {
        this.router.navigate(['/login']);
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.updateForm.valid) {
      this.isLoading = true;
      this.showError = false;
      this.showSuccess = false;

      const formData = {
        token: this.token,
        email: this.email,
        password: this.updateForm.get('password')?.value,
        password_confirmation: this.updateForm.get('password_confirmation')?.value
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
          this.errorMessage = error.error.message || 'An error occurred while updating your password.';
        }
      });
    }
  }

  get password() { return this.updateForm.get('password'); }
  get passwordConfirmation() { return this.updateForm.get('password_confirmation'); }
} 