import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  id: number;
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
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  clinic: Clinic;
}

interface Role {
  value: string;
  label: string;
}

@Component({
  selector: 'app-edit-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.css']
})
export class EditDoctorComponent implements OnInit {
  doctor: Doctor | null = null;
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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fetchClinics();
    const doctorId = this.route.snapshot.paramMap.get('id');
    if (doctorId) {
      this.fetchDoctor(doctorId);
    }
  }

  fetchDoctor(id: string) {
    this.doctorService.getDoctorById(+id).subscribe(
      (response: { data: Doctor }) => {
        this.doctor = response.data;
        console.log('Doctor data:', this.doctor); // Debug log
      },
      (error: any) => {
        console.error('Error fetching doctor:', error);
        Swal.fire('Error', 'Failed to fetch doctor details. Please try again.', 'error');
      }
    );
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
    if (input.files && input.files.length > 0 && this.doctor) {
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
    if (!this.doctor) return;

    const formData = new FormData();
    
    // Append all doctor data to FormData
    Object.entries(this.doctor).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== 'clinic' && key !== 'created_at' && key !== 'updated_at' && key !== 'deleted_at') {
        // Only append image if it's a File (new image selected)
        if (key === 'image') {
          if (value instanceof File) {
            formData.append(key, value);
          }
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Log the form data for debugging
    console.log('Form Data being sent:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    this.doctorService.updateDoctor(this.doctor.id, formData).subscribe(
      (response: any) => {
        console.log('Update response:', response); // Debug log
        Swal.fire({
          title: 'Success!',
          text: 'Doctor updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/dashboard/doctors']);
        });
      },
      (error: any) => {
        console.error('Error updating doctor:', error);
        // Show more detailed error message
        const errorMessage = error.error?.message || error.message || 'Unknown error occurred';
        Swal.fire({
          title: 'Error',
          text: `Failed to update doctor: ${errorMessage}`,
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
