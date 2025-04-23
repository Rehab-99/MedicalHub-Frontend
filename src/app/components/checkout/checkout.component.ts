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
        console.log('Checkout successful:', response);
        // Clear the cart first
        this.cartService.clearCart().subscribe({
          next: () => {
            console.log('Cart cleared successfully');
            this.cartItems = []; // Clear local cart items
            this.totalPrice = 0; // Reset total price
            this.showMessage('Order placed successfully!', 'success');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error clearing cart:', error);
            this.showMessage('Order placed but cart clearing failed.', 'error');
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Checkout failed:', error);
        this.showMessage('Checkout failed. Please try again.', 'error');
        this.isLoading = false;
      }
    });
  }
} 