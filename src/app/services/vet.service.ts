import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VetService {
  private apiUrl = 'http://127.0.0.1:8000/api/vets';

  constructor(private http: HttpClient) {}

  // Fetch all vet clinics
  getVetClinics(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Fetch a single vet clinic by ID
  getVetClinic(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Add a new vet clinic
  createVetClinic(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  // Update a vet clinic
  updateVetClinic(id: number, formData: FormData): Observable<any> {
    // Add _method=PUT to the FormData to simulate PUT request
    formData.append('_method', 'PUT');
    return this.http.post(`${this.apiUrl}/${id}`, formData);
  }

  // Delete a vet clinic
  deleteVetClinic(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 