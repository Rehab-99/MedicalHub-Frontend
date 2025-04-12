import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-vet-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-vet-category.component.html',
  styleUrls: ['./add-vet-category.component.css']
})
export class AddVetCategoryComponent {
  category = {
    name: '',
    description: '',
    type: 'vet'
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  submitted = false;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private location: Location
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
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

    console.log('Submitting vet category with image...'); // Debug log

    this.categoryService.createCategory(formData).subscribe({
      next: (response) => {
        console.log('Success response:', response); // Debug log
        Swal.fire({
          title: 'Success!',
          text: 'Vet Category created successfully',
          icon: 'success'
        }).then(() => {
          const path = this.category.type === 'Human' ? '/dashboard/human-category' : '/dashboard/vet-category';
          this.router.navigate([path]);
        });
      },
      error: (error) => {
        console.error('Error creating category:', error); // Debug log
        let errorMessage = 'Failed to create vet category';
        
        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.detail) {
            errorMessage = error.error.detail;
          }
        }
        
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error'
        });
      }
    });
  }

  onCancel() {
    const path = this.category.type === 'Human' ? '/dashboard/human-category' : '/dashboard/vet-category';
    this.router.navigate([path]);
  }
} 