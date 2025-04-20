import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { AuthService } from '../../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  bookingForm!: FormGroup;
  serviceId!: number;
  serviceName!: string;
  userId!: number; // Store the logged-in user's ID
  minDate: string = '';
  availableTimes: string[] = [];
  currentUser: any; // Store the logged-in user data

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.availableTimes = this.generateTimeSlots("07:00", "23:00"); // 01:00 is earlier than 07:00
  
    // Get the service ID from the URL
    this.serviceId = +this.route.snapshot.paramMap.get('id')!;
  
    // Initialize the booking form first (empty values for user/service for now)
    this.bookingForm = this.fb.group({
      user_id: [null, Validators.required],
      service_id: [this.serviceId, Validators.required],
      service_name: [''], // optional
      appointment_date: ['', Validators.required],
      appointment_time: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    });
  
    // Fetch the service name
    this.getServiceDetails(this.serviceId);
  
    // Fetch the logged-in user data using AuthService
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.userId = user.id;
        // Patch user_id into the form
        this.bookingForm.patchValue({ user_id: this.userId });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
  

  // Fetch the service details from the API
  getServiceDetails(serviceId: number): void {
    this.http.get<any>(`http://localhost:8000/api/services/${serviceId}`).subscribe(
      (data) => {
        this.serviceName = data.name;
        this.bookingForm.patchValue({ service_name: this.serviceName });
      },
      (err) => {
        console.error('Failed to fetch service details', err);
      }
    );
  }
  

  // Generate time slots like 09:00, 09:30, 10:00, ...
  generateTimeSlots(start: string, end: string, step = 30): string[] {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const result: string[] = [];

    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    let h = startHour;
    let m = startMin;

    while (h < endHour || (h === endHour && m <= endMin)) {
      result.push(`${pad(h)}:${pad(m)}`);
      m += step;
      if (m >= 60) {
        h += Math.floor(m / 60);
        m = m % 60;
      }
    }

    return result;
  }

  // Handle form submission
  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.http.post('http://localhost:8000/api/servicesbooking', this.bookingForm.value)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Service booked successfully!',
              confirmButtonColor: '#3085d6'
            }).then(() => {
              this.router.navigate(['/']); // Redirect after confirmation
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Booking Failed',
              text: err.error?.error || 'Failed to book service',
              confirmButtonColor: '#d33'
            });
          }
        });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill all the required fields.',
        confirmButtonColor: '#f0ad4e'
      });
    }
  }
}
