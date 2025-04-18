import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../../services/doctor.service';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-human',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './human.component.html',
  styleUrls: ['./human.component.css']
})
export class HumanComponent implements OnInit {
  doctors: any[] = [];

  constructor(private doctorService: DoctorService ,private router:Router) {}
  trackDoctor(index: number, doc: any): number {
    return doc.id;  // Make sure `id` is unique for each doctor
  }
  bookAppointment(doc: any) {
    console.log('Booking appointment with:', doc.name);
    // Redirect to the appointment page with doctor's ID as a route parameter
    this.router.navigate(['/appointment', doc.id]);
  }
  
  
  chatWithDoctor(doc: any) {
    console.log('Starting chat with:', doc.name);
    // TODO: open chat window or navigate to chat component
  }
  
  ngOnInit(): void {
    this.doctorService.getHumanDoctors().subscribe(response => {
      this.doctors = response.data;
    });
  }
}
