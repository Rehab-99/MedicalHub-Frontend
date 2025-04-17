import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrl;
  private readonly baseStorageUrl = environment.apiUrl.replace('/api', '');

  constructor(private http: HttpClient) {}

  getHumanCategories(): Observable<Category[]> {
    console.log('Fetching human categories from:', `${this.apiUrl}/categories/type/human`);
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories/type/human`)
      .pipe(
        map(response => {
          console.log('Human categories response:', response);
          if (response && response.data) {
            return response.data.map(category => ({
              ...category,
              image: this.getFullImageUrl(category.image || '')
            }));
          }
          return [];
        }),
        catchError(this.handleError)
      );
  }

  getVetCategories(): Observable<Category[]> {
    console.log('Fetching vet categories from:', `${this.apiUrl}/categories/type/vet`);
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories/type/vet`)
      .pipe(
        map(response => {
          console.log('Vet categories response:', response);
          if (response && response.data) {
            return response.data.map(category => ({
              ...category,
              image: this.getFullImageUrl(category.image || '')
            }));
          }
          return [];
        }),
        catchError(this.handleError)
      );
  }

  getCategoriesByType(type: string): Observable<Category[]> {
    console.log('Fetching categories by type:', type);
    console.log('API URL:', `${this.apiUrl}/categories/type/${type}`);
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories/type/${type}`)
      .pipe(
        map(response => {
          console.log('Categories response:', response);
          if (response && response.data) {
            return response.data.map(category => ({
              ...category,
              image: this.getFullImageUrl(category.image || '')
            }));
          }
          return [];
        }),
        catchError(this.handleError)
      );
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/categories/${id}`)
      .pipe(
        map(response => {
          if (response && response.data) {
            return {
              ...response.data,
              image: this.getFullImageUrl(response.data.image || '')
            };
          }
          throw new Error('Category not found');
        }),
        catchError(this.handleError)
      );
  }

  createCategory(formData: FormData): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/categories`, formData)
      .pipe(
        map(response => {
          if (response && response.data) {
            return {
              ...response.data,
              image: this.getFullImageUrl(response.data.image || '')
            };
          }
          throw new Error('Failed to create category');
        }),
        catchError(this.handleError)
      );
  }

  updateCategory(id: number, formData: FormData): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/categories/${id}`, formData)
      .pipe(
        map(response => {
          if (response && response.data) {
            return {
              ...response.data,
              image: this.getFullImageUrl(response.data.image || '')
            };
          }
          throw new Error('Failed to update category');
        }),
        catchError(this.handleError)
      );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/categories/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  private getFullImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'assets/images/placeholder-category.jpg';
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const baseUrl = this.baseStorageUrl.replace('localhost', '127.0.0.1');
    return `${baseUrl}/storage/${imagePath}`;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred while fetching categories';
    
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