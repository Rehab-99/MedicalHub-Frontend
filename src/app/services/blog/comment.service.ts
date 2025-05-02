import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://127.0.0.1:8000/api/comments';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }

  getAllComments(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getCommentsByPostId(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?post_id=${postId}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getCommentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  createComment(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  updateComment(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getRepliesByCommentId(commentId: number): Observable<any> {
    console.log('Fetching replies from:', `${this.apiUrl}/${commentId}/replies`);
    return this.http.get(`${this.apiUrl}/${commentId}/replies`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error in getRepliesByCommentId:', error);
        return this.handleError(error);
      })
    );
  }

  private handleError(error: any) {
    console.error('CommentService Error:', error);
    const errorMessage = error.error?.message || 'Something went wrong';
    if (error.status === 401) {
      this.toastr.error('Session expired. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_id');
      window.location.href = '/login';
    } else {
      this.toastr.error(errorMessage, 'Error');
    }
    return throwError(() => error);
  }
}