import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import Swal from 'sweetalert2';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  type: string;
}

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
    image: ''
  };
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  loading = true;
  submitted = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService
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
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.category = response.data;
          this.loading = false;
          if (this.category.image) {
            this.imagePreview = `http://127.0.0.1:8000/storage/${this.category.image}`;
          }
        } else {
          throw new Error('Invalid response format');
        }
      },
      error: (error) => {
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
    formData.append('name', this.category.name);
    formData.append('description', this.category.description);
    formData.append('type', this.category.type);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.categoryService.updateCategory(this.category.id, formData).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
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
        } else {
          throw new Error(response.message || 'Failed to update category');
        }
      },
      error: (error) => {
        console.error('Error updating category:', error);
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