import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';
import { DoctorService } from '../../../services/doctor.service';

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css']
})
export class AddDoctorComponent {
  doctor = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    clinic_id: null,
    specialization: '',
    bio: '',
    clinic_address: '',
    role: 'human',
    address: '',
    phone: '',
    image: ''
  };

  constructor(private doctorService: DoctorService, private router: Router) {}

  onSubmit() {
    this.doctorService.addDoctor(this.doctor).subscribe(
      (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Doctor added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/dashboard/doctors']);
        });
      },
      (error) => {
        console.error('Error adding doctor:', error);
        Swal.fire('Error', 'Failed to add doctor. Please try again.', 'error');
      }
    );
  }

  onCancel() {
    this.router.navigate(['/dashboard/doctors']);
  }
}
