import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CouponService, Coupon } from '../../../services/coupon.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {
  couponForm: FormGroup;
  flashMessage: string = '';
  flashType: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  
  // Define discount types as constants to match backend validation
  readonly DISCOUNT_TYPES = {
    PERCENTAGE: 'percentage',
    FIXED: 'fixed'
  };

  // Error messages
  readonly ERROR_MESSAGES = {
    CODE_TAKEN: 'This coupon code is already in use. Please choose a different code.',
    REQUIRED: 'This field is required',
    MIN_LENGTH: 'Must be at least 3 characters long',
    MIN_VALUE: 'Value must be greater than 0',
    INVALID_DATE: 'Please select a valid date',
    TIMEOUT: 'Request timed out. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.'
  };

  constructor(
    private fb: FormBuilder,
    private couponService: CouponService,
    private router: Router
  ) {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      this.router.navigate(['/admin-login']);
    }

    this.couponForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]],
      discount_type: [this.DISCOUNT_TYPES.PERCENTAGE, [Validators.required, Validators.pattern(`^(${this.DISCOUNT_TYPES.PERCENTAGE}|${this.DISCOUNT_TYPES.FIXED})$`)]],
      discount_value: ['', [Validators.required, Validators.min(0)]],
      usage_limit: ['', [Validators.required, Validators.min(1)]],
      expires_at: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Double check admin authentication on component initialization
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      this.router.navigate(['/admin-login']);
    }
  }

  private showFlashMessage(message: string, type: 'success' | 'error'): void {
    this.flashMessage = message;
    this.flashType = type;
    
    // Hide the flash message after 3 seconds
    setTimeout(() => {
      this.flashMessage = '';
      this.flashType = null;
    }, 3000);
  }

  onSubmit(): void {
    // Check admin authentication before submitting
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      this.router.navigate(['/admin-login']);
      return;
    }

    if (this.couponForm.valid) {
      // Clear previous errors
      this.flashMessage = '';
      this.flashType = null;
      this.isLoading = true;
      
      // Store form data before submission
      const formData = { ...this.couponForm.value };
      
      this.couponService.createCoupon(formData).subscribe({
        next: (response) => {
          console.log('Server Response:', response); // Debug log
          this.isLoading = false;
          // Reset form immediately after successful submission
          this.couponForm.reset({
            discount_type: this.DISCOUNT_TYPES.PERCENTAGE
          });
          
          // Always show a success message
          this.showFlashMessage(`Coupon "${formData.code}" created successfully! 🎉`, 'success');
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error Response:', error); // Debug log
          this.isLoading = false;
          if (error.status === 422) {
            // Handle validation errors
            if (error.error.errors) {
              // Map backend validation errors to form fields
              Object.keys(error.error.errors).forEach(key => {
                // Translate error messages
                let errorMessage = error.error.errors[key][0];
                if (errorMessage.includes('already been taken')) {
                  errorMessage = this.ERROR_MESSAGES.CODE_TAKEN;
                }
                // Set error on specific form control
                const control = this.couponForm.get(key);
                if (control) {
                  control.setErrors({ serverError: errorMessage });
                }
              });
            }
            this.showFlashMessage('Please check your input data', 'error');
          } else if (error.status === 0) {
            this.showFlashMessage(this.ERROR_MESSAGES.NETWORK_ERROR, 'error');
          } else if (error instanceof Error && error.message.includes('Timeout')) {
            this.showFlashMessage(this.ERROR_MESSAGES.TIMEOUT, 'error');
          } else {
            this.showFlashMessage('An error occurred while creating the coupon', 'error');
          }
        }
      });
    }
  }

  // Helper method to check if a field has an error
  hasError(fieldName: string): boolean {
    const control = this.couponForm.get(fieldName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  // Helper method to get error message for a field
  getErrorMessage(fieldName: string): string {
    const control = this.couponForm.get(fieldName);
    if (control?.errors) {
      if (control.errors['serverError']) {
        return control.errors['serverError'];
      }
      if (control.errors['required']) {
        return this.ERROR_MESSAGES.REQUIRED;
      }
      if (control.errors['minlength']) {
        return this.ERROR_MESSAGES.MIN_LENGTH;
      }
      if (control.errors['min']) {
        return this.ERROR_MESSAGES.MIN_VALUE;
      }
    }
    return '';
  }
} 