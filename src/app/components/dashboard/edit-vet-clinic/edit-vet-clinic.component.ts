import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { VetService } from '../../../services/vet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-vet-clinic',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule here
  templateUrl: './edit-vet-clinic.component.html',
  styleUrls: ['./edit-vet-clinic.component.css']
})
export class EditVetClinicComponent implements OnInit {
  vetClinic: any = {
    name: '',
    description: '',
    image: null
  };

  constructor(
    private route: ActivatedRoute, // To access route parameters
    private router: Router, // For navigation
    private vetService: VetService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vetService.getVetClinic(+id).subscribe(
        response => {
          if (response && response.data) {
            this.vetClinic = response.data;
            console.log('Loaded vet clinic:', this.vetClinic); // Debug log
          } else {
            console.error('Invalid response format:', response);
            Swal.fire('Error', 'Invalid response format from server', 'error');
          }
        },
        error => {
          console.error('Error fetching vet clinic:', error);
          let errorMessage = 'Failed to fetch vet clinic details';
          if (error.status === 404) {
            errorMessage = 'Vet clinic not found';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          Swal.fire('Error', errorMessage, 'error').then(() => {
            this.router.navigate(['/dashboard/vet-clinic']);
          });
        }
      );
    }
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
    console.log('Form submitted with data:', this.vetClinic); // Debug log

    // Validate required fields
    if (!this.vetClinic.name || !this.vetClinic.description) {
      Swal.fire('Error', 'Name and description are required fields', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.vetClinic.name.trim());
    formData.append('description', this.vetClinic.description.trim());
    
    // Only append image if it's a new file
    if (this.vetClinic.image instanceof File) {
      formData.append('image', this.vetClinic.image);
    }

    // Debug: Log FormData contents
    console.log('FormData contents:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vetService.updateVetClinic(+id, formData).subscribe(
        response => {
          console.log('Update response:', response); // Debug log
          Swal.fire({
            title: 'Success!',
            text: 'Vet clinic updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/dashboard/vet-clinic']);
          });
        },
        error => {
          console.error('Error updating vet clinic:', error);
          let errorMessage = 'Failed to update vet clinic';
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
          Swal.fire('Error', errorMessage, 'error');
        }
      );
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/vet-clinic']);
  }
}