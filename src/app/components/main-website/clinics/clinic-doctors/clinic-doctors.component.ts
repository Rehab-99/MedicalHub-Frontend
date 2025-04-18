import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../../services/doctor.service';
import { ClinicService } from '../../../../services/clinic.service';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterModule } from '@angular/router';

interface ClinicResponse {
  data: {
    id: number;
    name: string;
    description: string;
    image?: string;
    doctors?: any[];
  };
}

@Component({
  selector: 'app-clinic-doctors',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './clinic-doctors.component.html',
  styleUrls: ['./clinic-doctors.component.css']
})
export class ClinicDoctorsComponent implements OnInit {
  doctors: any[] = [];
  clinicId: number = 0;
  clinicName: string = '';

  constructor(
    private route: ActivatedRoute,
    private clinicService: ClinicService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.clinicId = +params['id'];
      this.loadClinicAndDoctors();
    });
  }

  loadClinicAndDoctors() {
    this.clinicService.getClinic(this.clinicId).subscribe((response: ClinicResponse) => {
      this.clinicName = response.data.name;
      this.doctors = response.data.doctors || [];
    });
  }

  bookAppointment(doc: any) {
    console.log('Booking appointment with:', doc.name);
    // TODO: Implement appointment booking
  }

  chatWithDoctor(doc: any) {
    console.log('Starting chat with:', doc.name);
    // TODO: Implement chat functionality
  }
} 