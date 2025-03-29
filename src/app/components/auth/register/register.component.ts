import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
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

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    console.log('🚀 Form submitted!');
    this.register();
  }

  register() {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;
      
      console.log('📤 Sending data:', registerData);

      this.http.post('http://127.0.0.1:8000/api/user/register', registerData)
        .subscribe({
          next: (response) => {
            console.log('✅ Success:', response);
            this.successMessage = 'Registration successful! You can now log in.';
            this.registerForm.reset();
          },
          error: (error) => {
            console.error('❌ Error:', error);
            this.errorMessage = error.error.message || 'An error occurred during registration';

            if (error.error.errors) {
              this.errorMessage += '\n' + Object.values(error.error.errors).join('\n');
            }
          }
        });
    } else {
      console.warn('⚠️ Form is invalid', this.registerForm.errors);
    }
  }
}
