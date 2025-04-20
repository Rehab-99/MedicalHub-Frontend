import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorRequestService {
  private apiUrl = 'http://127.0.0.1:8000/api/doctorrequest';

  constructor(private http: HttpClient) {}

  submitDoctorRequest(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, {
      headers: { Accept: 'application/json' },
    });
  }
}