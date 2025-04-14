import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = new BehaviorSubject<boolean>(false);
  loading = false;
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeAuthState();
  }

  private constructImageUrl(imagePath: string | null): string | null {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${environment.apiUrl.replace('/api', '')}/storage/${imagePath}`;
  }

  private initializeAuthState() {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (user && token) {
        const parsedUser = JSON.parse(user);
        parsedUser.image = this.constructImageUrl(parsedUser.image);
        this.currentUserSubject.next(parsedUser);
        this.isLoggedIn$.next(true);
      }
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
    const token = this.getToken();
    return this.http.get(`${environment.apiUrl}/user`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map((response: any) => {
        if (response.user && response.user.image) {
          response.user.image = this.constructImageUrl(response.user.image);
        }
        return response;
      })
    );
  }

  setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      this.isLoggedIn$.next(true);
    }
  }

  setUser(user: any) {
    if (isPlatformBrowser(this.platformId)) {
      user.image = this.constructImageUrl(user.image);
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.isLoggedIn$.next(true);
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('lastEmail');
    }
    this.currentUserSubject.next(null);
    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
}
