import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]]
    }, { validators: this.passwordMatchValidator });
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

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    this.register();
  }

  register() {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;
      
      this.http.post('http://127.0.0.1:8000/api/user/register', registerData)
        .subscribe({
          next: (response: any) => {
            localStorage.setItem('lastEmail', registerData.email);
            this.router.navigate(['/login'], { replaceUrl: true });
          },
          error: (error) => {
            console.error('❌ Error:', error);
            this.errorMessage = error.error.message || 'An error occurred during registration';

            if (error.error.errors) {
              this.errorMessage += '\n' + Object.values(error.error.errors).join('\n');
            }
          }
        });
    }
  }

  /**
   * تسجيل الدخول عبر Google
   */
  loginWithGoogle() {
    this.isLoading = true;
    this.errorMessage = '';
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
        this.errorMessage = 'Failed to get user data!';
      }
    });
  }
}
