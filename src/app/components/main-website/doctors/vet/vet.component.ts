import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../../../services/doctor.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-vet',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './vet.component.html',
  styleUrls: ['./vet.component.css']
})
export class VetComponent implements OnInit {
  doctors: any[] = [];  // Changed from vets to doctors
  baseUrl = environment.apiUrl;

  constructor(private doctorService: DoctorService, private router:Router) {}  // Changed from vetService to doctorService

  trackDoctor(index: number, doctor: any): number {  // Changed from trackVet to trackDoctor
    return doctor.id;
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/100';
    }
    // Check if the imagePath is already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // If it's a relative path, construct the full URL
    // Remove /api from the base URL for storage access
    const storageUrl = this.baseUrl.replace('/api', '');
    return `${storageUrl}/storage/${imagePath}`;
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
    this.doctorService.getVetDoctors().subscribe(response => {  // Changed from vetService to doctorService
      this.doctors = response.data;
    });
  }


  images: string[] = [
    'assets/images/pharmacy/vet/slide5.jpg',
    'assets/images/pharmacy/vet/slide6.jpg'
  ];
  
  currentSlide = 0;

  
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }
  
  goToSlide(index: number) {
    this.currentSlide = index;
  }
  
  scrollToCategories() {
    const el = document.querySelector('.main-content');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
