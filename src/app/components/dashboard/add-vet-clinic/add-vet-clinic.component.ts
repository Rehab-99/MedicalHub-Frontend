import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { VetService } from '../../../services/vet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-vet-clinic',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule here
  templateUrl: './add-vet-clinic.component.html',
  styleUrls: ['./add-vet-clinic.component.css']
})
export class AddVetClinicComponent implements OnInit {
  vetClinic: any = {
    name: '',
    description: '',
    image: null
  };

  constructor(
    private router: Router,
    private vetService: VetService
  ) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.vetClinic.image = file;
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = document.querySelector('.profile-image img') as HTMLImageElement;
        if (img) {
          // Create a new image to handle the preview
          const tempImg = new Image();
          tempImg.onload = () => {
            // Set the preview image source
            img.src = e.target.result;
            // Ensure the image maintains its aspect ratio
            img.style.objectFit = 'cover';
          };
          tempImg.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  getImageUrl(image: any): string {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image ? `http://127.0.0.1:8000/storage/${image}` : '';
  }

  onSubmit() {
    // Validate required fields
    if (!this.vetClinic.name || !this.vetClinic.description) {
      Swal.fire('Error', 'Name and description are required fields', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.vetClinic.name);
    formData.append('description', this.vetClinic.description);
    if (this.vetClinic.image) {
      formData.append('image', this.vetClinic.image);
    }

    this.vetService.createVetClinic(formData).subscribe(
      response => {
        Swal.fire({
          title: 'Success!',
          text: 'Vet clinic added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/dashboard/vet-clinic']);
        });
      },
      error => {
        console.error('Error creating vet clinic:', error);
        Swal.fire('Error', `Failed to add vet clinic: ${error.error?.message || error.message}`, 'error');
      }
    );
  }

  onCancel() {
    this.router.navigate(['/dashboard/vet-clinic']);
  }
}