import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VetCategoryService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vet-categories`);
  }

  getCategory(id: number): Observable<any> {
    console.log('Getting vet category with ID:', id);
    const formData = new FormData();
    formData.append('_method', 'GET');
    return this.http.post(`${this.apiUrl}/vet-categories/${id}`, formData);
  }

  createCategory(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/vet-categories`, formData);
  }

  updateCategory(id: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/vet-categories/${id}`, formData);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/vet-categories/${id}`);
  }
} 