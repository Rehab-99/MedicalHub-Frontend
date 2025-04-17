import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ServiceService, Service } from '../../../services/service.service';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editservice.component.html',
  styleUrls: ['./editservice.component.css']
})
export class EditServiceComponent implements OnInit {
  service: Service | null = null;
  baseUrl = 'http://127.0.0.1:8000'; // Adjust if you use an environment file
  selectedImagePreview: string | null = null;

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.fetchService(serviceId);
    }
  }

  fetchService(id: string) {
    this.serviceService.getServiceById(+id).subscribe(
      (response: Service) => {
        this.service = response;
        console.log('Service data:', this.service); // Debug log
      },
      (error: any) => {
        console.error('Error fetching service:', error);
        Swal.fire('Error', 'Failed to fetch service details. Please try again.', 'error');
      }
    );
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 && this.service) {
      const file = input.files[0];
      this.service.image = file;

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
    // Adjust for Laravel storage path
    return `${this.baseUrl}/storage/${imagePath.replace('storage/', '')}`;
  }

  onSubmit() {
    if (!this.service) return;

    const formData = new FormData();

    // Append all service data to FormData
    Object.entries(this.service).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        key !== 'created_at' &&
        key !== 'updated_at'
      ) {
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
    for (let pair of (formData as any).entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    this.serviceService.updateService(this.service.id, formData).subscribe(
      (response: any) => {
        console.log('Update response:', response); // Debug log
        Swal.fire({
          title: 'Success!',
          text: 'Service updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/dashboard/services']);
        });
      },
      (error: any) => {
        console.error('Error updating service:', error);
        const errorMessage = error.error?.message || error.message || 'Unknown error occurred';
        Swal.fire({
          title: 'Error',
          text: `Failed to update service: ${errorMessage}`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  onCancel() {
    this.router.navigate(['/dashboard/services']);
  }
}