import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { VetService } from '../../../services/vet.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-vet-clinic',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './vet-clinic.component.html',
  styleUrls: ['./vet-clinic.component.css']
})
export class VetClinicComponent implements OnInit {
  vetClinics: any[] = [];

  constructor(
    private router: Router,
    private vetService: VetService
  ) {}

  ngOnInit(): void {
    this.loadVetClinics();
  }

  loadVetClinics() {
    this.vetService.getVetClinics().subscribe(
      (response) => {
        this.vetClinics = response.data;
      },
      (error) => {
        console.error('Error fetching vet clinics:', error);
        Swal.fire('Error', 'Failed to fetch vet clinics', 'error');
      }
    );
  }

  // Navigate to the "Add Vet Clinic" page
  navigateToAddVetClinic() {
    this.router.navigate(['/dashboard/add-vet-clinic']);
  }

  // Edit a vet clinic
  editVetClinic(vetClinic: any) {
    this.router.navigate(['/dashboard/edit-vet-clinic', vetClinic.id]); // Pass the vet clinic ID to the edit page
  }

  // Delete a vet clinic with SweetAlert confirmation
  deleteVetClinic(vetClinic: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${vetClinic.name}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Add deleting class for animation
        const cardElement = document.querySelector(`[data-vet-id="${vetClinic.id}"]`);
        if (cardElement) {
          cardElement.classList.add('deleting');
        }

        // Wait for animation to complete before making the API call
        setTimeout(() => {
          this.vetService.deleteVetClinic(vetClinic.id).subscribe(
            (response) => {
              this.vetClinics = this.vetClinics.filter(v => v.id !== vetClinic.id);
              Swal.fire(
                'Deleted!',
                `${vetClinic.name} has been deleted.`,
                'success'
              );
            },
            (error) => {
              console.error('Error deleting vet clinic:', error);
              Swal.fire('Error', 'Failed to delete vet clinic', 'error');
            }
          );
        }, 800); // Match this with animation duration
      }
    });
  }

  getImageUrl(image: string): string {
    return image ? `http://127.0.0.1:8000/storage/${image}` : '';
  }
}