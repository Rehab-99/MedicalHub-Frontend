import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { CategoryService, Category } from '../../../../services/category.service';
import { ProductService, Product } from '../../../../services/product.service';
import { catchError, forkJoin, Subject, takeUntil } from 'rxjs';
import { of } from 'rxjs';

// Add ResizeObserver type declaration
declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}

interface HeroSlide {
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-vet-pharmacy',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, HttpClientModule],
  providers: [CategoryService, ProductService],
  templateUrl: './vet-pharmacy.component.html',
  styleUrls: ['./vet-pharmacy.component.css']
})
export class VetPharmacyComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sliderTrack') sliderTrack!: ElementRef;
  
  categories: Category[] = [];
  allProducts: Product[] = [];
  featuredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  isLoading = false;
  error: string | null = null;
  readonly placeholderImage = 'assets/images/placeholder-category.jpg';
  private destroy$ = new Subject<void>();
  
  // Pagination properties
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  totalProducts = 0;
  
  // Slider properties
  currentSlide = 0;
  slideWidth = 0;
  totalSlides = 0;
  productsPerSlide = 4;
  private resizeObserver: any;
  sliderInterval: any;

  // Hero slider properties
  heroSlides: HeroSlide[] = [
    {
      image: 'assets/images/vet-pharmacy/slide1.jpg',
      title: 'Veterinary Care Products',
      description: 'High-quality products for your pets\' health and well-being'
    },
    {
      image: 'assets/images/vet-pharmacy/slide2.jpg',
      title: 'Professional Veterinary Supplies',
      description: 'Trusted by veterinarians worldwide'
    },
    {
      image: 'assets/images/vet-pharmacy/slide3.jpg',
      title: 'Pet Care Essentials',
      description: 'Everything you need to keep your pets healthy and happy'
    }
  ];
  currentSlideIndex = 0;
  private heroSliderInterval: any;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router
  ) {
    // Initialize resize observer
    if (typeof window !== 'undefined' && window.ResizeObserver) {
      this.resizeObserver = new window.ResizeObserver(entries => {
        this.updateSliderDimensions();
      });
    }
  }

  ngOnInit(): void {
    console.log('VetPharmacyComponent initialized');
    this.loadData();
    this.startHeroSlider();
  }

  ngOnDestroy() {
    console.log('VetPharmacyComponent destroyed');
    this.destroy$.next();
    this.destroy$.complete();
    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
    if (this.heroSliderInterval) {
      clearInterval(this.heroSliderInterval);
    }
  }

  ngAfterViewInit(): void {
    // Set up resize observer for the slider track
    if (this.sliderTrack && this.resizeObserver) {
      this.resizeObserver.observe(this.sliderTrack.nativeElement);
      this.updateSliderDimensions();
    }
  }

  loadData(): void {
    console.log('Loading data for vet pharmacy');
    this.isLoading = true;
    this.error = null;
    
    forkJoin({
      categories: this.categoryService.getVetCategories(),
      products: this.productService.getProductsByType('vet')
    }).pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        console.error('Error loading data:', error);
        this.error = 'Failed to load data. Please try again later.';
        return of({ categories: [], products: [] });
      })
    ).subscribe({
      next: (data) => {
        console.log('Categories loaded:', data.categories ? data.categories.length : 0);
        this.categories = data.categories || [];
        console.log('Products loaded:', data.products ? data.products.length : 0);
        this.allProducts = data.products || [];
        this.totalProducts = this.allProducts.length;
        this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
        
        // Set featured products (first 4)
        this.featuredProducts = this.allProducts.slice(0, 4);
        
        // Set paginated products
        this.updatePaginatedProducts();
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Subscription error:', error);
        this.error = 'An unexpected error occurred while loading data.';
        this.isLoading = false;
      }
    });
  }

  updatePaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedProducts = this.allProducts.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updatePaginatedProducts();
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      console.log('Image error, using placeholder:', img.src);
      img.src = this.placeholderImage;
    }
  }

  retryLoading() {
    console.log('Retrying data loading');
    this.loadData();
  }

  formatPrice(price: number): string {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSliderDimensions();
  }
  
  updateSliderDimensions(): void {
    if (this.sliderTrack && this.sliderTrack.nativeElement && this.sliderTrack.nativeElement.parentElement) {
      const containerWidth = this.sliderTrack.nativeElement.parentElement.offsetWidth;
      this.slideWidth = containerWidth;
      
      // Check if featuredProducts exists and has items
      if (this.featuredProducts && this.featuredProducts.length > 0) {
        this.totalSlides = Math.ceil(this.featuredProducts.length / this.productsPerSlide);
        
        // Reset current slide if it's out of bounds
        if (this.currentSlide >= this.totalSlides) {
          this.currentSlide = this.totalSlides - 1;
        }
      } else {
        // If no featured products, set totalSlides to 0
        this.totalSlides = 0;
        this.currentSlide = 0;
      }
    }
  }
  
  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }
  
  nextSlide(): void {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
    }
  }
  
  goToSlide(index: number): void {
    if (index >= 0 && index < this.totalSlides) {
      this.currentSlide = index;
    }
  }

  onCategoryClick(categoryId: number): void {
    this.router.navigate(['/pharmacy/vet/category', categoryId]);
  }

  startHeroSlider() {
    this.heroSliderInterval = setInterval(() => {
      this.nextHeroSlide();
    }, 5000);
  }

  nextHeroSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.heroSlides.length;
  }

  prevHeroSlide() {
    this.currentSlideIndex = this.currentSlideIndex === 0 
      ? this.heroSlides.length - 1 
      : this.currentSlideIndex - 1;
  }

  goToHeroSlide(index: number) {
    this.currentSlideIndex = index;
  }
} 