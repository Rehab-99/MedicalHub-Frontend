import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://127.0.0.1:8000/api/doctors'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getDoctorById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addDoctor(doctor: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, doctor);
  }

  updateDoctor(id: number, doctor: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, doctor);
  }
  // getVetDoctors(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}?role=vet`);
  // }
  
  // getHumanDoctors(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}?role=human`);
  // }
  

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
