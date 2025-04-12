import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
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
  source: string = 'human'; // Default to human products

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get the source from query parameters
    this.route.queryParams.subscribe(params => {
      this.source = params['source'] || 'human';
    });
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategoriesByType(this.source).subscribe({
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

    // Append all product data to FormData with proper field names
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price);
    formData.append('stock', this.product.stock);
    formData.append('category_id', this.product.category_id);
    
    if (this.product.image) {
      formData.append('image', this.product.image);
    }

    this.productService.createProduct(formData).subscribe({
      next: (response) => {
        if (response.status === 201) {
          Swal.fire({
            title: 'Success!',
            text: response.message,
            icon: 'success'
          }).then(() => {
            // Navigate back to the source page
            this.navigateBack();
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to create product',
            icon: 'error'
          });
        }
      },
      error: (error) => {
        console.error('Error creating product:', error);
        Swal.fire({
          title: 'Error!',
          text: error.error?.message || 'Failed to create product',
          icon: 'error'
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  cancel() {
    this.navigateBack();
  }

  private navigateBack() {
    if (this.source === 'vet') {
      this.router.navigate(['/dashboard/vet-products']);
    } else {
      this.router.navigate(['/dashboard/human-products']);
    }
  }
} 