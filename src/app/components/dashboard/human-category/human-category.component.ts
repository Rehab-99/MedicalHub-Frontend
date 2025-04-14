import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/category.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  type: string;
}

interface ApiResponse {
  data: Category[];
}

@Component({
  selector: 'app-human-category',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [CategoryService],
  templateUrl: './human-category.component.html',
  styleUrls: ['./human-category.component.css']
})
export class HumanCategoryComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  submitted: boolean = false;
  category = {
    name: '',
    description: '',
    type: 'human'
  };
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadHumanCategories();
  }

  loadHumanCategories() {
    this.loading = true;
    console.log('Loading categories...');
    
    this.categoryService.getCategoriesByType('human').subscribe({
      next: (response: ApiResponse) => {
        console.log('API Response:', response);
        if (response && response.data) {
          this.categories = response.data;
        } else {
          this.categories = [];
        }
        console.log('Processed categories:', this.categories);
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error fetching categories:', error);
        this.loading = false;
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load categories',
          icon: 'error'
        });
      }
    });
  }

  editCategory(category: Category) {
    console.log('Navigating to edit category:', category);
    if (category && category.id) {
      this.router.navigate(['/dashboard/edit-category', category.id]);
    } else {
      console.error('Invalid category or missing ID:', category);
      Swal.fire({
        title: 'Error!',
        text: 'Invalid category selected',
        icon: 'error'
      });
    }
  }

  deleteCategory(category: Category) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${category.name}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(category.id).subscribe({
          next: () => {
            this.categories = this.categories.filter(c => c.id !== category.id);
            
            Swal.fire(
              'Deleted!',
              `${category.name} has been deleted successfully.`,
              'success'
            );
          },
          error: (error: unknown) => {
            console.error('Error deleting category:', error);
            Swal.fire(
              'Error!',
              'Failed to delete category. Please try again.',
              'error'
            );
          }
        });
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    this.submitted = true;

    if (!this.category.name.trim() || !this.category.description.trim() || !this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.category.name);
    formData.append('description', this.category.description);
    formData.append('type', this.category.type);
    formData.append('image', this.selectedFile);

    this.categoryService.createCategory(formData).subscribe({
      next: (response: Category) => {
        Swal.fire({
          title: 'Success!',
          text: 'Category created successfully',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/dashboard/human-category']);
        });
      },
      error: (error: unknown) => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to create category',
          icon: 'error'
        });
      }
    });
  }

  navigateToAddCategory() {
    this.router.navigate(['/dashboard/add-category'], {
      queryParams: { type: 'human' }
    });
  }

  onCancel() {
    this.router.navigate(['/dashboard/human-category']);
  }
} 