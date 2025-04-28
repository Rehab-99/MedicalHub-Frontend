import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuOpen = false;
  isLoggedIn = false;
  isUserMenuOpen = false;
  user: any = null;
  cartItemsCount: number = 0;

  searchQuery: string = '';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private http: HttpClient ,
    private router: Router
  ) {
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.currentUser$.subscribe((user: any) => {
      this.user = user;
    });

    this.cartService.getCartItems().subscribe((items: any[]) => {
      this.cartItemsCount = items.length;
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
    this.isPharmacyDropdownOpen = !this.isPharmacyDropdownOpen;
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


  onSearch() {
      if (this.searchQuery.trim() !== '') {
        this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
      }
  }




}
