import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { CategoryService, Category } from '../../../../services/category.service';
import { ProductService, Product } from '../../../../services/product.service';
import { catchError, forkJoin, Subject, takeUntil } from 'rxjs';
import { of } from 'rxjs';

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
  isLoading = true;
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
  private resizeObserver: ResizeObserver;
  
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    // Initialize resize observer
    this.resizeObserver = new ResizeObserver(entries => {
      this.updateSliderDimensions();
    });
  }

  ngOnInit() {
    console.log('VetPharmacyComponent initialized');
    this.loadData();
  }

  ngOnDestroy() {
    console.log('VetPharmacyComponent destroyed');
    this.destroy$.next();
    this.destroy$.complete();
    // Clean up resize observer
    this.resizeObserver.disconnect();
  }

  ngAfterViewInit(): void {
    // Set up resize observer for the slider track
    if (this.sliderTrack) {
      this.resizeObserver.observe(this.sliderTrack.nativeElement);
      this.updateSliderDimensions();
    }
  }

  loadData() {
    console.log('Loading data for vet pharmacy');
    this.isLoading = true;
    this.error = null;
    
    // Load categories and products separately to better handle errors
    this.categoryService.getVetCategories()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading categories:', error);
          this.error = 'Failed to load categories. Please try again.';
          return of([]);
        })
      )
      .subscribe((categories: Category[]) => {
        console.log('Categories loaded:', categories.length);
        this.categories = categories;
        
        // Load products after categories
        this.productService.getProductsByType('vet')
          .pipe(
            takeUntil(this.destroy$),
            catchError(error => {
              console.error('Error loading products:', error);
              this.error = 'Failed to load products. Please try again.';
              return of([]);
            })
          )
          .subscribe((products: any[]) => {
            console.log('Products loaded:', products.length);
            this.allProducts = products;
            this.totalProducts = products.length;
            this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
            
            // Set featured products (first 4)
            this.featuredProducts = products.slice(0, 4);
            
            // Set paginated products
            this.updatePaginatedProducts();
            
            this.isLoading = false;
          });
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

  handleImageError(event: Event): void {
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
    if (this.sliderTrack) {
      const containerWidth = this.sliderTrack.nativeElement.parentElement.offsetWidth;
      this.slideWidth = containerWidth;
      this.totalSlides = Math.ceil(this.featuredProducts.length / this.productsPerSlide);
      
      // Reset current slide if it's out of bounds
      if (this.currentSlide >= this.totalSlides) {
        this.currentSlide = this.totalSlides - 1;
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
} 