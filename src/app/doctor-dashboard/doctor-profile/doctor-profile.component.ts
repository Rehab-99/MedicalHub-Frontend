import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { DoctorService } from '../../services/doctor.service';
import { ClinicService } from '../../services/clinic.service';
import { VetService } from '../../services/vet.service';
import { LoginDoctorService } from '../../services/login-doctor.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';

interface Clinic {
  id: number;
  name: string;
}

interface Doctor {
  id?: number;
  name: string;
  email: string;
  clinic_id: number;
  specialization: string;
  bio: string | null;
  clinic_address: string | null;
  role: string;
  address: string | null;
  phone: string | null;
  image: string | null;
}

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {
  doctor: Doctor | null = null;
  clinicName: string | null = null;
  baseUrl = environment.apiUrl;

  constructor(
    private doctorService: DoctorService,
    private clinicService: ClinicService,
    private vetService: VetService,
    private loginDoctorService: LoginDoctorService,
    private router: Router
  ) {}

  ngOnInit() {
    const loggedInDoctor = this.loginDoctorService.getDoctor();
    if (loggedInDoctor.id) {
      this.doctorService.getDoctorById(loggedInDoctor.id).subscribe({
        next: (response: any) => {
          this.doctor = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            clinic_id: response.data.clinic_id,
            specialization: response.data.specialization,
            bio: response.data.bio,
            clinic_address: response.data.clinic_address,
            role: response.data.role,
            address: response.data.address,
            phone: response.data.phone,
            image: response.data.image
          };
          this.fetchClinicName();
        },
        error: (err: any) => {
          console.error('Error fetching doctor:', err);
          Swal.fire('Error', 'Failed to load profile. Please try again.', 'error');
          this.router.navigate(['/doctor-dashboard']);
        }
      });
    } else {
      Swal.fire('Error', 'No doctor data found. Please log in again.', 'error');
      this.router.navigate(['/doctor-login']);
    }
  }

  fetchClinicName() {
    if (this.doctor?.clinic_id) {
      const service = this.doctor.role === 'human' ? this.clinicService.getClinics() : this.vetService.getVetClinics();
      service.subscribe({
        next: (response: { data: Clinic[] }) => {
          const clinic = response.data.find(c => c.id === this.doctor?.clinic_id);
          this.clinicName = clinic?.name || 'N/A';
        },
        error: (err: any) => {
          console.error('Error fetching clinic:', err);
          this.clinicName = 'N/A';
        }
      });
    }
  }

  getFormattedName(): string {
    if (!this.doctor?.name) return 'Doctor';
    return this.doctor.name.trim().toLowerCase().startsWith('dr') ? this.doctor.name : `Dr. ${this.doctor.name}`;
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/100';
    }
    const storageUrl = this.baseUrl.replace('/api', '');
    return `${storageUrl}/storage/${imagePath}`;
  }

  copyToClipboard(text: string | null) {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Copied!',
          text: `${text} copied to clipboard.`,
          timer: 1500,
          showConfirmButton: false
        });
      }).catch(() => {
        Swal.fire('Error', 'Failed to copy text.', 'error');
      });
    }
  }

  goBack() {
    this.router.navigate(['/doctor-dashboard']);
  }

  goToEdit() {
    this.router.navigate(['/doctor-profile/edit']);
  }
}