import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../../services/doctor.service';
import { ClinicService } from '../../../../services/clinic.service';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';

interface ClinicResponse {
  data: {
    id: number;
    name: string;
    description: string;
    image?: string;
    doctors?: any[];
  };
}

@Component({
  selector: 'app-clinic-doctors',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './clinic-doctors.component.html',
  styleUrls: ['./clinic-doctors.component.css']
})
export class ClinicDoctorsComponent implements OnInit {
  doctors: any[] = [];
  clinicId: number = 0;
  clinicName: string = '';
  baseUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private clinicService: ClinicService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.clinicId = +params['id'];
      this.loadClinicAndDoctors();
    });
  }

  loadClinicAndDoctors() {
    this.clinicService.getClinic(this.clinicId).subscribe((response: ClinicResponse) => {
      console.log('Clinic Response:', response);
      this.clinicName = response.data.name;
      this.doctors = response.data.doctors || [];
      this.doctors.forEach(doctor => {
        console.log('Doctor:', doctor.name, 'Image Path:', doctor.image);
        console.log('Constructed Image URL:', this.getImageUrl(doctor.image));
      });
    });
  }

  bookAppointment(doc: any) {
    console.log('Booking appointment with:', doc.name);
    // TODO: Implement appointment booking
  }

  chatWithDoctor(doc: any) {
    console.log('Starting chat with:', doc.name);
    // TODO: Implement chat functionality
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/100';
    }
    // Check if the imagePath is already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // If it's a relative path, construct the full URL
    // Remove /api from the base URL for storage access
    const storageUrl = this.baseUrl.replace('/api', '');
    return `${storageUrl}/storage/${imagePath}`;
  }
} 