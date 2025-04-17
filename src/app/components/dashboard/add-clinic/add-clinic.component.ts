import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicService } from '../../../services/clinic.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-clinic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-clinic.component.html',
  styleUrls: ['./add-clinic.component.css']
})
export class AddClinicComponent implements OnInit {
  clinic: any = {
    name: '',
    description: '',
    image: null
  };

  constructor(
    private router: Router,
    private clinicService: ClinicService
  ) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.clinic.image = file;
      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = document.querySelector('.profile-image img') as HTMLImageElement;
        if (img) {
          img.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  getImageUrl(image: string | File): string {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image ? `http://127.0.0.1:8000/storage/${image}` : '';
  }

  onSubmit() {
    // Validate required fields
    if (!this.clinic.name || !this.clinic.description) {
      Swal.fire('Error', 'Name and description are required fields', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.clinic.name);
    formData.append('description', this.clinic.description);
    if (this.clinic.image) {
      formData.append('image', this.clinic.image);
    }

    this.clinicService.createClinic(formData).subscribe(
      response => {
        Swal.fire({
          title: 'Success!',
          text: 'Clinic added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/dashboard/human-clinic']);
        });
      },
      error => {
        console.error('Error creating clinic:', error);
        Swal.fire('Error', `Failed to add clinic: ${error.error?.message || error.message}`, 'error');
      }
    );
  }

  onCancel() {
    this.router.navigate(['/dashboard/human-clinic']);
  }
}
