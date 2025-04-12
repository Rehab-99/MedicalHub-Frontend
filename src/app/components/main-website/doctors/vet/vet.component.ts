import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../../../services/doctor.service';

@Component({
  selector: 'app-vet',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './vet.component.html',
  styleUrls: ['./vet.component.css']
})
export class VetComponent implements OnInit {
  doctors: any[] = [];  // Changed from vets to doctors

  constructor(private doctorService: DoctorService) {}  // Changed from vetService to doctorService

  trackDoctor(index: number, doctor: any): number {  // Changed from trackVet to trackDoctor
    return doctor.id;
  }

  bookAppointment(doc: any) {
    console.log('Booking appointment with:', doc.name);
    // TODO: route to appointment booking page or open modal
  }
  
  chatWithDoctor(doc: any) {
    console.log('Starting chat with:', doc.name);
    // TODO: open chat window or navigate to chat component
  }

  ngOnInit(): void {
    this.doctorService.getVetDoctors().subscribe(response => {  // Changed from vetService to doctorService
      this.doctors = response.data;
    });
  }
}
