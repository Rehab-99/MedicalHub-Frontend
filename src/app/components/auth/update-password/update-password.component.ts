import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  updateForm: FormGroup;
  isLoading = false;
  showSuccess = false;
  showError = false;
  errorMessage = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.updateForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token'];
      console.log('Token received:', this.token); // Debug log
      if (!this.token) {
        this.showError = true;
        this.errorMessage = 'Invalid or expired reset link';
        this.toastr.error('Invalid or expired reset link');
        setTimeout(() => {
          this.router.navigate(['/reset-password']);
        }, 3000);
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null : { 'mismatch': true };
  }

  get password() { return this.updateForm.get('password'); }
  get password_confirmation() { return this.updateForm.get('password_confirmation'); }

  onSubmit() {
    if (this.updateForm.invalid || !this.token) {
      this.toastr.error('Please fill in all fields correctly');
      return;
    }

    this.isLoading = true;
    this.showError = false;

    this.http.post('http://127.0.0.1:8000/api/password/update', {
      token: this.token,
      password: this.password?.value,
      password_confirmation: this.password_confirmation?.value
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.showSuccess = true;
        this.toastr.success('Password updated successfully');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.showError = true;
        this.errorMessage = error.error?.message || 'Failed to update password';
        this.toastr.error(this.errorMessage);
        if (error.status === 422) {
          setTimeout(() => {
            this.router.navigate(['/reset-password']);
          }, 3000);
        }
      }
    });
  }
} 