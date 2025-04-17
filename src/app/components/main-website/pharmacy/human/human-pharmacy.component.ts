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

@Component({
  selector: 'app-human-pharmacy',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, HttpClientModule],
  providers: [CategoryService, ProductService],
  templateUrl: './human-pharmacy.component.html',
  styleUrls: ['./human-pharmacy.component.css']
})
export class HumanPharmacyComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sliderTrack') sliderTrack!: ElementRef;
  
  categories: Category[] = [];
  allProducts: Product[] = [];
  featuredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  loading = false;
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
  heroSlides = [
    {
      image: 'assets/images/pharmacy/slide1.jpg',
      title: 'Quality Medications',
      description: 'Wide range of pharmaceutical products'
    },
    {
      image: 'assets/images/pharmacy/slide2.jpg',
      title: 'Professional Service',
      description: 'Expert pharmaceutical care and advice'
    },
    {
      image: 'assets/images/pharmacy/slide3.jpg',
      title: 'Healthcare Products',
      description: 'Complete range of healthcare essentials'
    },
    {
      image: 'assets/images/pharmacy/slide4.jpg',
      title: 'Modern Pharmacy',
      description: 'State-of-the-art facilities and service'
    }
  ];
  currentHeroSlide = 0;

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
    this.loadData();
    this.startHeroSlider();
  }

  ngOnDestroy() {
    console.log('HumanPharmacyComponent destroyed');
    this.destroy$.next();
    this.destroy$.complete();
    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
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
    this.loading = true;
    this.error = null;

    forkJoin({
      categories: this.categoryService.getHumanCategories(),
      products: this.productService.getProductsByType('human')
    }).pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        console.error('Error loading data:', error);
        this.error = 'Failed to load data. Please try again later.';
        return of({ categories: [], products: [] });
      })
    ).subscribe({
      next: (data) => {
        this.categories = data.categories;
        this.allProducts = data.products;
        this.totalProducts = this.allProducts.length;
        this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
        
        // Set featured products (first 4)
        this.featuredProducts = this.allProducts.slice(0, 4);
        
        // Set paginated products
        this.updatePaginatedProducts();
        
        console.log('Data loaded successfully:', {
          categories: this.categories.length,
          products: this.allProducts.length
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Subscription error:', error);
        this.error = 'An unexpected error occurred while loading data.';
        this.loading = false;
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

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
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

  getCategoryIcon(categoryName: string): string {
    // Return default icon if categoryName is undefined or null
    if (!categoryName) {
      return 'fa-pills';
    }
    
    // Map category names to Font Awesome icons
    const iconMap: { [key: string]: string } = {
      // Medication Types
      'Prescription Medications': 'fa-prescription-bottle-alt',
      'Over-the-Counter': 'fa-pills',
      'Vitamins & Supplements': 'fa-capsules',
      'First Aid': 'fa-first-aid',
      'Health Devices': 'fa-heartbeat',
      
      // Body Systems
      'Cardiovascular': 'fa-heartbeat',
      'Neurological': 'fa-brain',
      'Pain Relief': 'fa-band-aid',
      'Allergies': 'fa-allergies',
      'Digestive Health': 'fa-stomach',
      'Respiratory': 'fa-lungs',
      'Skin Care': 'fa-hand-sparkles',
      'Eye Care': 'fa-eye',
      'Dental Care': 'fa-tooth',
      'Hair Care': 'fa-cut',
      'Personal Care': 'fa-user-shield',
      
      // Demographics
      'Baby Care': 'fa-baby',
      'Elderly Care': 'fa-user-nurse',
      'Sexual Health': 'fa-heart',
      'Mental Health': 'fa-brain',
      'Weight Management': 'fa-weight',
      
      // Conditions
      'Diabetes': 'fa-tint',
      'Hypertension': 'fa-heartbeat',
      'Cholesterol': 'fa-chart-line',
      
      // Medication Classes
      'Antibiotics': 'fa-bacteria',
      'Antivirals': 'fa-virus',
      'Antifungals': 'fa-biohazard',
      'Antiparasitics': 'fa-bug',
      'Hormone Therapy': 'fa-flask',
      'Immunosuppressants': 'fa-shield-virus',
      'Anticoagulants': 'fa-tint',
      'Antiplatelets': 'fa-tint',
      'Antidepressants': 'fa-brain',
      'Antianxiety': 'fa-brain',
      'Antipsychotics': 'fa-brain',
      'Stimulants': 'fa-bolt',
      'Sedatives': 'fa-moon',
      'Muscle Relaxants': 'fa-hand-paper',
      'Anticonvulsants': 'fa-brain',
      'Antiemetics': 'fa-vomit',
      'Antidiarrheals': 'fa-toilet',
      'Laxatives': 'fa-toilet',
      'Antacids': 'fa-flask',
      'Proton Pump Inhibitors': 'fa-flask',
      'H2 Blockers': 'fa-flask',
      'Antihistamines': 'fa-allergies',
      'Decongestants': 'fa-lungs',
      'Expectorants': 'fa-lungs',
      'Cough Suppressants': 'fa-lungs',
      'Bronchodilators': 'fa-lungs',
      'Inhaled Steroids': 'fa-lungs',
      'Topical Steroids': 'fa-hand-sparkles',
      
      // Topical Products
      'Sunscreen': 'fa-sun',
      'Insect Repellent': 'fa-bug',
      'Wound Care': 'fa-band-aid',
      'Burn Care': 'fa-fire',
      
      // Administration Routes
      'Eye Drops': 'fa-eye',
      'Ear Drops': 'fa-ear',
      'Nasal Sprays': 'fa-nose',
      'Inhalers': 'fa-lungs',
      'Injections': 'fa-syringe',
      'Patches': 'fa-band-aid',
      'Implants': 'fa-microchip',
      'Suppositories': 'fa-pills',
      
      // Default
      'Other': 'fa-pills'
    };

    // Try to find an exact match
    if (iconMap[categoryName]) {
      return iconMap[categoryName];
    }

    // Try to find a partial match
    for (const key in iconMap) {
      if (categoryName.toLowerCase().includes(key.toLowerCase())) {
        return iconMap[key];
      }
    }

    // Default icon if no match found
    return 'fa-pills';
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
    this.router.navigate(['/pharmacy/human/category', categoryId]);
  }

  startHeroSlider() {
    this.sliderInterval = setInterval(() => {
      this.nextHeroSlide();
    }, 5000); // Change slide every 5 seconds
  }

  nextHeroSlide() {
    this.currentHeroSlide = (this.currentHeroSlide + 1) % this.heroSlides.length;
  }

  prevHeroSlide() {
    this.currentHeroSlide = this.currentHeroSlide === 0 
      ? this.heroSlides.length - 1 
      : this.currentHeroSlide - 1;
  }

  goToHeroSlide(index: number) {
    this.currentHeroSlide = index;
  }
} 