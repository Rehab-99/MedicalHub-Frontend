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
} 