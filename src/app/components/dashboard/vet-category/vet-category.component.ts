import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vet-category',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './vet-category.component.html',
  styleUrls: ['./vet-category.component.css']
})
export class VetCategoryComponent implements OnInit {
  categories: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadVetCategories();
  }

  loadVetCategories() {
    this.loading = true;
    this.error = null;
    this.categoryService.getCategoriesByType('vet').subscribe({
      next: (response: { data: any[] }) => {
        this.categories = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
        this.error = 'Failed to load categories. Please try again later.';
        this.loading = false;
      }
    });
  }

  navigateToAddCategory() {
    this.router.navigate(['/dashboard/add-vet-category']);
  }

  editCategory(category: any) {
    this.router.navigate(['/dashboard/edit-vet-category', category.id]);
  }

  deleteCategory(category: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(category.id).subscribe({
          next: () => {
            this.categories = this.categories.filter(c => c.id !== category.id);
            Swal.fire(
              'Deleted!',
              'Category has been deleted.',
              'success'
            );
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            Swal.fire(
              'Error!',
              'Failed to delete category.',
              'error'
            );
          }
        });
      }
    });
  }
} 