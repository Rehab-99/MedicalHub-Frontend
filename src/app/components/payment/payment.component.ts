import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
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

  // Stripe public key from backend
  private readonly stripePublicKey = 'pk_test_51REdqh4G94LRAOydMDcGvERRCV7snk6EdwN5g217aIF7ULYL1nLwiYb1Xgnu5aR2nTbT1osbmS60J6XnNgGLoZOj00Z24z4TCv';

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
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
      
      await this.initializeStripe();
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.errorMessage = 'Failed to initialize payment. Please try again.';
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
          return_url: `${window.location.origin}/payments/${this.orderId}/stripe/confirm?payment_intent=${paymentIntentId}`,
        },
        redirect: 'if_required'
      });

      console.log('Payment confirmation result:', result);

      if (result.error) {
        console.error('Payment error:', result.error);
        this.errorMessage = result.error.message || 'An unknown error occurred';
      } else {
        console.log('Payment confirmation successful');
        if (result.paymentIntent) {
          console.log('Payment intent status:', result.paymentIntent.status);
          if (result.paymentIntent.status === 'succeeded') {
            console.log('Payment succeeded');
            // Payment succeeded, handle accordingly
          } else if (result.paymentIntent.status === 'requires_action') {
            console.log('Payment requires action');
            // Payment requires additional action, handle accordingly
          }
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      this.errorMessage = 'An error occurred while processing your payment.';
    } finally {
      this.isLoading = false;
    }
  }
} 