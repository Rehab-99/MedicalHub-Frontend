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
  vets: any[] = [];  // Change to vets array

  constructor(private vetService: DoctorService) {}  // Change to VetService
  trackVet(index: number, vet: any): number {  // Change to trackVet
    return vet.id;  // Make sure `id` is unique for each vet
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
    this.vetService.getVetDoctors().subscribe(response => {  // Change to VetService call
      this.vets = response.data;
    });
  }
}
