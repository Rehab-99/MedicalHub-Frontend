import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  getCategory(id: number): Observable<any> {
    console.log('Getting category with ID:', id);
    return this.http.get(`${this.apiUrl}/categories/${id}`);
  }

  createCategory(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, formData);
  }

  updateCategory(id: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories/${id}`, formData);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }

  getCategoriesByType(type: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/type/${type}`);
  }
} 