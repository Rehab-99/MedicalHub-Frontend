import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-vet-clinics',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './vet-clinic.component.html',
  styleUrls: ['./vet-clinic.component.css']
})
export class VetClinicComponent {
  vetClinics = [
    {
      name: 'Paws & Claws Vet Clinic',
      photo: 'https://via.placeholder.com/100', // Placeholder image URL
      address: '123 Pet St, City, Country'
    },
    {
      name: 'Animal Care Center',
      photo: 'https://via.placeholder.com/100', // Placeholder image URL
      address: '456 Dog St, Town, Country'
    },
    {
      name: 'Happy Tails Veterinary',
      photo: 'https://via.placeholder.com/100', // Placeholder image URL
      address: '789 Cat St, Village, Country'
    },
    {
      name: 'Wildlife Vet Clinic',
      photo: 'https://via.placeholder.com/100', // Placeholder image URL
      address: '101 Bird St, Hamlet, Country'
    }
  ];
}