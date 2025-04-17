import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { ClinicService } from '../../../services/clinic.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-clinic',
  standalone: true, // ✅ Make it a standalone component
  imports: [CommonModule, FormsModule], // ✅ Add FormsModule here
  templateUrl: './edit-clinic.component.html',
  styleUrls: ['./edit-clinic.component.css']
})
export class EditClinicComponent implements OnInit {
  clinic: any = {
    id: null,
    name: '',
    description: '',
    image: null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clinicService: ClinicService
  ) { }

  ngOnInit(): void {
    const clinicId = Number(this.route.snapshot.paramMap.get('id'));
    if (clinicId) {
      this.clinicService.getClinic(clinicId).subscribe(
        (response: any) => {
          this.clinic = response.data;
        },
        (error: any) => {
          console.error('Error fetching clinic:', error);
          Swal.fire('Error', 'Failed to fetch clinic details', 'error');
        }
      );
    }
  }

  getImageUrl(image: string | File): string {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image ? `http://127.0.0.1:8000/storage/${image}` : '';
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

  onSubmit() {
    // Validate required fields
    if (!this.clinic.name || !this.clinic.description) {
      Swal.fire('Error', 'Name and description are required fields', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('_method', 'PUT'); // Laravel needs this for PUT requests with FormData
    formData.append('name', this.clinic.name);
    formData.append('description', this.clinic.description);
    
    // Only append image if it's a new file
    if (this.clinic.image instanceof File) {
      formData.append('image', this.clinic.image);
    }

    console.log('Sending update request for clinic ID:', this.clinic.id);
    console.log('FormData contents:', {
      name: this.clinic.name,
      description: this.clinic.description,
      hasImage: this.clinic.image instanceof File
    });

    this.clinicService.updateClinic(this.clinic.id, formData).subscribe(
      (response: any) => {
        console.log('Update response:', response);
        Swal.fire({
          title: 'Success!',
          text: 'Clinic updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/dashboard/human-clinic']);
        });
      },
      (error: any) => {
        console.error('Error updating clinic:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        Swal.fire('Error', `Failed to update clinic: ${error.error?.message || error.message}`, 'error');
      }
    );
  }

  onCancel() {
    this.router.navigate(['/dashboard/human-clinic']);
  }
}
