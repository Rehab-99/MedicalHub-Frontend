// src/app/services/checkout.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CartResponse {
  cart: any[];
}

export interface OrderResponse {
  message: string;
  order: any;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private baseUrl = `${environment.apiUrl}/checkout`;

  constructor(private http: HttpClient) {}

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.baseUrl);
  }

  createOrder(data: any): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.baseUrl, data);
  }
}
