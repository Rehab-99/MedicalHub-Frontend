import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  category: any = {
    id: null,
    name: '',
    description: '',
    image: ''
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  loading = true;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    console.log('Category ID from route:', id);
    if (id) {
      this.loadCategory(parseInt(id));
    } else {
      console.error('No category ID provided');
      this.router.navigate(['/dashboard/human-category']);
    }
  }

  loadCategory(id: number) {
    this.loading = true;
    console.log('Loading category with ID:', id);
    
    this.categoryService.getCategory(id).subscribe({
      next: (response) => {
        console.log('Category data received:', response);
        if (response.data) {
          this.category = {
            id: id,
            name: response.data.name,
            description: response.data.description,
            image: response.data.image
          };
          if (this.category.image) {
            this.imagePreview = `http://127.0.0.1:8000/storage/${this.category.image}`;
          }
          console.log('Category loaded successfully:', this.category);
        } else {
          console.error('Invalid response format:', response);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to load category data',
            icon: 'error'
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.loading = false;
        let errorMessage = 'Failed to load category';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        }
        
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error'
        }).then(() => {
          this.router.navigate(['/dashboard/human-category']);
        });
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.submitted = true;
    console.log('Submitting category:', this.category);

    if (!this.category.name || !this.category.description) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all required fields',
        icon: 'error'
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', this.category.name.trim());
    formData.append('description', this.category.description.trim());
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    console.log('Sending update request for category ID:', this.category.id);
    this.categoryService.updateCategory(this.category.id, formData).subscribe({
      next: (response) => {
        console.log('Update response:', response);
        this.submitted = false;
        Swal.fire({
          title: 'Success!',
          text: 'Category updated successfully',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/dashboard/human-category']);
        });
      },
      error: (error) => {
        console.error('Error updating category:', error);
        Swal.fire({
          title: 'Error!',
          text: error.error?.message || 'Failed to update category',
          icon: 'error'
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/dashboard/human-category']);
  }
} 