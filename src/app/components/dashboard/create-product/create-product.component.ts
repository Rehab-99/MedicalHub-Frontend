import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  product = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: null as File | null
  };
  categories: any[] = [];
  loading = false;
  submitted = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load categories',
          icon: 'error'
        });
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.product.image = file;
      
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

    if (!this.product.name || !this.product.price || !this.product.stock || !this.product.category_id) {
      return;
    }

    this.loading = true;
    const formData = new FormData();

    // Append all product data to FormData
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price);
    formData.append('stock', this.product.stock);
    formData.append('category_id', this.product.category_id);
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.createProduct(formData).subscribe({
      next: (response) => {
        this.loading = false;
        Swal.fire({
          title: 'Success!',
          text: 'Product created successfully',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/dashboard/products']);
        });
      },
      error: (error) => {
        this.loading = false;
        console.error('Error creating product:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to create product',
          icon: 'error'
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/products']);
  }
} 