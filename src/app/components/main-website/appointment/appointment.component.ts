import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AppointmentService ,Appointment} from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment',
  imports: [FooterComponent,HeaderComponent,CommonModule,FormsModule],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent implements OnInit {
  appointment: Partial<Appointment> = {};
  currentUserId!: number;
  doctors: any[] = [];
  doctorId: number | null = null; // Doctor ID from URL
  doctor: any; // To store the doctor details, if needed

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get the doctorId from the URL
    const doctorIdParam = this.route.snapshot.paramMap.get('doctorId');
    if (doctorIdParam) {
      this.doctorId = +doctorIdParam; // Convert to number if it's available
    } else {
      this.doctorId = null; // Handle the case where doctorId is not in the URL
    }

    // Fetch current user details
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
      }
    });

    // Fetch the doctors list
    this.fetchDoctors();
  }

  fetchDoctors() {
    this.http.get(`${environment.apiUrl}/doctors`).subscribe((res: any) => {
      console.log('Doctors response:', res); // 🔍 Check structure
      this.doctors = Array.isArray(res) ? res : res.data; // adjust based on what it logs

      // If doctorId exists in the URL, select the doctor
      if (this.doctorId) {
        this.selectDoctorById(this.doctorId);
      }
    });
  }
  isOverlapping(existingTime: string, selectedTime: string): boolean {
    const existing = new Date(`1970-01-01T${existingTime}`);
    const selected = new Date(`1970-01-01T${selectedTime}`);
    const diffInMinutes = Math.abs(existing.getTime() - selected.getTime()) / (1000 * 60);
    return diffInMinutes < 30;
  }
  
  // Method to select a doctor by id
  selectDoctorById(doctorId: number) {
    const selectedDoctor = this.doctors.find(doctor => doctor.id === doctorId);
    if (selectedDoctor) {
      this.appointment.doctor_id = selectedDoctor.id; // Set the selected doctor's id
      console.log('Selected doctor:', selectedDoctor);
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.currentUserId) {
      const now = new Date();
      const selectedDateTime = new Date(`${this.appointment.appointment_date}T${this.appointment.appointment_time}`);
  
      if (selectedDateTime < now) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Time',
          text: "You can't book an appointment in the past.",
        });
        return;
      }
  
      // Check for 30-min conflict
      this.http.get(`${environment.apiUrl}/appointments?doctor_id=${this.appointment.doctor_id}&date=${this.appointment.appointment_date}`)
        .subscribe((res: any) => {
          const existingAppointments = res.data || res; // depends on backend
  
          const conflict = existingAppointments.some((appt: any) =>
            this.isOverlapping(appt.appointment_time, this.appointment.appointment_time!)
          );
  
          if (conflict) {
            Swal.fire({
              icon: 'warning',
              title: 'Time Unavailable',
              text: 'This time slot is too close to another booking. Please choose a different time (min 30 min gap).',
            });
            return;
          }
  
          // No conflict – proceed with booking
          const payload: Appointment = {
            user_id: this.currentUserId,
            doctor_id: this.appointment.doctor_id!,
            appointment_date: this.appointment.appointment_date!,
            appointment_time: this.appointment.appointment_time!,
            notes: this.appointment.notes,
          };
  
          this.appointmentService.bookAppointment(payload).subscribe({
            next: (res) => {
              Swal.fire({
                icon: 'success',
                title: 'Appointment Booked',
                text: res.message,
              });
              form.resetForm();
            },
            error: (err) => {
              console.error('Booking Error:', err);
              Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: err.error.error || 'Failed to book appointment',
              });
            },
          });
        });
    }
  }
  

  onCancel() {
    this.appointment = {};
    Swal.fire({
      icon: 'info',
      title: 'Form Cleared',
      text: 'Appointment form has been reset.',
    });
  }
  
}