import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutService, CheckoutRequest, CheckoutItem } from '../../services/checkout.service';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutData: CheckoutRequest = {
    user_id: 0,
    status: 'pending',
    total_price: 0,
    payment_method: '',
    items: []
  };

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupType: 'success' | 'error' = 'success';
  orderId: number | null = null;

  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

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
        this.totalPrice = items.reduce((sum, item) => sum + item.total, 0);
        this.updateCheckoutData();
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
  }

  processCheckout() {
    if (this.cartItems.length === 0) {
      this.showMessage('Your cart is empty. Please add items before checkout.', 'error');
      return;
    }

    if (!this.checkoutData.payment_method) {
      this.showMessage('Please select a payment method.', 'error');
      return;
    }

    this.isLoading = true;

    this.checkoutService.processCheckout(this.checkoutData).subscribe({
      next: (response) => {
        console.log('Checkout response:', response);
        this.orderId = response.id;
        this.isLoading = false;
        
        if (this.checkoutData.payment_method === 'stripe') {
          console.log('Redirecting to Stripe payment page with order ID:', this.orderId);
          // Redirect to Stripe payment page
          this.router.navigate(['/payments', this.orderId, 'stripe']).then(success => {
            if (!success) {
              console.error('Failed to navigate to payment page');
              this.showMessage('Failed to redirect to payment page. Please try again.', 'error');
            }
          });
        } else {
          this.showMessage('Order placed successfully!', 'success');
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Checkout error:', error);
        this.isLoading = false;
        this.showMessage('Failed to process checkout. Please try again.', 'error');
      }
    });
  }
} 