import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: number;
  type: 'human' | 'vet';
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private readonly baseStorageUrl = environment.apiUrl.replace('/api', '');

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  getProductsByType(type: 'human' | 'vet'): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/type/${type}`)
      .pipe(
        map(response => response.data)
      );
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, formData)
      .pipe(
        map(response => response.data)
      );
  }

  updateProduct(id: number, formData: FormData): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/${id}`, formData)
      .pipe(
        map(response => response.data)
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
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
} 