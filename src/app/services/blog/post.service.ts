import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  getAllPosts(role?: 'human' | 'vet'): Observable<any> {
    const url = role ? `${this.apiUrl}?role=${role}` : this.apiUrl;
    return this.http.get(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getPostById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createPost(postData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, postData, { headers: this.getHeaders() }).pipe(
      tap(() => console.log('Post created successfully')),
      catchError(this.handleError)
    );
  }

  updatePost(id: number, postData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, postData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('PostService Error:', error);
    
    let errorMessage = 'An unknown error occurred';
    if (error.status === 422 && error.error.errors) {
      errorMessage = Object.values(error.error.errors).join('\n');
    } else if (error.error.message) {
      errorMessage = error.error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}