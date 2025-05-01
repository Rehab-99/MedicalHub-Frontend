import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  logout() {
    localStorage.removeItem('doctor');
    localStorage.removeItem('token');
    localStorage.removeItem('doctor_role');
    window.location.href = '/doctor-login';
  }
}