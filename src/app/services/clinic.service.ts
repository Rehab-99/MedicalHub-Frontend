import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  private apiUrl = 'http://127.0.0.1:8000/api/clinics'; // Adjust based on Laravel API route

  constructor(private http: HttpClient) {}

  // Fetch all clinics
  getClinics(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  // Add a new clinic
addClinic(clinicData: any): Observable<any> {
  return this.http.post(this.apiUrl, clinicData);
}

  // Fetch a single clinic by ID
  getClinicById(id: number): Observable<any> {
    console.log('Making API Call to:', `${this.apiUrl}/${id}`); // ✅ Debugging Log
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  

// Update a clinic
updateClinic(id: number, clinicData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, clinicData);
}

  
  // Delete a clinic
  deleteClinic(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
