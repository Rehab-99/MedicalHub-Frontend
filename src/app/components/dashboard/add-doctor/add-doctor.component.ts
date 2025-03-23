import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-add-doctor',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule here
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css']
})
export class AddDoctorComponent {
  doctor = {
    id: 0,
    name: '',
    specialization: '',
    rating: 0,
    photo: ''
  };

  constructor(private router: Router) {}

  // Handle form submission
  onSubmit() {
    // Add logic to save the doctor (e.g., send to a service or backend)
    console.log('Doctor added:', this.doctor);
    this.router.navigate(['/dashboard/doctors']); // Navigate back to the doctors list
  }

  // Handle cancel button
  onCancel() {
    this.router.navigate(['/dashboard/doctors']); // Navigate back to the doctors list
  }
}