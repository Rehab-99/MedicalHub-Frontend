import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { ClinicService } from '../../../services/clinic.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-clinic',
  standalone: true, // ✅ Make it a standalone component
  imports: [CommonModule, FormsModule], // ✅ Add FormsModule here
  templateUrl: './edit-clinic.component.html',
  styleUrls: ['./edit-clinic.component.css']
})
export class EditClinicComponent implements OnInit {
  clinic = { id: 0, name: '', description: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clinicService: ClinicService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const clinicId = Number(params.get('id'));
      if (!clinicId) return;
      this.fetchClinicDetails(clinicId);
    });
  }

  fetchClinicDetails(clinicId: number) {
    this.clinicService.getClinicById(clinicId).subscribe(
      (response) => {
        console.log('API Response:', response); // Debugging
        this.clinic = response.data ? response.data : response; // Adjust based on API response
      },
      (error) => {
        console.error('Error fetching clinic details:', error);
      }
    );
  }
  

  

  onSubmit() {
    this.clinicService.updateClinic(this.clinic.id, this.clinic).subscribe(
      () => {
        Swal.fire({
          title: 'Updated!',
          text: 'Clinic updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/dashboard/human-clinic']);
        });
      },
      (error) => {
        console.error('Error updating clinic:', error);
        Swal.fire('Error', 'Failed to update clinic. Please try again.', 'error');
      }
    );
  }
  

  onCancel() {
    this.router.navigate(['/dashboard/human-clinic']);
  }
}
