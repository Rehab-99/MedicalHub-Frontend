import { Component, OnInit, HostListener, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { ThemeService } from '../../../services/theme.service';
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
  isDarkMode: boolean = false;
  user: any = null;
  private routerSubscription: Subscription | undefined;
  private themeSubscription: Subscription | undefined;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Handle scroll effect for navbar
    window.addEventListener('scroll', this.handleScroll);

    // Subscribe to login status
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.cartService.getCartItems().subscribe(items => {
          this.cartItemsCount = items.length;
        });
        this.cartService.getCartItemsCount().subscribe(count => {
          this.cartItemsCount = count;
        });
      } else {
        this.cartItemsCount = 0;
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
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    window.removeEventListener('scroll', this.handleScroll);
  }

  private handleScroll = () => {
    this.isScrolled = window.scrollY > 50;
  };

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

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
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
    this.cartItemsCount = 0;
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
      this.searchQuery = '';
    }
  }
}