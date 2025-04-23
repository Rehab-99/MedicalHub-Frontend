import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CheckoutItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface CheckoutRequest {
  user_id: number;
  status: string;
  total_price: number;
  payment_method: string;
  items: CheckoutItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = `${environment.apiUrl}/checkout`;

  constructor(private http: HttpClient) { }

  processCheckout(checkoutData: CheckoutRequest): Observable<any> {
    return this.http.post(this.apiUrl, checkoutData);
  }
} 