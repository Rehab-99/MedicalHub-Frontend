import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { LoginDoctorService } from '../../services/login-doctor.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-doctor-appointment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-appointment.component.html',
  styleUrls: ['./doctor-appointment.component.css'],
})
export class DoctorAppointmentComponent implements OnInit {
  appointments: any[] = [];
  upcomingAppointments: any[] = []; // لتخزين المواعيد القريبة
  isLoading = false;
  baseUrl = environment.apiUrl;

  constructor(
    private appointmentService: AppointmentService,
    private loginDoctorService: LoginDoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const doctor = this.loginDoctorService.getDoctor();
    console.log('Doctor from LoginDoctorService:', doctor); // للتشخيص
    if (doctor && doctor.id) {
      this.fetchAppointments(doctor.id);
    } else {
      Swal.fire('Error', 'Unable to load doctor information. Please login again.', 'error');
      this.router.navigate(['/doctor-login']);
    }
  }

  fetchAppointments(doctorId: number) {
    console.log('Fetching appointments for doctor ID:', doctorId); // للتشخيص
    this.isLoading = true;
    this.appointmentService.getDoctorAppointments(doctorId).subscribe({
      next: (response: any) => {
        this.appointments = response.data || response;
        console.log('Appointments received:', this.appointments); // للتشخيص

        // تحقق إن كل المواعيد للدكتور ده
        const invalidAppointments = this.appointments.filter(appt => appt.doctor_id !== doctorId);
        if (invalidAppointments.length > 0) {
          console.warn('Warning: Found appointments for other doctors:', invalidAppointments);
        } else {
          console.log('All appointments are for the correct doctor ID:', doctorId);
        }

        // فلترة المواعيد القريبة (خلال 24 ساعة)
        this.upcomingAppointments = this.appointments.filter(appt => {
          const appointmentDateTime = new Date(`${appt.appointment_date}T${appt.appointment_time}`);
          const now = new Date();
          const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000); // الوقت بعد 24 ساعة
          return appointmentDateTime >= now && appointmentDateTime <= in24Hours;
        });
        console.log('Upcoming appointments within 24 hours:', this.upcomingAppointments); // للتشخيص

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
            // إعادة فلترة المواعيد القريبة بعد الإلغاء
            this.upcomingAppointments = this.upcomingAppointments.filter(appt => appt.id !== appointmentId);
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
}