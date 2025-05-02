import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService, CheckoutRequest, CheckoutItem } from '../../services/checkout.service';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('paymentElement') paymentElement!: ElementRef;
  
  checkoutData: CheckoutRequest = {
    user_id: 0,
    status: 'pending',
    total_price: 0,
    payment_method: '',
    items: []
  };

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  discount: number = 0;
  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupType: 'success' | 'error' = 'success';
  orderId: number | null = null;

  // Stripe related properties
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  clientSecret: string = '';
  showStripeForm: boolean = false;

  // Stripe public key from backend
  private readonly stripePublicKey = 'pk_test_51REdqh4G94LRAOydMDcGvERRCV7snk6EdwN5g217aIF7ULYL1nLwiYb1Xgnu5aR2nTbT1osbmS60J6XnNgGLoZOj00Z24z4TCv';

  billingForm: FormGroup;
  shippingForm: FormGroup;

  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private paymentService: PaymentService,
    private fb: FormBuilder
  ) {
    this.billingForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      post_code: ['', [Validators.required, Validators.pattern('^[0-9]{5,10}$')]],
      country: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.shippingForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      post_code: ['', [Validators.required, Validators.pattern('^[0-9]{5,10}$')]],
      country: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() {
    this.loadCartItems();

    // Get current user ID
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.checkoutData.user_id = user.id;
      }
    });
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.popupMessage = message;
    this.popupType = type;
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false;
      if (type === 'success') {
        this.router.navigate(['/order-confirmation']);
      }
    }, 1500);
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.cartService.getFinalPrice().subscribe(finalPrice => {
          this.totalPrice = finalPrice;
          this.updateCheckoutData();
        });
        
        this.cartService.getDiscount().subscribe(discount => {
          this.discount = discount;
        });
      },
      error: (error: HttpErrorResponse) => {
        this.showMessage('Failed to load cart items. Please try again.', 'error');
      }
    });
  }

  private updateCheckoutData() {
    this.checkoutData.items = this.cartItems.map(item => ({
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price
    }));
    this.checkoutData.total_price = this.totalPrice;
    
    // إضافة معلومات الخصم
    this.cartService.getDiscount().subscribe(discount => {
      this.checkoutData.discount = discount;
    });
    
    // إضافة كود الخصم
    this.cartService.getCouponCode().subscribe(couponCode => {
      this.checkoutData.coupon_code = couponCode || undefined;
    });
  }

  async onPaymentMethodChange() {
    if (this.checkoutData.payment_method === 'stripe') {
      this.showStripeForm = true;
      // Create order first
      try {
        const response = await this.checkoutService.processCheckout(this.checkoutData).toPromise();
        if (response && response.id) {
          this.orderId = response.id;
          await this.initializeStripe();
        } else {
          throw new Error('Failed to create order');
        }
      } catch (error) {
        console.error('Error creating order:', error);
        this.showMessage('Failed to initialize payment. Please try again.', 'error');
        this.showStripeForm = false;
      }
    } else {
      this.showStripeForm = false;
    }
  }

  async initializeStripe() {
    try {
      if (!this.orderId) {
        throw new Error('Order ID is missing');
      }

      console.log('Creating payment intent for order:', this.orderId);
      const response = await this.paymentService.createPaymentIntent(this.orderId).toPromise();
      console.log('Payment intent response:', response);
      
      if (!response) {
        throw new Error('No response from payment service');
      }

      this.clientSecret = response.clientSecret;
      if (!this.clientSecret) {
        throw new Error('No client secret in response');
      }

      console.log('Loading Stripe...');
      this.stripe = await loadStripe(this.stripePublicKey);
      console.log('Stripe loaded:', !!this.stripe);
      
      if (!this.stripe) {
        throw new Error('Failed to load Stripe');
      }

      console.log('Creating Stripe elements...');
      this.elements = this.stripe.elements({ 
        clientSecret: this.clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0570de',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'Ideal Sans, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '4px',
          }
        }
      });

      console.log('Creating payment element...');
      const paymentElement = this.elements.create('payment', {
        layout: 'accordion'
      });

      console.log('Mounting payment element...');
      if (!this.paymentElement?.nativeElement) {
        throw new Error('Payment element container not found');
      }

      paymentElement.mount(this.paymentElement.nativeElement);
      console.log('Payment element mounted successfully');
    } catch (error) {
      console.error('Stripe initialization error:', error);
      this.showMessage('Failed to initialize payment. Please try again.', 'error');
      this.showStripeForm = false;
    }
  }

  async processCheckout() {
    if (this.cartItems.length === 0) {
      this.showMessage('Your cart is empty. Please add items before checkout.', 'error');
      return;
    }

    // Validate both forms before proceeding
    if (this.billingForm.invalid) {
      this.billingForm.markAllAsTouched();
      this.showMessage('Please fill all billing address fields correctly', 'error');
      return;
    }

    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      this.showMessage('Please fill all shipping address fields correctly', 'error');
      return;
    }

    if (!this.checkoutData.payment_method) {
      this.showMessage('Please select a payment method', 'error');
      return;
    }

    this.isLoading = true;

    if (this.checkoutData.payment_method === 'stripe') {
      try {
        if (!this.stripe || !this.elements) {
          throw new Error('Payment system not initialized');
        }

        const result = await this.stripe.confirmPayment({
          elements: this.elements,
          confirmParams: {
            return_url: `${window.location.origin}/payments/${this.orderId}/stripe/confirm`,
          },
          redirect: 'if_required'
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        // If payment requires action, handle it
        if (result.paymentIntent && result.paymentIntent.status === 'requires_action') {
          const { error: confirmError } = await this.stripe.confirmPayment({
            elements: this.elements,
            redirect: 'if_required'
          });

          if (confirmError) {
            throw new Error(confirmError.message);
          }
        }

        // Confirm payment with backend
        if (result.paymentIntent) {
          const confirmResponse = await this.paymentService.confirmPayment(
            this.orderId!,
            result.paymentIntent.id
          ).toPromise();

          if (confirmResponse && confirmResponse.success) {
            // Clear cart and show success message
            await this.cartService.clearCart().toPromise();
            this.showMessage('Payment successful!', 'success');
            this.router.navigate(['/order-confirmation'], {
              queryParams: {
                status: 'success',
                order: this.orderId
              }
            });
          } else {
            throw new Error('Failed to confirm payment with backend');
          }
        }
      } catch (error) {
        console.error('Payment error:', error);
        this.isLoading = false;
        this.showMessage('Payment failed. Please try again.', 'error');
        return;
      }
    } else {
      // Process cash on delivery
      this.checkoutService.processCheckout(this.checkoutData).subscribe({
        next: (response) => {
          console.log('Checkout response:', response);
          this.orderId = response.id;
          this.isLoading = false;
          this.showMessage('Order placed successfully!', 'success');
          this.cartService.clearCart().subscribe();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Checkout error:', error);
          this.isLoading = false;
          this.showMessage('Failed to process checkout. Please try again.', 'error');
        }
      });
    }
  }

  get billingFormControls() {
    return this.billingForm.controls;
  }

  get shippingFormControls() {
    return this.shippingForm.controls;
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getErrorMessage(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (!control) return '';
    
    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('pattern')) {
      if (field === 'phone_number') {
        return 'Please enter a valid phone number (10-15 digits)';
      }
      if (field === 'post_code') {
        return 'Please enter a valid post code (5-10 digits)';
      }
    }
    return '';
  }
} 