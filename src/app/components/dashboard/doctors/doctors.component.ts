import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-doctors',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent {
  doctors = [
    {
      id: 1,
      name: 'Dr. John Doe',
      specialization: 'Cardiologist',
      rating: 4.5,
      photo: 'https://via.placeholder.com/100'
    },
    {
      id: 2,
      name: 'Dr. Jane Smith',
      specialization: 'Dermatologist',
      rating: 4.8,
      photo: 'https://via.placeholder.com/100'
    },
    {
      id: 3,
      name: 'Dr. Emily Johnson',
      specialization: 'Pediatrician',
      rating: 4.7,
      photo: 'https://via.placeholder.com/100'
    }
  ];

  constructor(private router: Router) {}

  // Navigate to the "Add Doctor" page
  navigateToAddDoctor() {
    this.router.navigate(['/dashboard/add-doctor']);
  }

  // Edit a doctor
  editDoctor(doctor: any) {
    this.router.navigate(['/edit-doctor', doctor.id]); // Pass the doctor ID to the edit page
  }

  // Delete a doctor
  deleteDoctor(doctor: any) {
    this.doctors = this.doctors.filter(d => d.id !== doctor.id); // Remove the doctor from the list
    console.log('Doctor deleted:', doctor.name);
  }

  // Get stars for rating
  getStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0 ? 1 : 0;
    return new Array(fullStars + halfStar).fill(0);
  }
}