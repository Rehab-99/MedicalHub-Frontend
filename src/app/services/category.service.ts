import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  type: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getHumanCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/type/human`);
  }

  getVetCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/type/vet`);
  }

  getCategoriesByType(type: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/type/${type}`);
  }

  getCategory(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/${id}`);
  }

  createCategory(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl + '/categories', formData);
  }

  updateCategory(id: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories/${id}`, formData);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }
} 