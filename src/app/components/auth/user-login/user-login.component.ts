import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute // ✅ لالتقاط التوكن بعد تسجيل الدخول عبر Google
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // ✅ التحقق عند تحميل الصفحة إذا كان هناك توكن في الرابط بعد تسجيل الدخول عبر Google
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('userToken', token);
        this.getUserData(); // ✅ جلب بيانات المستخدم بعد تسجيل الدخول
      }
    });
  }

  /**
   * تسجيل الدخول العادي عبر البريد وكلمة المرور
   */
  onSubmit() {
    if (this.loginForm.valid) {
      this.login();
    }
  }

  login() {
    this.http.post('http://127.0.0.1:8000/api/user/login', this.loginForm.value)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('userToken', response.token);
          localStorage.setItem('userData', JSON.stringify(response.user));
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'حدث خطأ أثناء تسجيل الدخول';
        }
      });
  }

  /**
   * تسجيل الدخول عبر Google
   */
  socialLogin(provider: string) {
    window.location.href = `http://127.0.0.1:8000/auth/${provider}/redirect`;
  }
  

  /**
   * جلب بيانات المستخدم بعد تسجيل الدخول عبر Google
   */
  getUserData() {
    this.http.get('http://127.0.0.1:8000/api/user', {
      headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
    }).subscribe({
      next: (response: any) => {
        localStorage.setItem('userData', JSON.stringify(response));
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = 'فشل في جلب بيانات المستخدم!';
      }
    });
  }
}
