import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {
  doctorName = ''; // Name of the logged-in doctor

  ngOnInit(): void {
    // Load doctor info from localStorage or API
    const doctor = JSON.parse(localStorage.getItem('doctor') || '{}');
    this.doctorName = doctor.name || 'Dr. Ahmed'; // Replace with real data
  }

  logout() {
    localStorage.removeItem('doctor');
    localStorage.removeItem('token');
    window.location.href = '/doctor-login';
  }
}
