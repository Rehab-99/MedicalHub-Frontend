import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoginDoctorService } from '../../services/login-doctor.service';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {
  doctorName = 'Doctor';
  doctorImage: string | null = null; // No default image, we'll use icon

  constructor(
    private loginDoctorService: LoginDoctorService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    const doctor = this.loginDoctorService.getDoctor();
    if (doctor.id) {
      this.doctorService.getDoctorById(doctor.id).subscribe({
        next: (response: any) => {
          this.doctorName = response.data?.name || 'Doctor';
          this.doctorImage = response.data?.image
            ? `http://127.0.0.1:8000/storage/${response.data.image}`
            : null;
          console.log('Doctor data from API:', response.data);
          console.log('Doctor image URL:', this.doctorImage);
        },
        error: (err) => {
          console.error('Error fetching doctor:', err);
          this.doctorName = doctor.name || 'Doctor';
          this.doctorImage = null;
        }
      });
    } else {
      this.doctorName = 'Doctor';
      this.doctorImage = null;
    }
  }
  getFormattedName(): string {
    if (!this.doctorName) return 'Doctor';
    return this.doctorName.trim().toLowerCase().startsWith('dr') ? this.doctorName : `Dr. ${this.doctorName}`;
  }
  
  logout() {
    localStorage.removeItem('doctor');
    localStorage.removeItem('token');
    localStorage.removeItem('doctor_role');
    window.location.href = '/doctor-login';
  }
}