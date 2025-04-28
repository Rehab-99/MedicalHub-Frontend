import { Component ,OnInit} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookedServicesService } from '../../../services/bookedservices.service';

@Component({
  selector: 'app-bookedservices',
  standalone: true,  // Add this
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './bookedservices.component.html',
  styleUrls: ['./bookedservices.component.css']

})
export class BookedServicesComponent implements OnInit {
  bookings: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private bookedServicesService: BookedServicesService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.error = null;
    
    this.bookedServicesService.getBookedServices().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load bookings. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updateStatus(booking: any): void {
    const originalStatus = booking.status;
    
    this.bookedServicesService.updateBooking(booking.id, { status: booking.status })
      .subscribe({
        error: (error) => {
          console.error('Error updating status:', error);
          booking.status = originalStatus; // Revert on error
          this.error = 'Failed to update status. Please try again.';
        }
      });
  }
 

  deleteBooking(id: number): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookedServicesService.deleteBooking(id).subscribe(
        () => {
          this.bookings = this.bookings.filter(booking => booking.id !== id);
        },
        (error) => {
          console.error('Error deleting booking:', error);
        }
      );
    }
  }
}
