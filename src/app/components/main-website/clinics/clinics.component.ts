import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ClinicService } from '../../../services/clinic.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.component.html',
  styleUrls: ['./clinics.component.css'],
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
})
export class ClinicsComponent implements OnInit {
  clinics: any[] = [];

  constructor(private clinicService: ClinicService, private router: Router) {}

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

  

  goToClinicDoctors(clinicId: number) {
    this.router.navigate(['/clinics', clinicId, 'doctors']);
  }
}
