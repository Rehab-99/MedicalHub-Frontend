import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  user_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
  status?: string;
  user?: { name: string; image?: string };
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  bookAppointment(data: Appointment): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointments`, data);
  }

  getAllAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments`);
  }

  getDoctorAppointments(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/doctor-appointments?doctor_id=${doctorId}`);
  }

  getDoctorPatients(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/doctor-patients?doctor_id=${doctorId}`);
  }

  updatePatientNotes(patientId: number, notes: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/doctor-patients/${patientId}/notes`, { notes });
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/appointments/${appointmentId}`);
  }
}