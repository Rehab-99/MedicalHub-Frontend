import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CouponService, Coupon } from '../../../services/coupon.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {
  couponForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  formErrors: { [key: string]: string } = {};
  
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
    INVALID_DATE: 'Please select a valid date'
  };

  constructor(
    private fb: FormBuilder,
    private couponService: CouponService
  ) {
    this.couponForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]],
      discount_type: [this.DISCOUNT_TYPES.PERCENTAGE, [Validators.required, Validators.pattern(`^(${this.DISCOUNT_TYPES.PERCENTAGE}|${this.DISCOUNT_TYPES.FIXED})$`)]],
      discount_value: ['', [Validators.required, Validators.min(0)]],
      usage_limit: ['', [Validators.required, Validators.min(1)]],
      expires_at: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.couponForm.valid) {
      // Clear previous errors
      this.formErrors = {};
      this.errorMessage = '';
      
      this.couponService.createCoupon(this.couponForm.value).subscribe({
        next: (response) => {
          this.successMessage = 'Coupon created successfully!';
          this.errorMessage = '';
          this.couponForm.reset({
            discount_type: this.DISCOUNT_TYPES.PERCENTAGE // Reset to default value
          });
        },
        error: (error: HttpErrorResponse) => {
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
                this.formErrors[key] = errorMessage;
                // Set error on specific form control
                const control = this.couponForm.get(key);
                if (control) {
                  control.setErrors({ serverError: errorMessage });
                }
              });
            }
            this.errorMessage = 'Please check the form for errors';
          } else {
            this.errorMessage = 'Error creating coupon';
          }
          this.successMessage = '';
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
    return this.formErrors[fieldName] || '';
  }
} 