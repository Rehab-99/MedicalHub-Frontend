import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-edit-clinic',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule here
  templateUrl: './edit-clinic.component.html',
  styleUrls: ['./edit-clinic.component.css']
})
export class EditClinicComponent implements OnInit {
  clinic = {
    id: 0,
    name: '',
    photo: '',
    address: ''
  };

  constructor(
    private route: ActivatedRoute, // To access route parameters
    private router: Router // For navigation
  ) {}

  ngOnInit() {
    // Get the clinic ID from the route parameters
    const clinicId = +this.route.snapshot.paramMap.get('id')!;
    // Fetch the clinic's details (for now, we'll use a mock function)
    this.fetchClinicDetails(clinicId);
  }

  // Mock function to fetch clinic details (replace with actual API call)
  fetchClinicDetails(clinicId: number) {
    const mockClinics = [
      {
        id: 1,
        name: 'City Health Clinic',
        photo: 'https://via.placeholder.com/100',
        address: '123 Main St, City, Country'
      },
      {
        id: 2,
        name: 'Green Valley Clinic',
        photo: 'https://via.placeholder.com/100',
        address: '456 Elm St, Town, Country'
      },
      {
        id: 3,
        name: 'Sunrise Medical Center',
        photo: 'https://via.placeholder.com/100',
        address: '789 Oak St, Village, Country'
      }
    ];

    const clinic = mockClinics.find(c => c.id === clinicId);
    if (clinic) {
      this.clinic = clinic;
    } else {
      console.error('Clinic not found');
      this.router.navigate(['/dashboard/clinics']); // Redirect if clinic not found
    }
  }

  // Handle form submission
  onSubmit() {
    // Add logic to update the clinic (e.g., send to a service or backend)
    console.log('Clinic updated:', this.clinic);
    this.router.navigate(['/dashboard/human-clinic']); // Navigate back to the clinics list
  }

  // Handle cancel button
  onCancel() {
    this.router.navigate(['/dashboard/human-clinic']); // Navigate back to the clinics list
  }
}