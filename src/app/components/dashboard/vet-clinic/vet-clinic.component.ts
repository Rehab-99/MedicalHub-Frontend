import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-vet-clinic',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './vet-clinic.component.html',
  styleUrls: ['./vet-clinic.component.css']
})
export class VetClinicComponent {
  vetClinics = [
    {
      id: 1,
      name: 'Paws & Claws Vet Clinic',
      photo: 'https://via.placeholder.com/100',
      address: '123 Pet St, City, Country'
    },
    {
      id: 2,
      name: 'Animal Care Center',
      photo: 'https://via.placeholder.com/100',
      address: '456 Dog St, Town, Country'
    },
    {
      id: 3,
      name: 'Happy Tails Veterinary',
      photo: 'https://via.placeholder.com/100',
      address: '789 Cat St, Village, Country'
    }
  ];

  constructor(private router: Router) {}

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
        this.vetClinics = this.vetClinics.filter(v => v.id !== vetClinic.id); // Remove the vet clinic from the list
        Swal.fire(
          'Deleted!',
          `${vetClinic.name} has been deleted.`,
          'success'
        );
      }
    });
  }
}