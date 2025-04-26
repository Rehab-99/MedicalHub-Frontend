import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { LoginDoctorService } from '../../services/login-doctor.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { ChatWindowComponent } from '../../components/chat/chat-window.component';


@Component({
  selector: 'app-doctor-appointment',
  standalone: true,
  imports: [CommonModule,ChatWindowComponent],
  templateUrl: './doctor-appointment.component.html',
  styleUrls: ['./doctor-appointment.component.css'],
})
export class DoctorAppointmentComponent implements OnInit {
  appointments: any[] = [];
  isLoading = false;
  baseUrl = environment.apiUrl;
  activeChats: { [key: number]: boolean } = {}; // Track active chats by patient ID
  doctorId: number | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private loginDoctorService: LoginDoctorService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const doctor = this.loginDoctorService.getDoctor();
    if (doctor && doctor.id) {
      this.doctorId = doctor.id;
      this.fetchAppointments(doctor.id);
    } else {
      Swal.fire('Error', 'Unable to load doctor information. Please login again.', 'error');
      this.router.navigate(['/doctor-login']);
    }
  }
  fetchAppointments(doctorId: number) {
    this.isLoading = true;
    this.appointmentService.getDoctorAppointments(doctorId).subscribe({
      next: (response: any) => {
        this.appointments = response.data || response;
        console.log('Appointments:', JSON.stringify(this.appointments, null, 2));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching appointments:', error);
        Swal.fire('Error', 'Failed to load appointments. Please try again.', 'error');
        this.isLoading = false;
      },
    });
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/40'; // Fallback image
    }
    const storageUrl = this.baseUrl.replace('/api', '');
    return `${storageUrl}/storage/${imagePath}`;
  }

  goBack() {
    this.router.navigate(['/doctor-dashboard']);
  }

  cancelAppointment(appointmentId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will cancel the appointment. This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.cancelAppointment(appointmentId).subscribe({
          next: () => {
            this.appointments = this.appointments.filter(appt => appt.id !== appointmentId);
            Swal.fire('Cancelled!', 'The appointment has been cancelled.', 'success');
          },
          error: (error) => {
            console.error('Error cancelling appointment:', error);
            Swal.fire('Error', 'Failed to cancel appointment. Please try again.', 'error');
          }
        });
      }
    });
  }

  startChat(patient: any) {
    console.log('startChat called with patient:', patient);
    if (patient && patient.id && this.doctorId) {
      this.activeChats[patient.id] = true;
      console.log('activeChats updated:', JSON.stringify(this.activeChats));
      this.http.post(`${this.baseUrl}/chat/start`, { user_id: patient.id, doctor_id: this.doctorId })
        .subscribe({
          next: (response: any) => {
            console.log('Chat started successfully with patient:', patient.name, 'Response:', response);
          },
          error: (error) => {
            console.error('Error starting chat:', error);
            this.activeChats[patient.id] = false;
            console.log('activeChats reverted:', JSON.stringify(this.activeChats));
          }
        });
    } else {
      console.error('Cannot start chat: Invalid patient or doctorId', { patient, doctorId: this.doctorId });
    }
  }
  
  isChatActive(patientId: number): boolean {
    console.log('isChatActive called with patientId:', patientId, 'activeChats:', JSON.stringify(this.activeChats));
    return this.activeChats[patientId] || false;
  }
  closeChat(patientId: number) {
    this.activeChats[patientId] = false;
  }


}