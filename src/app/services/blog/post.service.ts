import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BlogService } from './blog.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://127.0.0.1:8000/api/posts';

  constructor(
    private http: HttpClient,
    private blogService: BlogService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllPosts(role?: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = role ? `${this.apiUrl}?role=${role}` : this.apiUrl;
    console.log(`Fetching posts for role: ${role || 'all'} from ${url}`);
    return this.http.get(url, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  createPost(postData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Sending POST request to create post:', [...postData.entries()]);
    return this.http.post(this.apiUrl, postData, { headers }).pipe(
      tap((response) => {
        console.log('Post created, notifying BlogService:', response);
        this.blogService.notifyPostsUpdated();
      }),
      catchError(error => this.handleError(error))
    );
  }

  getPostById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  updatePost(id: number, postData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${id}`, postData, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  deletePost(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any) {
    console.error('PostService Error:', error);
    return throwError(() => error);
  }
}