import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuOpen = false;
  isLoggedIn = false;
  isUserMenuOpen = false;
  user: any = null;

  constructor(private authService: AuthService) {
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.currentUser$.subscribe((user: any) => {
      this.user = user;
    });
  }
  isDoctorsDropdownOpen = false;

  toggleDoctorsDropdown() {
    this.isDoctorsDropdownOpen = !this.isDoctorsDropdownOpen;
  }
  


  isBlogsDropdownOpen = false;
  toggleBlogsDropdown() {
    console.log('Blogs dropdown toggled, isBlogsDropdownOpen:', this.isBlogsDropdownOpen);
    this.isBlogsDropdownOpen = !this.isBlogsDropdownOpen;
  }

  isPharmacyDropdownOpen = false;
  togglePharmacyDropdown() {
    console.log('Pharmacy dropdown toggled, current state:', this.isPharmacyDropdownOpen);
    this.isPharmacyDropdownOpen = !this.isPharmacyDropdownOpen;
    console.log('Pharmacy dropdown new state:', this.isPharmacyDropdownOpen);
    
    // Close other dropdowns when opening this one
    if (this.isPharmacyDropdownOpen) {
      this.isDoctorsDropdownOpen = false;
      this.isBlogsDropdownOpen = false;
      this.isUserMenuOpen = false;
    }
    
    // Add a small delay to ensure the DOM has updated
    setTimeout(() => {
      console.log('Dropdown visibility after timeout:', this.isPharmacyDropdownOpen);
    }, 100);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    }
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.isUserMenuOpen = false;
  }
}
