import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api'; // Laravel backend URL

  constructor(private http: HttpClient) { }

  getDoctors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctors`);
  }

  addDoctoor(doctorData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctor`, doctorData);
  }
}
