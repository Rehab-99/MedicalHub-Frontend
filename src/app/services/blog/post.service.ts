import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://127.0.0.1:8000/api/posts';

  constructor(private http: HttpClient) {}

  // الحصول على الـ token من localStorage
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // الحصول على جميع البوستات
  getAllPosts(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(this.apiUrl, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // إنشاء بوست جديد
  createPost(postData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, postData, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // الحصول على بوست باستخدام الـ ID
  getPostById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // تحديث البوست باستخدام الـ ID
  updatePost(id: number, postData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, postData, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // حذف البوست باستخدام الـ ID
  deletePost(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // معالج الأخطاء
  private handleError(error: any) {
    console.error('PostService Error:', error);
    return throwError(() => error);
  }
}
