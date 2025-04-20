import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DoctorRequestService } from '../../../services/doctor-request.service';

@Component({
  selector: 'app-doctor-request',
  imports: [CommonModule],
  templateUrl: './doctor-request.component.html',
  styleUrl: './doctor-request.component.css'
})
export class DoctorRequestComponent {

  doctorRequests: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(public doctorRequestService: DoctorRequestService) {}

  ngOnInit(): void {
    this.fetchDoctorRequests();
  }

  fetchDoctorRequests(): void {
    this.loading = true;
    this.doctorRequestService.getDoctorRequests().subscribe({
      next: (response) => {
        this.doctorRequests = response;
        // Log file URLs for debugging
        this.doctorRequests.forEach(request => {
          console.log('Card Image URL:', this.doctorRequestService.getFileUrl(request.card_image));
          console.log('Certificate PDF URL:', this.doctorRequestService.getFileUrl(request.certificate_pdf));
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load doctor requests';
        this.loading = false;
        console.error(err);
      },
    });
  }
}
