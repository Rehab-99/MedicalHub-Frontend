import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Correct import for Angular Router
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-human-clinic',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './human-clinic.component.html',
  styleUrls: ['./human-clinic.component.css'] // Use styleUrls instead of styleUrl
})
export class HumanClinicComponent {
  clinics = [
    {
      id: 1, // Add an ID for each clinic
      name: 'City Health Clinic',
      photo: 'https://via.placeholder.com/100', // Placeholder image URL
      address: '123 Main St, City, Country'
    },
    {
      id: 2, // Add an ID for each clinic
      name: 'Green Valley Clinic',
      photo: 'https://via.placeholder.com/100', // Placeholder image URL
      address: '456 Elm St, Town, Country'
    },
    {
      id: 3, // Add an ID for each clinic
      name: 'Sunrise Medical Center',
      photo: 'https://via.placeholder.com/100', // Placeholder image URL
      address: '789 Oak St, Village, Country'
    },
    {
      id: 4, // Add an ID for each clinic
      name: 'Golden Care Clinic',
      photo: 'https://via.placeholder.com/100', // Placeholder image URL
      address: '101 Pine St, Hamlet, Country'
    }
  ];

  constructor(private router: Router) {}

  // Navigate to the "Add Clinic" page
  navigateToAddClinic() {
    this.router.navigate(['/dashboard/add-clinic']);
  }

  // Edit a clinic
  editClinic(clinic: any) {
    this.router.navigate(['/dashboard/edit-clinic', clinic.id]); // Pass the clinic ID to the edit page
  }

  // Delete a clinic
  deleteClinic(clinic: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${clinic.name}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clinics = this.clinics.filter(c => c.id !== clinic.id); // Remove the clinic from the list
        Swal.fire(
          'Deleted!',
          `${clinic.name} has been deleted.`,
          'success'
        );
      }
    });
  }
}