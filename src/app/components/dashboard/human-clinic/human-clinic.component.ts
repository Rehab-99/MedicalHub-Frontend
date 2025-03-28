import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ClinicService } from '../../../services/clinic.service';

@Component({
  selector: 'app-human-clinic',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './human-clinic.component.html',
  styleUrls: ['./human-clinic.component.css']
})
export class HumanClinicComponent implements OnInit {
  clinics: any[] = []; // Empty array initially

  constructor(private router: Router, private clinicService: ClinicService) {}

  ngOnInit(): void {
    this.loadClinics();
  }

  // Fetch clinics from Laravel API
  loadClinics() {
    this.clinicService.getClinics().subscribe(
      (response) => {
        this.clinics = response.data; // Assuming API returns { data: [...] }
      },
      (error) => {
        console.error('Error fetching clinics:', error);
      }
    );
  }

  // Navigate to add clinic page
  navigateToAddClinic() {
    this.router.navigate(['/dashboard/add-clinic']);
  }

  // Navigate to edit page with clinic ID
  editClinic(clinic: any) {
    this.router.navigate(['/dashboard/edit-clinic', clinic.id]);
  }

  // Delete clinic
  deleteClinic(clinic: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${clinic.name}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clinicService.deleteClinic(clinic.id).subscribe(
          () => {
            this.clinics = this.clinics.filter(c => c.id !== clinic.id);
            Swal.fire('Deleted!', `${clinic.name} has been deleted.`, 'success');
          },
          (error) => {
            console.error('Error deleting clinic:', error);
          }
        );
      }
    });
  }
}
