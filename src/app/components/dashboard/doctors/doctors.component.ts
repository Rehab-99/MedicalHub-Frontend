import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
import { DoctorService } from '../../../services/doctor.service';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  doctors: any[] = [];

  constructor(private router: Router, private doctorService: DoctorService) {}

  ngOnInit() {
    this.fetchDoctors();
  }

  fetchDoctors() {
    this.doctorService.getDoctors().subscribe(
      (response) => {
        console.log('Fetched Doctors:', response); // Debugging
        this.doctors = response.data || response; // Adjust if API returns { data: [...] }
      },
      (error) => {
        console.error('Error fetching doctors:', error);
        Swal.fire('Error', 'Failed to fetch doctors. Please try again.', 'error');
      }
    );
  }
  

  navigateToAddDoctor() {
    this.router.navigate(['/dashboard/add-doctor']);
  }

  editDoctor(doctor: any) {
    this.router.navigate(['/dashboard/edit-doctor', doctor.id]);
  }

  deleteDoctor(doctor: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${doctor.name}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.doctorService.deleteDoctor(doctor.id).subscribe(
          () => {
            this.doctors = this.doctors.filter(d => d.id !== doctor.id); // Remove from UI
            Swal.fire('Deleted!', `${doctor.name} has been deleted.`, 'success');
          },
          (error) => {
            console.error('Error deleting doctor:', error);
            Swal.fire('Error', 'Failed to delete doctor. Please try again.', 'error');
          }
        );
      }
    });
  }

  getStars(rating: number): number[] {
    if (!rating || rating < 0) return []; // Prevent invalid ratings
  
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0 ? 1 : 0;
    const totalStars = fullStars + halfStar;
  
    return Array.from({ length: Math.min(totalStars, 5) }); // Ensure max 5 stars
  }
  
}
