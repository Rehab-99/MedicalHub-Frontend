import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private cartTotal = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Load cart items from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      this.cartItems.next(items);
      this.calculateTotal(items);
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token found');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }

  getCartItems(): Observable<CartItem[]> {
    const headers = this.getHeaders();
    console.log('Fetching cart items with headers:', headers);
    
    this.http.get('http://localhost:8000/api/cart', { 
      headers: headers,
      observe: 'response'
    }).subscribe({
      next: (response: any) => {
        console.log('Full API Response:', response);
        if (response.body && response.body.cart_items) {
          const items = response.body.cart_items.map((item: any) => {
            console.log('Processing cart item:', item);
            return {
              id: item.id,
              productId: item.product_id,
              name: item.product.name,
              price: parseFloat(item.product.price),
              quantity: item.quantity,
              total: parseFloat(item.product.price) * item.quantity,
              image: 'http://127.0.0.1:8000/storage/' + item.product.image,
              description: item.product.description
            };
          });
          console.log('Processed cart items:', items);
          this.cartItems.next(items);
          this.calculateTotal(items);
        } else {
          console.warn('No cart items found in response');
          this.cartItems.next([]);
        }
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
        if (error.status === 401) {
          console.error('Unauthorized - Token might be invalid or expired');
        }
        this.cartItems.next([]);
      }
    });
    return this.cartItems.asObservable();
  }

  updateQuantity(productId: number, quantity: number): void {
    const headers = this.getHeaders();
    this.http.put(`http://localhost:8000/api/cart/update/${productId}`, 
      { quantity },
      { headers }
    ).subscribe({
      next: () => {
        this.getCartItems();
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
      }
    });
  }

  removeItem(productId: number): void {
    const headers = this.getHeaders();
    this.http.delete(`http://localhost:8000/api/cart/remove/${productId}`, { headers })
      .subscribe({
        next: () => {
          this.getCartItems();
        },
        error: (error) => {
          console.error('Error removing item:', error);
        }
      });
  }

  getTotal(): Observable<number> {
    return this.cartItems.pipe(
      map(items => items.reduce((sum, item) => sum + item.total, 0))
    );
  }

  private calculateTotal(items: CartItem[]): void {
    const total = items.reduce((sum, item) => sum + item.total, 0);
    this.cartTotal.next(total);
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(i => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
      existingItem.total = existingItem.price * existingItem.quantity;
    } else {
      currentItems.push(item);
    }

    this.cartItems.next(currentItems);
    this.calculateTotal(currentItems);
    this.saveCart();
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.value.filter(item => item.productId !== productId);
    this.cartItems.next(currentItems);
    this.calculateTotal(currentItems);
    this.saveCart();
  }

  clearCart(): Observable<void> {
    const headers = this.getHeaders();
    return new Observable<void>(observer => {
      this.http.delete('http://localhost:8000/api/cart/clear', { headers })
        .subscribe({
          next: () => {
            this.cartItems.next([]);
            this.cartTotal.next(0);
            localStorage.removeItem('cart');
            observer.next();
            observer.complete();
          },
          error: (error) => {
            console.error('Error clearing cart:', error);
            observer.error(error);
          }
        });
    });
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }
}
