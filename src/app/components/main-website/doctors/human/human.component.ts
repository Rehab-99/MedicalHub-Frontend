import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../../services/doctor.service';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-human',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './human.component.html',
  styleUrls: ['./human.component.css']
})
export class HumanComponent implements OnInit {
  doctors: any[] = [];
  baseUrl = environment.apiUrl;

  constructor(private doctorService: DoctorService, private router: Router) {}

  trackDoctor(index: number, doc: any): number {
    return doc.id;
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
    this.router.navigate(['/appointment', doc.id]);
  }
  
  chatWithDoctor(doc: any) {
    console.log('Starting chat with:', doc.name);
    // TODO: open chat window or navigate to chat component
  }
  
  ngOnInit(): void {
    this.doctorService.getHumanDoctors().subscribe(response => {
      this.doctors = response.data;
      // Debug image URLs
      this.doctors.forEach(doctor => {
        console.log('Doctor:', doctor.name, 'Image Path:', doctor.image);
        console.log('Constructed Image URL:', this.getImageUrl(doctor.image));
      });
    });
  }
}
