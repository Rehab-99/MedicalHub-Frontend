import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

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
  ) {}

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

  getTotal(): number {
    return this.cartTotal.value;
  }

  private calculateTotal(items: CartItem[]): void {
    const total = items.reduce((sum, item) => sum + item.total, 0);
    this.cartTotal.next(total);
  }
}
