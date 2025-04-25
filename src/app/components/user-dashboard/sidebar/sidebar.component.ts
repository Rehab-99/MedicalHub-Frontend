import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ChatWindowComponent } from '../../chat/chat-window.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatWindowComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  currentRoute: string = '';
  baseUrl = environment.apiUrl;
  currentUserId: number | null = null;
  appointments: any[] = [];
  doctors: any[] = [];
  activeChats: { [key: number]: boolean } = {};

  constructor(
    private router: Router,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private http: HttpClient
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
        this.loadAllAppointments();
      }
    });
  }

  loadAllAppointments() {
    if (this.currentUserId) {
      this.appointmentService.getAllAppointments().subscribe(appointments => {
        // Filter appointments for the current user
        const userAppointments = appointments.filter((app: any) => app.user_id === this.currentUserId);
  
        // If appointments exist, fetch all related doctor details
        if (userAppointments.length > 0) {
          // Optional: Sort by date/time if needed
          userAppointments.sort((a: any, b: any) => {
            const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
            const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
            return dateB.getTime() - dateA.getTime(); // Newest first
          });
  
          // Store appointments for display
          this.appointments = userAppointments;
  
          // Optionally, fetch doctor info for all appointments (avoid duplicates)
          const uniqueDoctorIds = [...new Set(userAppointments.map(app => app.doctor_id))];
  
          this.doctors = [];
  
          uniqueDoctorIds.forEach(id => {
            this.doctorService.getDoctorById(id).subscribe(res => {
              this.doctors.push(res.data);
            });
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

  startChat(doctor: any) {
    if (doctor) {
      this.activeChats[doctor.id] = true;
      this.http.post(`${this.baseUrl}/chat/start`, { doctor_id: doctor.id })
        .subscribe({
          next: (response: any) => {
            console.log('Chat started successfully with doctor:', doctor.name);
          },
          error: (error) => {
            console.error('Error starting chat:', error);
            this.activeChats[doctor.id] = false;
          }
        });
    }
  }
  
  closeChat(doctorId: number) {
    this.activeChats[doctorId] = false;
  }

  isChatActive(doctorId: number): boolean {
    return this.activeChats[doctorId] || false;
  }
} 