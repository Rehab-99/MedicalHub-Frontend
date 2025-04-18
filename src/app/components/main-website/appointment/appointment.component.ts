import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AppointmentService ,Appointment} from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
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

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
      }
    });

    this.fetchDoctors();
  }
  fetchDoctors() {
    this.http.get(`${environment.apiUrl}/doctors`).subscribe((res: any) => {
      console.log('Doctors response:', res); // 🔍 Check structure
      this.doctors = Array.isArray(res) ? res : res.data; // adjust based on what it logs
    });
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
