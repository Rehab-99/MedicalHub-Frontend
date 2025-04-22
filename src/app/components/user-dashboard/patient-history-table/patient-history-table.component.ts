import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule for the download link (even if href="#" for now)
import { AppointmentService } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';
import { DoctorService } from '../../../services/doctor.service';

@Component({
  selector: 'app-patient-history-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-history-table.component.html',
  styleUrl: './patient-history-table.component.scss'
})
export class PatientHistoryTableComponent implements OnInit {
  appointments: any[] = [];
  loading: boolean = true;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private doctorService: DoctorService
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.appointmentService.getAllAppointments().subscribe(appointments => {
          // Filter appointments for the current user
          const userAppointments = appointments.filter((app: any) => app.user_id === user.id);
          
          // Fetch doctor details for each appointment
          userAppointments.forEach(appointment => {
            this.doctorService.getDoctorById(appointment.doctor_id).subscribe(doctorResponse => {
              appointment.doctor = doctorResponse.data;
            });
          });

          this.appointments = userAppointments;
          this.loading = false;
        });
      }
    });
  }

  getStatusClass(status: string): string {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'status cured';
      case 'pending':
        return 'status treatment';
      case 'cancelled':
        return 'status cancelled';
      default:
        return 'status treatment';
    }
  }

  getSeverityClass(severity: string): string {
    switch(severity.toLowerCase()) {
      case 'high':
        return 'severity high';
      case 'medium':
        return 'severity medium';
      case 'low':
        return 'severity low';
      default:
        return 'severity low';
    }
  }
} 