import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginDoctorService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  loginDoctor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctors/login`, data);
  }

  setToken(token: string) {
    localStorage.setItem('doctor_token', token);
  }

  setDoctor(doctor: any, token: string) {
    localStorage.setItem('doctor_data', JSON.stringify(doctor));
    this.setToken(token);
  }
}