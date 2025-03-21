import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-doctors',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule], // Import CommonModule here
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent {
  doctors = [
    {
      name: 'Dr. John Doe',
      specialization: 'Cardiologist',
      rating: 4.5,
      photo: 'https://via.placeholder.com/100' // Placeholder image URL
    },
    {
      name: 'Dr. Jane Smith',
      specialization: 'Dermatologist',
      rating: 4.8,
      photo: 'https://via.placeholder.com/100' // Placeholder image URL
    },
    {
      name: 'Dr. Emily Johnson',
      specialization: 'Pediatrician',
      rating: 4.7,
      photo: 'https://via.placeholder.com/100' // Placeholder image URL
    },
    {
      name: 'Dr. Michael Brown',
      specialization: 'Orthopedic Surgeon',
      rating: 4.6,
      photo: 'https://via.placeholder.com/100' // Placeholder image URL
    }
  ];

  getStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0 ? 1 : 0;
    return new Array(fullStars + halfStar).fill(0);
  }
}