// booked-services.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Add this import

@Injectable({
  providedIn: 'root'
})
export class BookedServicesService {
  private apiUrl = 'http://localhost:8000/api/servicesbooking';

  constructor(private http: HttpClient) { }

  getBookedServices(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error: any) => {
        console.error('Error fetching bookings:', error);
        return throwError(() => new Error('Failed to load bookings'));
      })
    );
  }

  getBooking(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching booking:', error);
        return throwError(() => new Error('Failed to load booking'));
      })
    );
  }

  createBooking(bookingData: any): Observable<any> {
    return this.http.post(this.apiUrl, bookingData).pipe(
      catchError((error: any) => {
        console.error('Error creating booking:', error);
        return throwError(() => new Error('Failed to create booking'));
      })
    );
  }

  updateBooking(id: number, bookingData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, bookingData).pipe(
      catchError((error: any) => {
        console.error('Error updating booking:', error);
        return throwError(() => new Error('Failed to update booking'));
      })
    );
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError((error: any) => {
        console.error('Error deleting booking:', error);
        return throwError(() => new Error('Failed to delete booking'));
      })
    );
  }
}