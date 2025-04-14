import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://127.0.0.1:8000/api/comments';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getAllComments(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getCommentsByPostId(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?post_id=${postId}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getCommentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  createComment(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(
      catchError(error => this.handleError(error))
    );
  }

  updateComment(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data).pipe(
      catchError(error => this.handleError(error))
    );
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any) {
    console.error('CommentService Error:', error);
    this.toastr.error(error.error.message || 'Something went wrong', 'Error');
    return throwError(() => error);
  }
}