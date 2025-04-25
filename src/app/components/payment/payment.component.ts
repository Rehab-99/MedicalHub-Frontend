import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { CartService } from '../../services/cart.service';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @ViewChild('paymentElement') paymentElement!: ElementRef;
  
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  orderId: number = 0;
  isLoading = false;
  errorMessage: string = '';
  clientSecret: string = '';
  isConfirmationPage = false;

  // Stripe public key from backend
  private readonly stripePublicKey = 'pk_test_51REdqh4G94LRAOydMDcGvERRCV7snk6EdwN5g217aIF7ULYL1nLwiYb1Xgnu5aR2nTbT1osbmS60J6XnNgGLoZOj00Z24z4TCv';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private cartService: CartService
  ) {}

  async ngOnInit() {
    try {
      console.log('Initializing payment component...');
      const orderIdParam = this.route.snapshot.paramMap.get('order');
      this.orderId = orderIdParam ? Number(orderIdParam) : 0;
      console.log('Order ID:', this.orderId);
      
      if (!this.orderId) {
        throw new Error('Order ID is missing');
      }

      // Check if we're on the confirmation page
      this.isConfirmationPage = this.router.url.includes('/stripe/confirm');
      
      if (this.isConfirmationPage) {
        await this.handlePaymentConfirmation();
      } else {
        await this.initializeStripe();
      }
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.errorMessage = 'Failed to initialize payment. Please try again.';
    }
  }

  private async handlePaymentConfirmation() {
    try {
      this.isLoading = true;
      const paymentIntentParam = new URLSearchParams(window.location.search).get('payment_intent');
      const clientSecret = new URLSearchParams(window.location.search).get('client_secret');
      
      if (!paymentIntentParam) {
        throw new Error('Payment intent ID is missing from URL');
      }

      if (!clientSecret) {
        throw new Error('Client secret is missing from URL');
      }

      // Initialize Stripe if not already initialized
      if (!this.stripe) {
        const stripe = await loadStripe(this.stripePublicKey);
        if (!stripe) {
          throw new Error('Failed to initialize Stripe');
        }
        this.stripe = stripe;
      }

      // First, retrieve the payment intent status from Stripe using the client secret
      const result = await this.stripe.retrievePaymentIntent(clientSecret);
      
      if (!result || !result.paymentIntent) {
        throw new Error('Could not retrieve payment intent status');
      }

      const { paymentIntent } = result;
      console.log('Payment intent status:', paymentIntent.status);

      // Check the payment intent status
      switch (paymentIntent.status) {
        case 'succeeded':
          try {
            // Payment is successful, confirm with our backend
            console.log('Confirming payment with backend...');
            const response = await this.paymentService.confirmPayment(this.orderId, paymentIntentParam).toPromise();
            console.log('Backend confirmation response:', response);

            if (response && response.success) {
              // Clear the cart after successful payment
              await this.cartService.clearCart().toPromise();
              
              // Redirect to success page
              this.router.navigate(['/order-confirmation'], { 
                queryParams: { 
                  status: 'success',
                  order: this.orderId
                }
              });
            } else {
              throw new Error(response?.message || 'Payment confirmation failed');
            }
          } catch (error) {
            console.error('Backend confirmation error:', error);
            throw new Error('Failed to confirm payment with backend. Please contact support.');
          }
          break;
        case 'processing':
          this.errorMessage = 'Payment is still processing. Please wait a moment and refresh the page.';
          break;
        case 'requires_payment_method':
          this.errorMessage = 'Payment failed. Please try again with a different payment method.';
          break;
        default:
          this.errorMessage = `Payment failed with status: ${paymentIntent.status}. Please try again.`;
          break;
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      this.errorMessage = error instanceof Error ? error.message : 'Failed to confirm payment. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async initializeStripe() {
    try {
      console.log('Creating payment intent...');
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
      this.errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.';
    }
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    if (!this.stripe || !this.elements) {
      this.errorMessage = 'Payment system not initialized. Please refresh the page.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      console.log('Confirming payment...');
      const paymentIntentId = this.clientSecret.split('_secret_')[0];
      console.log('Payment intent ID:', paymentIntentId);

      const result = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: `${window.location.origin}/payments/${this.orderId}/stripe/confirm?payment_intent=${paymentIntentId}&client_secret=${this.clientSecret}`,
        },
        redirect: 'always'  // Changed to always redirect
      });

      // This code will only run if redirect fails
      console.error('Payment confirmation failed to redirect:', result);
      this.errorMessage = 'Failed to process payment. Please try again.';
    } catch (error) {
      console.error('Payment error:', error);
      this.errorMessage = 'An error occurred while processing your payment.';
    } finally {
      this.isLoading = false;
    }
  }
} 