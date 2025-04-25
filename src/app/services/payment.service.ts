import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

interface PaymentIntentResponse {
  clientSecret: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8000/api'; // Replace with your Laravel API URL

  constructor(private http: HttpClient) { }

  createPaymentIntent(orderId: number): Observable<PaymentIntentResponse> {
    console.log('Creating payment intent for order:', orderId);
    return this.http.post<PaymentIntentResponse>(`${this.apiUrl}/orders/${orderId}/payment-intent`, {}).pipe(
      tap(response => {
        console.log('Payment intent response:', response);
        if (!response || !response.clientSecret) {
          throw new Error('Invalid payment intent response: missing clientSecret');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating payment intent:', error);
        if (error.status === 401) {
          return throwError(() => new Error('Unauthorized: Please check your authentication'));
        } else if (error.status === 404) {
          return throwError(() => new Error('Order not found'));
        } else {
          return throwError(() => new Error('Failed to create payment intent. Please try again.'));
        }
      })
    );
  }

  confirmPayment(orderId: number, paymentIntentId: string): Observable<any> {
    console.log('Confirming payment for order:', orderId, 'with payment intent:', paymentIntentId);
    return this.http.post(`${this.apiUrl}/payments/${orderId}/stripe/confirm`, {
      payment_intent: paymentIntentId
    }).pipe(
      tap(response => console.log('Payment confirmation response:', response)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error confirming payment:', error);
        if (error.status === 401) {
          return throwError(() => new Error('Unauthorized: Please check your authentication'));
        } else if (error.status === 404) {
          return throwError(() => new Error('Order not found'));
        } else {
          return throwError(() => new Error('Failed to confirm payment. Please try again.'));
        }
      })
    );
  }
} 