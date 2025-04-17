import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getHumanCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/type/human`);
  }

  getVetCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/type/vet`);
  }

  getProductsByCategory(categoryId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/category/${categoryId}`);
  }
} 