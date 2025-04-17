import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService, Category } from '../../../services/categories.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  category: Category = {
    id: 0,
    name: '',
    description: '',
    type: 'human',
    image: '',
    created_at: '',
    updated_at: ''
  };
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  loading = true;
  submitted = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoriesService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadCategory(id);
    }
  }

  loadCategory(id: number) {
    this.loading = true;
    this.categoryService.getCategory(id).subscribe({
      next: (category: Category) => {
        this.category = category;
        this.loading = false;
        if (this.category.image) {
          this.imagePreview = this.category.image; // The image URL is already processed by the service
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading category:', error);
        this.loading = false;
        Swal.fire({
          title: 'Error!',
          text: error.error?.message || 'Failed to load category',
          icon: 'error'
        }).then(() => {
          this.onCancel();
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
    if (!this.category.name.trim() || !this.category.description.trim()) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill all required fields',
        icon: 'error'
      });
      this.submitted = false;
      return;
    }

    const formData = new FormData();
    formData.append('name', this.category.name.trim());
    formData.append('description', this.category.description.trim());
    formData.append('type', this.category.type);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // Log the form data for debugging
    console.log('Submitting form data:', {
      id: this.category.id,
      name: this.category.name.trim(),
      description: this.category.description.trim(),
      type: this.category.type,
      hasImage: !!this.selectedFile
    });

    this.categoryService.updateCategory(this.category.id, formData).subscribe({
      next: (category: Category) => {
        console.log('Update successful:', category);
        this.submitted = false;
        Swal.fire({
          title: 'Success!',
          text: 'Category updated successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/dashboard/${this.category.type}-categories`]);
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating category:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message,
          url: `${environment.apiUrl}/categories/${this.category.id}`
        });
        this.submitted = false;
        Swal.fire({
          title: 'Error!',
          text: error.error?.message || 'Failed to update category. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onCancel() {
    this.router.navigate([`/dashboard/${this.category.type}-categories`]);
  }
} 