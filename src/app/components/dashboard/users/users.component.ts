import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  provider?: string;
  status: 'active' | 'archived';
}

interface ApiResponse {
  message: string;
  users: User[];
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.isLoading = true;
    this.error = '';

    const token = this.authService.getToken();
    if (!token) {
      this.error = 'Authentication token not found';
      this.isLoading = false;
      return;
    }

    this.http.get<ApiResponse>('http://127.0.0.1:8000/api/user/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (response) => {
        this.users = response.users;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.error.message || 'Failed to fetch users';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  toggleUserStatus(user: User) {
    const token = this.authService.getToken();
    if (!token) {
      this.toastr.error('Authentication token not found');
      return;
    }

    const newStatus = user.status === 'active' ? 'archived' : 'active';
    this.http.put(
      `http://127.0.0.1:8000/api/users/${user.id}/status`,
      { status: newStatus },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).subscribe({
      next: (response: any) => {
        user.status = newStatus;
        this.toastr.success(`User status changed to ${newStatus}`);
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        const errorMessage = error.error?.message || 'Failed to update user status';
        this.toastr.error(errorMessage);
      }
    });
  }
}
