import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-vet-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-vet-category.component.html',
  styleUrls: ['./edit-vet-category.component.css']
})
export class EditVetCategoryComponent implements OnInit {
  @ViewChild('categoryForm') categoryForm!: NgForm;
  category: any = {
    name: '',
    description: '',
    image: ''
  };
  loading = false;
  submitted = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
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
        this.category = response.data;
        if (this.category.image) {
          this.imagePreview = 'http://127.0.0.1:8000/storage/' + this.category.image;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        Swal.fire('Error', 'Failed to load category', 'error');
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    this.submitted = true;
    
    if (!this.category.name.trim() || !this.category.description.trim()) {
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.category.name);
    formData.append('description', this.category.description);
    formData.append('type', 'vet'); // Ensure type is set to vet
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.categoryService.updateCategory(this.category.id, formData).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Category updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/dashboard/vet-category']);
        });
      },
      error: (error) => {
        console.error('Error updating category:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update category. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/vet-category']);
  }
} 