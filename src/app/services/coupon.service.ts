import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { timeout, retry, catchError, map } from 'rxjs/operators';

export interface Coupon {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  usage_limit: number;
  used_times: number;
  expires_at: string;
  is_active: number;
}

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private apiUrl = 'http://localhost:8000/api/getcoupons';
  private timeoutDuration = 10000; // 10 seconds timeout
  private maxRetries = 2;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred while processing your request';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 422) {
        return throwError(() => error.error);
      }
      errorMessage = `Server Error: ${error.status}\n${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  getCoupons(): Observable<Coupon[]> {
    return this.http.get<{ coupons: Coupon[] }>(this.apiUrl).pipe(
      map(response => response.coupons)
    );
  }

  createCoupon(coupon: Coupon): Observable<Coupon> {
    return this.http.post<Coupon>(`${this.apiUrl}/create`, coupon).pipe(
      timeout(this.timeoutDuration),
      retry(this.maxRetries),
      catchError(this.handleError)
    );
  }

  updateCoupon(id: number, coupon: Coupon): Observable<Coupon> {
    return this.http.put<Coupon>(`${this.apiUrl}/update/${id}`, coupon).pipe(
      timeout(this.timeoutDuration),
      retry(this.maxRetries),
      catchError(this.handleError)
    );
  }

  deleteCoupon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(
      timeout(this.timeoutDuration),
      retry(this.maxRetries),
      catchError(this.handleError)
    );
  }

  validateCoupon(code: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validate`, { code }).pipe(
      timeout(this.timeoutDuration),
      retry(this.maxRetries),
      catchError(this.handleError)
    );
  }
} 