import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef // for manually triggering change detection
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.appointmentService.getAllAppointments().subscribe(async (appointments) => {
          const userAppointments = appointments.filter((app: any) => app.user_id === user.id);

          const withDoctors = await Promise.all(userAppointments.map(async (app) => {
            const doctorResponse = await this.doctorService.getDoctorById(app.doctor_id).toPromise();
            app.doctor = doctorResponse.data;
            return app;
          }));

          this.appointments = withDoctors;
          this.loading = false;
          this.cdr.detectChanges(); // force Angular to update view
        });
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'status cured';
      case 'pending': return 'status treatment';
      case 'cancelled': return 'status cancelled';
      default: return 'status treatment';
    }
  }

  getSeverityClass(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'high': return 'severity high';
      case 'medium': return 'severity medium';
      case 'low': return 'severity low';
      default: return 'severity low';
    }
  }
}
