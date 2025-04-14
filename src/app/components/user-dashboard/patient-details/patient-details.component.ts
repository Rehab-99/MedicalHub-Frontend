import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.scss'
})
export class PatientDetailsComponent implements OnInit {
  user: any = null;
  registrationDate: string = '';
  userAge: number = 0;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      
      // Calculate age from date of birth if available
      if (user && user.date_of_birth) {
        const dobDate = new Date(user.date_of_birth);
        const ageDiffMs = Date.now() - dobDate.getTime();
        const ageDate = new Date(ageDiffMs);
        this.userAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      }
      
      // Format registration date
      if (user && user.created_at) {
        const date = new Date(user.created_at);
        this.registrationDate = date.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
    });
  }
} 