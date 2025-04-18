import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Service {
  id: number;
  name: string|null;
  description: string|null;
  price: string|null;
  duration: number;
  image: string|File|null;
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

    return this.http.get<Service>(`${this.baseUrl}/${id}`);

    
  }

  // Add a new service
  addService(formData: FormData): Observable<any> {
    return this.http.post<any>(this.baseUrl, formData);
  }

  

  updateService(id: number, service: FormData): Observable<any> {
    // Add _method=PUT to the FormData to simulate PUT request
    service.append('_method', 'PUT');
    return this.http.post(`${this.baseUrl}/${id}`, service);
  }
  

  // Delete a service
  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Handle errors
  private handleError(error: any): Observable<never> {
    console.error('Error details:', {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      errors: error.error // Server response (e.g., validation errors)
    });
    // Extract server error message if available
    const errorMessage = error.error?.message || error.error?.error || error.message || 'Server error';
    return throwError(() => new Error(errorMessage));
  }
}
