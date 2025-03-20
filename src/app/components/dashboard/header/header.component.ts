import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

interface Notification {
  id: number;
  message: string;
  time: string;
  icon: string;
  read: boolean;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class HeaderComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount = 0;
  showNotifications = false;
  showUserMenu = false;
  userName = 'John Doe';
  userRole = 'Administrator';
  userAvatar = 'assets/images/avatar.png';

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize mock notifications
    this.notifications = [
      {
        id: 1,
        message: 'New appointment request',
        time: '5 minutes ago',
        icon: 'fas fa-calendar-plus',
        read: false
      },
      {
        id: 2,
        message: 'Patient report ready',
        time: '1 hour ago',
        icon: 'fas fa-file-medical',
        read: false
      },
      {
        id: 3,
        message: 'System maintenance scheduled',
        time: '2 hours ago',
        icon: 'fas fa-wrench',
        read: true
      }
    ];

    this.updateUnreadCount();
  }

  toggleSidebar() {
    // Implement sidebar toggle logic
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  logout() {
    // Implement logout logic
    this.router.navigate(['/login']);
  }

  // Close dropdowns when clicking outside
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notifications-dropdown') && !target.closest('.notifications-button')) {
      this.showNotifications = false;
    }
    if (!target.closest('.user-menu-dropdown') && !target.closest('.user-menu-button')) {
      this.showUserMenu = false;
    }
  }
} 