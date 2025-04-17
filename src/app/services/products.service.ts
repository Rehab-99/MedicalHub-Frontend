import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ProductResponse {
  status: number;
  message: string;
  data: Product[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  type: 'human' | 'vet';
  category_id: number;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = environment.apiUrl;
  private readonly baseStorageUrl = environment.apiUrl.replace('/api', '');

  constructor(private http: HttpClient) {}

  getProducts(type: 'human' | 'vet'): Observable<Product[]> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products/type/${type}`).pipe(
      map(response => {
        if (response.status === 200 && Array.isArray(response.data)) {
          return response.data.map(product => ({
            ...product,
            image: this.getFullImageUrl(product.image)
          }));
        }
        throw new Error('Invalid response format');
      }),
      catchError(this.handleError)
    );
  }

  private getFullImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'assets/images/placeholder-product.jpg';
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    return `${this.baseStorageUrl}/storage/${imagePath}`;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred while fetching products';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else if (error.error && error.error.message) {
      // Server-side error with message
      errorMessage = error.error.message;
    } else if (error.status) {
      // HTTP status error
      errorMessage = `Server returned code ${error.status}`;
    }
    
    return throwError(() => errorMessage);
  }
} 