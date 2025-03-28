import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicService } from '../../../services/clinic.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-clinic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-clinic.component.html',
  styleUrls: ['./add-clinic.component.css']
})
export class AddClinicComponent {
  clinic = {
    name: '',
    description: ''
  };

  constructor(private router: Router, private clinicService: ClinicService) {}

  // Handle form submission
 

onSubmit() {
  this.clinicService.addClinic(this.clinic).subscribe(
    (response) => {
      Swal.fire({
        title: 'Success!',
        text: 'Clinic added successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/dashboard/human-clinic']);
      });
    },
    (error) => {
      console.error('Error adding clinic:', error);
      Swal.fire('Error', 'Failed to add clinic. Please try again.', 'error');
    }
  );
}


  // Handle cancel button
  onCancel() {
    this.router.navigate(['/dashboard/human-clinic']);
  }
}
