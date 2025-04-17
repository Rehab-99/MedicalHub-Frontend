import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { PharmacyService } from '../../../../services/pharmacy.service';
import { Category, CategoryResponse } from '../../../../models/category.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-human-pharmacy',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, HttpClientModule],
  templateUrl: './human-pharmacy.component.html',
  styleUrls: ['./human-pharmacy.component.css']
})
export class HumanPharmacyComponent implements OnInit {
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
    
    this.pharmacyService.getHumanCategories().subscribe({
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
    'assets/images/pharmacy/human/slide1.jpg',
    'assets/images/pharmacy/human/slide2.jpg',
    'assets/images/pharmacy/human/slide3.jpg'
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