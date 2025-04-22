import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  currentRoute: string = '';
  doctor: any = null;
  baseUrl = environment.apiUrl;
  currentUserId: number | null = null;

  constructor(
    private router: Router,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });

    // Get current user
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
        this.loadLatestAppointment();
      }
    });
  }

  loadLatestAppointment() {
    if (this.currentUserId) {
      this.appointmentService.getAllAppointments().subscribe(appointments => {
        // Filter appointments for the current user and get the latest one
        const userAppointments = appointments.filter((app: any) => app.user_id === this.currentUserId);
        if (userAppointments.length > 0) {
          const latestAppointment = userAppointments[userAppointments.length - 1];
          // Fetch doctor details
          this.doctorService.getDoctorById(latestAppointment.doctor_id).subscribe(response => {
            this.doctor = response.data;
          });
        }
      });
    }
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      return 'assets/images/doctor-avatar.jpg';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const storageUrl = this.baseUrl.replace('/api', '');
    return `${storageUrl}/storage/${imagePath}`;
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }
} 