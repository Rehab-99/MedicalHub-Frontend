import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-add-clinic',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule here
  templateUrl: './add-clinic.component.html',
  styleUrls: ['./add-clinic.component.css']
})
export class AddClinicComponent {
  clinic = {
    id: 0,
    name: '',
    photo: '',
    address: ''
  };

  constructor(private router: Router) {}

  // Handle form submission
  onSubmit() {
    // Add logic to save the clinic (e.g., send to a service or backend)
    console.log('Clinic added:', this.clinic);
    this.router.navigate(['/dashboard/human-clinic']); // Navigate back to the clinics list
  }

  // Handle cancel button
  onCancel() {
    this.router.navigate(['/dashboard/human-clinic']); // Navigate back to the clinics list
  }
}