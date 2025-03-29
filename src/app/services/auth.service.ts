import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api/auth'; // تعديل حسب API

  constructor(private http: HttpClient) {}

  loginWithSocial(provider: string) {
    return this.http.get(`${this.apiUrl}/${provider}/redirect`, { responseType: 'text' });
  }
}
