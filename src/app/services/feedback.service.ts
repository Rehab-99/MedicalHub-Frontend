// src/app/services/feedback.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Feedback {
  user_id: number;
  doctor_id?: number;
  type: 'doctor' | 'website';
  rating: number;
  comment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = `${environment.apiUrl}/feedback`;

  constructor(private http: HttpClient) {}

  submitFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(this.apiUrl, feedback);
  }

  getAllFeedback(type?: string, doctorId?: number): Observable<any> {
    let url = this.apiUrl;
    const params = [];
    if (type) params.push(`type=${type}`);
    if (doctorId) params.push(`doctor_id=${doctorId}`);
    if (params.length) url += `?${params.join('&')}`;
    return this.http.get(url);
  }
}
