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
  private apiUrl = 'http://127.0.0.1:8000/api/clinics'; // Updated to use 127.0.0.1

  constructor(private http: HttpClient) {}

  // Fetch all clinics
  getClinics(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Fetch a single clinic by ID
  getClinic(id: number): Observable<ClinicResponse> {
    console.log('Making API Call to:', `${this.apiUrl}/${id}`);
    return this.http.get<ClinicResponse>(`${this.apiUrl}/${id}`).pipe(
      tap(response => {
        console.log('API Response:', response);
        if (response && response.data && response.data.doctors) {
          console.log('Doctors in response:', response.data.doctors);
        }
      })
    );
  }

  // Add a new clinic
  addClinic(clinicData: any): Observable<any> {
    return this.http.post(this.apiUrl, clinicData);
  }

  // Update a clinic
  updateClinic(id: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}`, formData);
  }

  // Delete a clinic
  deleteClinic(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  createClinic(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
