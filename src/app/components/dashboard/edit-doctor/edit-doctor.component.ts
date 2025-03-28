import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { DoctorService } from '../../../services/doctor.service';
import { ClinicService } from '../../../services/clinic.service'; // ✅ Import ClinicService

@Component({
  selector: 'app-edit-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.css']
})
export class EditDoctorComponent implements OnInit {
  @ViewChild('doctorForm') doctorForm!: NgForm;
  doctorId: number | null = null;
  doctor: any = {
    name: '',
    email: '',
    clinic_id: null,
    specialization: '',
    bio: '',
    address: '',
    phone: '',
    role: '',
    image: ''
  };
  clinics: any[] = []; // ✅ Holds clinics data

  constructor(
    private doctorService: DoctorService,
    private clinicService: ClinicService, // ✅ Use existing ClinicService
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.doctorId = +id;
        this.getDoctor();
      }
    });

    this.getClinics(); // ✅ Fetch clinics on init
  }

  getDoctor() {
    if (this.doctorId) {
      this.doctorService.getDoctorById(this.doctorId).subscribe(
        (response) => {
          this.doctor = response.data;
        },
        (error) => {
          console.error('Error fetching doctor:', error);
          Swal.fire('Error', 'Failed to load doctor details.', 'error');
        }
      );
    }
  }

  getClinics() {
    this.clinicService.getClinics().subscribe(
      (response) => {
        this.clinics = response.data; // ✅ Assign fetched clinics
      },
      (error) => {
        console.error('Error fetching clinics:', error);
        Swal.fire('Error', 'Failed to load clinic list.', 'error');
      }
    );
  }

  onSubmit() {
    if (!this.doctorForm.valid) {
      Swal.fire('Error', 'Please fill all required fields.', 'error');
      return;
    }
  
    if (this.doctorId) {
      this.doctorService.updateDoctor(this.doctorId, this.doctor).subscribe(
        () => {
          Swal.fire({
            title: 'Updated!',
            text: 'Doctor updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/dashboard/doctors']);
          });
        },
        (error) => {
          console.error('Error updating doctor:', error);
          Swal.fire('Error', 'Failed to update doctor. Please try again.', 'error');
        }
      );
    }
  }
  

  onCancel() {
    this.router.navigate(['/dashboard/doctors']);
  }
}
