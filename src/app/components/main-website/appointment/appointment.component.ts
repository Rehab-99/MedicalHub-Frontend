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
      const payload: Appointment = {
        user_id: this.currentUserId,
        doctor_id: this.appointment.doctor_id!,
        appointment_date: this.appointment.appointment_date!,
        appointment_time: this.appointment.appointment_time!,
        notes: this.appointment.notes,
      };

      this.appointmentService.bookAppointment(payload).subscribe({
        next: (res) => {
          alert(res.message);
          form.resetForm();
        },
        error: (err) => {
          alert(err.error.error || 'Failed to book appointment');
        },
      });
    }
  }

  onCancel() {
    this.appointment = {};
  }
}