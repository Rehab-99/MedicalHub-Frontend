import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  loading = false;
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize user from localStorage if exists
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/login`, credentials);
  }

  loginWithGoogle() {
    this.loading = true;
    this.error = '';
    window.location.href = 'http://localhost:8000/auth/google/redirect';
  }

  loginWithFacebook() {
    window.location.href = environment.facebookRedirectUrl;
  }

  getUserData(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
