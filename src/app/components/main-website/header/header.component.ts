import { Component, OnInit, HostListener, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled: boolean = false;
  isDoctorsDropdownOpen: boolean = false;
  isBlogsDropdownOpen: boolean = false;
  isPharmacyDropdownOpen: boolean = false;
  isSearchActive: boolean = false;
  searchQuery: string = '';
  cartItemsCount: number = 0;
  currentRoute: string = '';
  isMenuOpen: boolean = false;
  isLoggedIn: boolean = false;
  isUserMenuOpen: boolean = false;
  user: any = null;
  private routerSubscription: Subscription | undefined;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Handle scroll effect for navbar
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 50;
    });

    // Subscribe to login status
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      // Only fetch cart items if user is logged in
      if (loggedIn) {
        this.cartService.getCartItems().subscribe(items => {
          this.cartItemsCount = items.length;
        });
        this.cartService.getCartItemsCount().subscribe(count => {
          this.cartItemsCount = count;
        });
      } else {
        this.cartItemsCount = 0; // Reset cart count for non-logged-in users
      }
    });

    // Subscribe to user data
    this.authService.currentUser$.subscribe((user: any) => {
      this.user = user;
    });

    // Handle route changes
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
      this.isSearchActive = false;
      this.searchQuery = '';
      this.isMenuOpen = false;
      this.isDoctorsDropdownOpen = false;
      this.isBlogsDropdownOpen = false;
      this.isPharmacyDropdownOpen = false;
      this.isUserMenuOpen = false;
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    // Clean up scroll event listener
    window.removeEventListener('scroll', () => {});
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu') && !target.closest('.dropdown') && !target.closest('.navbar-toggler')) {
      this.isUserMenuOpen = false;
      this.isDoctorsDropdownOpen = false;
      this.isBlogsDropdownOpen = false;
      this.isPharmacyDropdownOpen = false;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.isDoctorsDropdownOpen = false;
      this.isBlogsDropdownOpen = false;
      this.isPharmacyDropdownOpen = false;
      this.isUserMenuOpen = false;
      this.isSearchActive = false;
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.isDoctorsDropdownOpen = false;
    this.isBlogsDropdownOpen = false;
    this.isPharmacyDropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.isUserMenuOpen = false;
    this.isMenuOpen = false;
    this.cartItemsCount = 0; // Reset cart count on logout
    this.router.navigate(['/login']);
  }

  toggleDoctorsDropdown(): void {
    this.isDoctorsDropdownOpen = !this.isDoctorsDropdownOpen;
    this.isBlogsDropdownOpen = false;
    this.isPharmacyDropdownOpen = false;
    this.isUserMenuOpen = false;
  }

  toggleBlogsDropdown(): void {
    this.isBlogsDropdownOpen = !this.isBlogsDropdownOpen;
    this.isDoctorsDropdownOpen = false;
    this.isPharmacyDropdownOpen = false;
    this.isUserMenuOpen = false;
  }

  togglePharmacyDropdown(): void {
    this.isPharmacyDropdownOpen = !this.isPharmacyDropdownOpen;
    this.isDoctorsDropdownOpen = false;
    this.isBlogsDropdownOpen = false;
    this.isUserMenuOpen = false;
  }

  activateSearch(): void {
    this.isSearchActive = !this.isSearchActive;
    if (this.isSearchActive) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 0);
    }
    this.isDoctorsDropdownOpen = false;
    this.isBlogsDropdownOpen = false;
    this.isPharmacyDropdownOpen = false;
    this.isUserMenuOpen = false;
  }

  onSearch(): void {
    if (this.searchQuery.trim() !== '') {
      this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
      this.isSearchActive = false;
      this.isMenuOpen = false;
      this.searchQuery = ''; // Clear search query after navigation
    }
  }
}