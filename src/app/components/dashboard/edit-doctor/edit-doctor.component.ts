import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-edit-doctor',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule here
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.css']
})
export class EditDoctorComponent implements OnInit {
  doctor = {
    id: 0,
    name: '',
    specialization: '',
    rating: 0,
    photo: ''
  };

  constructor(
    private route: ActivatedRoute, // To access route parameters
    private router: Router // For navigation
  ) {}

  ngOnInit() {
    // Get the doctor ID from the route parameters
    const doctorId = +this.route.snapshot.paramMap.get('id')!;
    // Fetch the doctor's details (for now, we'll use a mock function)
    this.fetchDoctorDetails(doctorId);
  }

  // Mock function to fetch doctor details (replace with actual API call)
  fetchDoctorDetails(doctorId: number) {
    const mockDoctors = [
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

    const doctor = mockDoctors.find(d => d.id === doctorId);
    if (doctor) {
      this.doctor = doctor;
    } else {
      console.error('Doctor not found');
      this.router.navigate(['/dashboard/doctors']); // Redirect if doctor not found
    }
  }

  // Handle form submission
  onSubmit() {
    // Add logic to update the doctor (e.g., send to a service or backend)
    console.log('Doctor updated:', this.doctor);
    this.router.navigate(['/dashboard/doctors']); // Navigate back to the doctors list
  }

  // Handle cancel button
  onCancel() {
    this.router.navigate(['/dashboard/doctors']); // Navigate back to the doctors list
  }
}