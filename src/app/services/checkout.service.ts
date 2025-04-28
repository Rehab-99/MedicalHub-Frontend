import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postCode: string;
  country: string;
  state: string;
}

export interface CheckoutRequest {
  payment_method: string;
  addr: {
    billing: CheckoutAddress;
    shipping: CheckoutAddress;
  };
}

export interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface CartResponse {
  cart: CartItem[];
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = environment.apiUrl + '/checkout';

  constructor(private http: HttpClient) {}

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.apiUrl}`);
  }

  processCheckout(data: CheckoutRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }
} 