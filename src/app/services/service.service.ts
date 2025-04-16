import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration: number;
  image: string;
  instructions?: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  // Move the base URL to environment for easier config management
  private baseUrl = 'http://127.0.0.1:8000/api/services';

  constructor(private http: HttpClient) {}

  // Get all services
  getServices(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Get a single service by ID
  getServiceById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new service
  addService(formData: FormData): Observable<any> {
    return this.http.post<any>(this.baseUrl, formData);
  }

  

  updateService(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }
  

  // Delete a service
  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/services/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Handle errors
  private handleError(error: any): Observable<never> {
    console.error('Error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}
