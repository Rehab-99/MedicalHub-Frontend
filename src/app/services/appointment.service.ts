import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  user_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8000/api/appointments'; // Adjust if needed

  constructor(private http: HttpClient) {}

  bookAppointment(data: Appointment): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
