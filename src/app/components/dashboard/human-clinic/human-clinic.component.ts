import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-human-clinic',
  imports: [ CommonModule],
  templateUrl: './human-clinic.component.html',
  styleUrl: './human-clinic.component.css'
})
export class HumanClinicComponent {

  clinics = [
    {
      name: 'City Health Clinic',
      photo: 'https://via.placeholder.com/100', // Placeholder image URL
      address: '123 Main St, City, Country'
    },
    {
      name: 'Green Valley Clinic',
      photo: 'https://via.placeholder.com/100', // Placeholder image URL
      address: '456 Elm St, Town, Country'
    },
    {
      name: 'Sunrise Medical Center',
      photo: 'https://via.placeholder.com/100', // Placeholder image URL
      address: '789 Oak St, Village, Country'
    },
    {
      name: 'Golden Care Clinic',
      photo: 'https://via.placeholder.com/100', // Placeholder image URL
      address: '101 Pine St, Hamlet, Country'
    }
  ];
}
