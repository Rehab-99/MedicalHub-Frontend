import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent {
  category = {
    name: '',
    description: '',
    type: 'human' // default value
  };
  selectedFile: File | null = null;
  submitted = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {
    // Get the type from route parameters
    const type = this.route.snapshot.queryParams['type'] || 'human';
    this.category.type = type;
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
      Swal.fire({
        title: 'Error!',
        text: 'Please fill all required fields and select an image',
        icon: 'error'
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', this.category.name);
    formData.append('description', this.category.description);
    formData.append('type', this.category.type);
    formData.append('image', this.selectedFile);

    this.categoryService.createCategory(formData).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Category created successfully',
          icon: 'success'
        }).then(() => {
          this.router.navigate([`/dashboard/${this.category.type}-categories`]);
        });
      },
      error: (error) => {
        console.error('Error creating category:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to create category. Please try again.',
          icon: 'error'
        });
      }
    });
  }

  onCancel() {
    this.router.navigate([`/dashboard/${this.category.type}-categories`]);
  }
} 