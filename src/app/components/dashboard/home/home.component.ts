import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class HomeComponent implements OnInit {
  userName = 'John Doe';
  todayAppointments = 8;
  onlineConsultations = 3;
  pendingPrescriptions = 12;
  totalPatients = 150;

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize dashboard data
    this.loadDashboardData();
  }

  loadDashboardData() {
    // TODO: Implement API calls to load real data
    // This is currently using mock data
  }

  startConsultation(appointment: Appointment): void {
    this.router.navigate(['/dashboard/consultations', appointment.id]);
  }

  rescheduleAppointment(appointment: Appointment): void {
    this.router.navigate(['/dashboard/appointments/reschedule', appointment.id]);
  }
} 