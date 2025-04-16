import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

import Swal from 'sweetalert2';
import { DoctorService } from '../../../services/doctor.service';
import { ClinicService } from '../../../services/clinic.service';

interface Clinic {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
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
  password?: string;
  password_confirmation?: string;
}

interface Role {
  value: string;
  label: string;
}

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css']
})
export class AddDoctorComponent implements OnInit {
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
    image: null,
    password: '',
    password_confirmation: ''
  };
  clinics: Clinic[] = [];
  roles: Role[] = [
    { value: 'human', label: 'Human Doctor' },
    { value: 'vet', label: 'Veterinarian' }
  ];
  baseUrl = environment.apiUrl;
  selectedImagePreview: string | null = null;

  constructor(
    private doctorService: DoctorService,
    private clinicService: ClinicService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchClinics();
  }

  fetchClinics() {
    this.clinicService.getClinics().subscribe(
      (response: { data: Clinic[] }) => {
        this.clinics = response.data;
      },
      (error: any) => {
        console.error('Error fetching clinics:', error);
        Swal.fire('Error', 'Failed to fetch clinics. Please try again.', 'error');
      }
    );
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.doctor.image = file;
      
      // Create preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getImageUrl(imagePath: string | File | null | undefined): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/100';
    }
    if (imagePath instanceof File) {
      return this.selectedImagePreview || 'https://via.placeholder.com/100';
    }
    // Remove /api from the base URL for storage access
    const storageUrl = this.baseUrl.replace('/api', '');
    return `${storageUrl}/storage/${imagePath}`;
  }

  onSubmit() {
    const formData = new FormData();
    
    // Append all doctor data to FormData
    Object.entries(this.doctor).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    this.doctorService.addDoctor(formData).subscribe(
      (response: any) => {
        Swal.fire({
          title: 'Success!',
          text: 'Doctor added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/dashboard/doctors']);
        });
      },
      (error: any) => {
        console.error('Error adding doctor:', error);
        const errorMessage = error.error?.message || error.message || 'Unknown error occurred';
        Swal.fire({
          title: 'Error',
          text: `Failed to add doctor: ${errorMessage}`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  onCancel() {
    this.router.navigate(['/dashboard/doctors']);
  }
}
