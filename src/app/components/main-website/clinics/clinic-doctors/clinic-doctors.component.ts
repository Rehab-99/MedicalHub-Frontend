import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  clinicType: 'human' | 'vet' = 'human';
  baseUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private clinicService: ClinicService,
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      this.clinicId = +params['id'];
      // Check if we're in a vet route
      this.clinicType = window.location.pathname.includes('/vets/') ? 'vet' : 'human';
      console.log('Clinic type set to:', this.clinicType);
      this.loadClinicAndDoctors();
    });
  }

  loadClinicAndDoctors() {
    console.log('Loading doctors for clinic:', {
      clinicId: this.clinicId,
      clinicType: this.clinicType
    });

    // First get the clinic name
    const endpoint = this.clinicType === 'human' ? 'clinics' : 'vets';
    this.clinicService.getClinic(this.clinicId, endpoint).subscribe((response: ClinicResponse) => {
      console.log('Clinic response:', response);
      this.clinicName = response.data.name;
    });

    // Get doctors based on clinic type
    if (this.clinicType === 'human') {
      console.log('Fetching human doctors...');
      this.doctorService.getHumanDoctors().subscribe({
        next: (response) => {
          console.log('Raw human doctors response:', response);
          console.log('Human doctors data:', response.data);
          this.doctors = response.data.filter((doctor: any) => {
            console.log('Checking doctor:', {
              name: doctor.name,
              clinic_id: doctor.clinic_id,
              target_clinic_id: this.clinicId,
              matches: doctor.clinic_id === this.clinicId
            });
            return doctor.clinic_id === this.clinicId;
          });
          console.log('Final filtered human doctors:', this.doctors);
        },
        error: (error) => {
          console.error('Error fetching human doctors:', error);
        }
      });
    } else {
      console.log('Fetching vet doctors...');
      this.doctorService.getVetDoctors().subscribe({
        next: (response) => {
          console.log('Raw vet doctors response:', response);
          console.log('Vet doctors data:', response.data);
          this.doctors = response.data.filter((doctor: any) => {
            console.log('Checking vet doctor:', {
              name: doctor.name,
              vet_id: doctor.vet_id,
              target_vet_id: this.clinicId,
              matches: doctor.vet_id === this.clinicId
            });
            return doctor.vet_id === this.clinicId;
          });
          console.log('Final filtered vet doctors:', this.doctors);
        },
        error: (error) => {
          console.error('Error fetching vet doctors:', error);
        }
      });
    }
  }

  bookAppointment(doc: any) {
    console.log('Booking appointment with:', doc.name);
    this.router.navigate(['/appointment', doc.id]);
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