import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showSuccess = false;
  showError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Check for token in URL after Google login
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.setToken(token);
        this.handleGoogleCallback();
      }
    });
  }

  /**
   * تسجيل الدخول العادي عبر البريد وكلمة المرور
   */
  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.showError = false;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.authService.setToken(response.token);
          this.authService.setUser(response.user);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = error.error.message || 'An error occurred during login.';
        }
      });
    }
  }

  /**
   * تسجيل الدخول عبر Google
   */
  loginWithGoogle() {
    this.isLoading = true;
    this.showError = false;
    this.authService.loginWithGoogle();
  }

  /**
   * تسجيل الدخول عبر Facebook
   */
  loginWithFacebook() {
    this.authService.loginWithFacebook();
  }

  /**
   * جلب بيانات المستخدم بعد تسجيل الدخول عبر Google
   */
  handleGoogleCallback() {
    this.authService.getUserData().subscribe({
      next: (response: any) => {
        this.authService.setUser(response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.showError = true;
        this.errorMessage = 'Failed to get user data!';
      }
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
