import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ClinicService } from '../../../services/clinic.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

interface Clinic {
  id: number;
  name: string;
  description: string;
  image?: string;
}

@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.component.html',
  styleUrls: ['./clinics.component.css'],
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
})
export class ClinicsComponent implements OnInit {
  clinics: Clinic[] = [];

  constructor(private clinicService: ClinicService, private router: Router) {}

  ngOnInit(): void {
    this.loadClinics();
  }

  // Fetch clinics from Laravel API
  loadClinics() {
    this.clinicService.getClinics().subscribe(
      (response) => {
        console.log('Full API Response:', response);
        if (response && response.data) {
          this.clinics = response.data.map((clinic: Clinic) => {
            // Log each clinic's data
            console.log('Clinic data:', clinic);
            
            // Ensure image URL is properly formatted
            if (clinic.image) {
              // If the image URL is relative, prepend the backend URL
              if (!clinic.image.startsWith('http')) {
                clinic.image = `http://127.0.0.1:8000/storage/${clinic.image}`;
              }
            }
            return clinic;
          });
        }
      },
      (error) => {
        console.error('Error fetching clinics:', error);
      }
    );
  }

  goToClinicDoctors(clinicId: number) {
    this.router.navigate(['/clinics', clinicId, 'doctors']);
  }
}
