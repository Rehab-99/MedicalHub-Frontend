import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-add-vet-clinic',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule here
  templateUrl: './add-vet-clinic.component.html',
  styleUrls: ['./add-vet-clinic.component.css']
})
export class AddVetClinicComponent {
  vetClinic = {
    id: 0,
    name: '',
    photo: '',
    address: ''
  };

  constructor(private router: Router) {}

  // Handle form submission
  onSubmit() {
    // Add logic to save the vet clinic (e.g., send to a service or backend)
    console.log('Vet Clinic added:', this.vetClinic);
    this.router.navigate(['/dashboard/vet-clinics']); // Navigate back to the vet clinics list
  }

  // Handle cancel button
  onCancel() {
    this.router.navigate(['/dashboard/vet-clinics']); // Navigate back to the vet clinics list
  }
}