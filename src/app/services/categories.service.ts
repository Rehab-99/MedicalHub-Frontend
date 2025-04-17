import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CategoryResponse {
  status: number;
  message: string;
  data: Category[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  type: 'human' | 'vet';
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = environment.apiUrl;
  private readonly baseStorageUrl = environment.apiUrl.replace('/api', '');

  constructor(private http: HttpClient) {}

  getCategories(type: 'human' | 'vet'): Observable<Category[]> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/categories/type/${type}`).pipe(
      map(response => {
        if (response.status === 200 && Array.isArray(response.data)) {
          return response.data.map(category => ({
            ...category,
            image: this.getFullImageUrl(category.image)
          }));
        }
        throw new Error('Invalid response format');
      }),
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

    return `${this.baseStorageUrl}/storage/${imagePath}`;
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