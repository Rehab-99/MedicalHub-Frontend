import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookedServicesService } from '../../../services/bookedservices.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-bookedservice',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bookedservice.component.html',
  styleUrl: './bookedservice.component.scss'
})
export class BookedServiceComponent implements OnInit {
  bookings: any[] = [];
  loading: boolean = true;

  constructor(
    private serviceBookingService: BookedServicesService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadServiceBookings();
  }

  loadServiceBookings(): void {
    this.loading = true;

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.serviceBookingService.getBookedServices().subscribe(allBookings => {
          const userBookings = allBookings.filter((b: any) => b.user_id === user.id);
          this.bookings = userBookings;
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'status cured';
      case 'pending': return 'status treatment';
      case 'confirmed': return 'status confirmed';
      case 'cancelled': return 'status cancelled';
      default: return 'status treatment';
    }
  }
}
