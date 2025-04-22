import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  isLoading: boolean = true;
  error: string | null = null;
  isAuthenticated: boolean = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('Initializing shopping cart component');
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log('Authentication status:', this.isAuthenticated);
    
    if (this.isAuthenticated) {
      this.loadCartItems();
    } else {
      this.error = 'Please login to view your cart';
      this.isLoading = false;
    }
  }

  loadCartItems(): void {
    console.log('Loading cart items...');
    this.isLoading = true;
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        console.log('Received cart items:', items);
        this.cartItems = items;
        this.calculateTotal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
        if (error.status === 401) {
          this.error = 'Your session has expired. Please login again.';
        } else {
          this.error = 'Failed to load cart items. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  getQuantityOptions(max: number): number[] {
    return Array.from({length: max}, (_, i) => i + 1);
  }

  updateQuantity(productId: number, quantity: number): void {
    console.log('Updating quantity for product:', productId, 'to:', quantity);
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    console.log('Removing product:', productId);
    this.cartService.removeItem(productId);
  }

  calculateTotal(): void {
    this.cartTotal = this.cartService.getTotal();
    console.log('Calculated cart total:', this.cartTotal);
  }
} 