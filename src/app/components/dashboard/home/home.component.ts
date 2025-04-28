import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Activity {
  icon: string;
  message: string;
  time: string;
}

interface Appointment {
  time: string;
  date: string;
  patientName: string;
  type: string;
  id: string;
}

interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalAppointemnts: number;
  totalHumanClinic: number;
  totalVet: number;
  totalService: number;
  totalFeedback: number;
  totalCategory: number;
  totalProduct: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule]
})
export class HomeComponent implements OnInit {
  userName = 'John Doe';
  stats: DashboardStats = {
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointemnts: 0,
    totalHumanClinic: 0,
    totalVet: 0,
    totalService: 0,
    totalFeedback: 0,
    totalCategory: 0,
    totalProduct: 0
  };

  recentActivities: Activity[] = [
    {
      icon: 'fas fa-user-plus',
      message: 'New patient registration - John Doe',
      time: '5 minutes ago'
    },
    {
      icon: 'fas fa-calendar-check',
      message: 'Appointment confirmed with Dr. Smith',
      time: '10 minutes ago'
    },
    {
      icon: 'fas fa-file-medical',
      message: 'Prescription issued for Sarah Johnson',
      time: '15 minutes ago'
    },
    {
      icon: 'fas fa-video',
      message: 'Video consultation completed with Mike Brown',
      time: '30 minutes ago'
    }
  ];

  upcomingAppointments: Appointment[] = [
    {
      time: '09:00 AM',
      date: 'Today',
      patientName: 'John Doe',
      type: 'General Checkup',
      id: '1'
    },
    {
      time: '10:30 AM',
      date: 'Today',
      patientName: 'Sarah Johnson',
      type: 'Follow-up',
      id: '2'
    },
    {
      time: '02:00 PM',
      date: 'Today',
      patientName: 'Mike Brown',
      type: 'Video Consultation',
      id: '3'
    }
  ];

  constructor(
    private router: Router, 
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        this.router.navigate(['/admin/login']);
        return;
      }
      this.loadDashboardData();
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      this.router.navigate(['/admin/login']);
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${adminToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }

  loadDashboardData() {
    this.http.get<DashboardStats>('http://localhost:8000/api/dashboard/stats', {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Error fetching dashboard stats:', error);
        if (error.status === 401) {
          this.router.navigate(['/admin/login']);
        }
      }
    });
  }

  startConsultation(appointment: Appointment): void {
    this.router.navigate(['/dashboard/consultations', appointment.id]);
  }

  rescheduleAppointment(appointment: Appointment): void {
    this.router.navigate(['/dashboard/appointments/reschedule', appointment.id]);
  }
} 