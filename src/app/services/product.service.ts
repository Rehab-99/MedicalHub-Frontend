import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  createProduct(productData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, productData);
  }

  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getProductsByType(type: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/products/type/${type}`);
  }

  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: number, productData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}`, productData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 