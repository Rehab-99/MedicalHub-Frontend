import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  loginType: 'email' | 'phone' | 'username' = 'email';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      login_identifier: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  setLoginType(type: 'email' | 'phone' | 'username') {
    this.loginType = type;
    this.loginForm.get('login_identifier')?.reset();
    this.loginForm.get('login_identifier')?.updateValueAndValidity();
  }

  getLoginPlaceholder(): string {
    switch (this.loginType) {
      case 'email':
        return 'أدخل البريد الإلكتروني';
      case 'phone':
        return 'أدخل رقم الهاتف';
      case 'username':
        return 'أدخل اسم المستخدم';
      default:
        return 'أدخل البريد الإلكتروني';
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.http.post('http://127.0.0.1:8000/api/admin/login', this.loginForm.value)
        .subscribe({
          next: (response: any) => {
            // Store the token in localStorage
            localStorage.setItem('adminToken', response.token);
            // Store admin data in localStorage
            localStorage.setItem('adminData', JSON.stringify({
              name: response.admin.name,
              email: response.admin.email,
              role: response.admin.role
            }));
            // Redirect to admin dashboard
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.errorMessage = error.error.message || 'حدث خطأ في تسجيل الدخول';
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    }
  }
} 