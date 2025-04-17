import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { PharmacyService } from '../../../../services/pharmacy.service';
import { Category, CategoryResponse } from '../../../../models/category.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-vet-pharmacy',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, HttpClientModule],
  templateUrl: './vet-pharmacy.component.html',
  styleUrls: ['./vet-pharmacy.component.css']
})
export class VetPharmacyComponent implements OnInit {
  medicines: any[] = [];
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private pharmacyService: PharmacyService) {}

  ngOnInit(): void {
    this.loadCategories();
    setInterval(() => {
      this.nextSlide();
    }, 5000); // تغيير كل 5 ثواني
  }

  loadCategories() {
    this.isLoading = true;
    this.error = null;
    
    this.pharmacyService.getVetCategories().subscribe({
      next: (response: CategoryResponse) => {
        this.categories = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Failed to load categories. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  filterByCategory(category: Category) {
    this.selectedCategory = category;
    // TODO: Implement product loading by category
  }


  images: string[] = [
    'assets/images/pharmacy/vet/slide5.jpg',
    'assets/images/pharmacy/vet/slide6.jpg',
    'assets/images/pharmacy/vet/slide4.jpg'
  ];
  
  currentSlide = 0;

  
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }
  
  goToSlide(index: number) {
    this.currentSlide = index;
  }
  
  scrollToCategories() {
    const el = document.querySelector('.pharmacy-container');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
} 