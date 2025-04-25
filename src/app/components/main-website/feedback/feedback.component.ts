// src/app/components/feedback/feedback.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { FeedbackService, Feedback } from '../../../services/feedback.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';


@Component({
  selector: 'app-feedback',
  imports:[CommonModule ,ReactiveFormsModule,FormsModule,HeaderComponent,FooterComponent],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  currentUserId!: number;
  doctors: any[] = [];

  feedbackData: Partial<Feedback> = {
    type: 'website',
    rating: 5,
    comment: ''
  };

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
      }
    });
    this.fetchDoctors();
  }
  fetchDoctors() {
    this.http.get(`${environment.apiUrl}/doctors`).subscribe((res: any) => {
      this.doctors = Array.isArray(res) ? res : res.data;
    });
  }
  submitFeedback(form: NgForm) {
    if (form.valid && this.currentUserId) {
      const payload: Feedback = {
        ...this.feedbackData,
        user_id: this.currentUserId
      } as Feedback;

      this.feedbackService.submitFeedback(payload).subscribe({
        next: (res) => {
          Swal.fire('Thank you!', res.message, 'success');
          form.resetForm({ type: 'website', rating: 5 });
        },
        error: (err) => {
          Swal.fire('Error', err.error.message || 'Submission failed', 'error');
        }
      });
    }
  }
}
