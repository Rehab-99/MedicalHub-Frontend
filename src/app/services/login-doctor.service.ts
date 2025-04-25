// src/app/services/login-doctor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginDoctorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  loginDoctor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctors/login`, data);
  }

  setDoctor(doctor: any, token: string) {
    localStorage.setItem('doctor', JSON.stringify(doctor));
    localStorage.setItem('token', token);
  }

  getDoctor() {
    return JSON.parse(localStorage.getItem('doctor') || '{}');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}