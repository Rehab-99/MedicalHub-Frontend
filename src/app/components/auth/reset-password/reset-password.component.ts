import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HttpClientModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetForm: FormGroup;
  isLoading = false;
  showSuccess = false;
  showError = false;
  errorMessage = '';
  apiUrl = 'http://127.0.0.1:8000/api/password/reset-link';
  
  // Timer related properties
  countdown: number = 60;
  isCountdownActive: boolean = false;
  private countdownSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Check for token in query parameters
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        // If token exists, redirect to update password page
        this.router.navigate(['/password/update', params['token']]);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  startCountdown() {
    this.isCountdownActive = true;
    this.countdown = 60;
    
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.isCountdownActive = false;
        if (this.countdownSubscription) {
          this.countdownSubscription.unsubscribe();
        }
      }
    });
  }

  onSubmit() {
    if (this.resetForm.valid && !this.isCountdownActive) {
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
          this.startCountdown();
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