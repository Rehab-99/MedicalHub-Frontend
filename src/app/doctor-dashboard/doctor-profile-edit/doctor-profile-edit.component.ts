import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { DoctorService } from '../../services/doctor.service';
import { ClinicService } from '../../services/clinic.service';
import { VetService } from '../../services/vet.service';
import { LoginDoctorService } from '../../services/login-doctor.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

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
  image: string | File | null;
}

@Component({
  selector: 'app-doctor-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule,SidebarComponent],
  templateUrl: './doctor-profile-edit.component.html',
  styleUrls: ['./doctor-profile-edit.component.css']
})
export class DoctorProfileEditComponent implements OnInit {
  doctor: Doctor = {
    name: '',
    email: '',
    clinic_id: 0,
    specialization: '',
    bio: null,
    clinic_address: null,
    role: '',
    address: null,
    phone: null,
    image: null
  };
  clinicName: string | null = null;
  baseUrl = environment.apiUrl;
  selectedImagePreview: string | null = null;
  isLoading = false;
  imageRemoved = false;

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
          this.router.navigate(['/doctor-profile']);
        }
      });
    } else {
      Swal.fire('Error', 'No doctor data found. Please log in again.', 'error');
      this.router.navigate(['/doctor-login']);
    }
  }

  fetchClinicName() {
    if (this.doctor.clinic_id) {
      const service = this.doctor.role === 'human' ? this.clinicService.getClinics() : this.vetService.getVetClinics();
      service.subscribe({
        next: (response: { data: Clinic[] }) => {
          const clinic = response.data.find(c => c.id === this.doctor.clinic_id);
          this.clinicName = clinic?.name || 'N/A';
        },
        error: (err: any) => {
          console.error('Error fetching clinic:', err);
          this.clinicName = 'N/A';
        }
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.doctor.image = file;
      this.imageRemoved = false;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.doctor.image = null;
    this.imageRemoved = true;
    this.selectedImagePreview = null;
    Swal.fire({
      title: 'Image Removed',
      text: 'The profile image has been removed. Save changes to apply.',
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }

  getImageUrl(imagePath: string | File | null): string {
    if (!imagePath || this.imageRemoved) {
      return 'https://via.placeholder.com/100';
    }
    if (imagePath instanceof File) {
      return this.selectedImagePreview || 'https://via.placeholder.com/100';
    }
    const storageUrl = this.baseUrl.replace('/api', '');
    return `${storageUrl}/storage/${imagePath}`;
  }

  onSubmit() {
    this.isLoading = true;
    const formData = new FormData();
    Object.entries(this.doctor).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== 'id' && key !== 'role') {
        if (key === 'image' && !(value instanceof File)) {
          return; // ما نبعتش image لو مش ملف جديد
        }
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (this.imageRemoved) {
      formData.append('remove_image', '1'); // Flag لإزالة الصورة
    }

    console.log('FormData:', Array.from(formData.entries()));
    this.doctorService.updateDoctor(this.doctor.id!, formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/doctor-profile']);
        });
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error updating doctor:', err);
        const errorMessage = err.error?.errors
          ? Object.values(err.error.errors).flat().join(', ')
          : err.error?.message || err.message || 'Unknown error occurred';
        Swal.fire({
          title: 'Error',
          text: `Failed to update profile: ${errorMessage}`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/doctor-profile']);
  }
}