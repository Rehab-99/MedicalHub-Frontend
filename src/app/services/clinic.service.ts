import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface ClinicResponse {
  data: {
    id: number;
    name: string;
    description: string;
    image?: string;
    doctors?: any[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // Fetch all clinics based on type
  getClinics(type: 'clinics' | 'vets' = 'clinics'): Observable<any> {
    return this.http.get(`${this.baseUrl}/${type}`);
  }

  // Fetch a single clinic by ID
  getClinic(id: number, type: 'clinics' | 'vets' = 'clinics'): Observable<ClinicResponse> {
    console.log('Making API Call to:', `${this.baseUrl}/${type}/${id}`);
    return this.http.get<ClinicResponse>(`${this.baseUrl}/${type}/${id}`).pipe(
      tap(response => {
        console.log('API Response:', response);
        if (response && response.data && response.data.doctors) {
          console.log('Doctors in response:', response.data.doctors);
        }
      })
    );
  }

  // Add a new clinic
  addClinic(clinicData: any, type: 'clinics' | 'vets' = 'clinics'): Observable<any> {
    return this.http.post(`${this.baseUrl}/${type}`, clinicData);
  }

  // Update a clinic
  updateClinic(id: number, formData: FormData, type: 'clinics' | 'vets' = 'clinics'): Observable<any> {
    return this.http.post(`${this.baseUrl}/${type}/${id}`, formData);
  }

  // Delete a clinic
  deleteClinic(id: number, type: 'clinics' | 'vets' = 'clinics'): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${type}/${id}`);
  }

  createClinic(formData: FormData, type: 'clinics' | 'vets' = 'clinics'): Observable<any> {
    return this.http.post(`${this.baseUrl}/${type}`, formData);
  }
}
