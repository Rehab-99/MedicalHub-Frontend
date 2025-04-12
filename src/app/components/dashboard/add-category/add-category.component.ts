import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  category = {
    name: '',
    description: '',
    type: 'human',
    image: null as File | null
  };
  loading = false;
  submitted = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.category.image = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.submitted = true;

    if (!this.category.name || !this.category.type) {
      return;
    }

    this.loading = true;
    const formData = new FormData();

    // Append all category data to FormData with proper field names
    formData.append('name', this.category.name);
    formData.append('description', this.category.description);
    formData.append('type', this.category.type);
    
    if (this.category.image) {
      formData.append('image', this.category.image);
    }

    this.categoryService.createCategory(formData).subscribe({
      next: (response) => {
        if (response.status === 201) {
          Swal.fire({
            title: 'Success!',
            text: response.message,
            icon: 'success'
          }).then(() => {
            this.location.back();
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to create category',
            icon: 'error'
          });
        }
      },
      error: (error) => {
        console.error('Error creating category:', error);
        Swal.fire({
          title: 'Error!',
          text: error.error?.message || 'Failed to create category',
          icon: 'error'
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  cancel() {
    this.location.back();
  }
}

@Component({
  selector: 'app-add-human-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddHumanCategoryComponent {
  category = {
    name: '',
    description: '',
    type: 'human'
  };
  selectedFile: File | null = null;
  submitted = false;

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
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
      next: (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Human Category created successfully',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/dashboard/human-category']);
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to create human category',
          icon: 'error'
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/human-category']);
  }
} 