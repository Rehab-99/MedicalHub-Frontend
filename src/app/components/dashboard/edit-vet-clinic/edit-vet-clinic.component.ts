import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-edit-vet-clinic',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule here
  templateUrl: './edit-vet-clinic.component.html',
  styleUrls: ['./edit-vet-clinic.component.css']
})
export class EditVetClinicComponent implements OnInit {
  vetClinic = {
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
    // Get the vet clinic ID from the route parameters
    const vetClinicId = +this.route.snapshot.paramMap.get('id')!;
    // Fetch the vet clinic's details (for now, we'll use a mock function)
    this.fetchVetClinicDetails(vetClinicId);
  }

  // Mock function to fetch vet clinic details (replace with actual API call)
  fetchVetClinicDetails(vetClinicId: number) {
    const mockVetClinics = [
      {
        id: 1,
        name: 'Paws & Claws Vet Clinic',
        photo: 'https://via.placeholder.com/100',
        address: '123 Pet St, City, Country'
      },
      {
        id: 2,
        name: 'Animal Care Center',
        photo: 'https://via.placeholder.com/100',
        address: '456 Dog St, Town, Country'
      },
      {
        id: 3,
        name: 'Happy Tails Veterinary',
        photo: 'https://via.placeholder.com/100',
        address: '789 Cat St, Village, Country'
      }
    ];

    const vetClinic = mockVetClinics.find(v => v.id === vetClinicId);
    if (vetClinic) {
      this.vetClinic = vetClinic;
    } else {
      console.error('Vet Clinic not found');
      this.router.navigate(['/dashboard/vet-clinic']); // Redirect if vet clinic not found
    }
  }

  // Handle form submission
  onSubmit() {
    // Add logic to update the vet clinic (e.g., send to a service or backend)
    console.log('Vet Clinic updated:', this.vetClinic);
    this.router.navigate(['/dashboard/vet-clinic']); // Navigate back to the vet clinics list
  }

  // Handle cancel button
  onCancel() {
    this.router.navigate(['/dashboard/vet-clinic']); // Navigate back to the vet clinics list
  }
}