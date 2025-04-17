import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';
import { CategoriesService, Category } from '../../../services/categories.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: null as File | null
  };
  categories: Category[] = [];
  loading = false;
  submitted = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  source: string = 'human';
  productId: number = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoriesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get the product ID from route parameters
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
    });

    // Get the source from query parameters
    this.route.queryParams.subscribe(params => {
      this.source = params['source'] || 'human';
    });

    this.loadCategories();
    this.loadProduct();
  }

  loadProduct() {
    this.loading = true;
    this.productService.getProduct(this.productId).subscribe({
      next: (product: Product) => {
        this.product = {
          name: product.name,
          description: product.description || '',
          price: product.price.toString(),
          stock: product.stock?.toString() || '',
          category_id: product.category_id.toString(),
          image: null
        };
        this.imagePreview = product.image ? `http://127.0.0.1:8000/storage/${product.image}` : null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load product details',
          icon: 'error'
        });
      }
    });
  }

  loadCategories() {
    console.log('Loading categories for type:', this.source);
    this.categoryService.getCategories(this.source as 'human' | 'vet').subscribe({
      next: (categories: Category[]) => {
        console.log('Categories loaded successfully:', categories);
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
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
      Swal.fire({
        title: 'Error!',
        text: 'Please fill all required fields',
        icon: 'error'
      });
      return;
    }

    this.loading = true;
    const formData = new FormData();

    // Append all product data to FormData
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('stock', this.product.stock.toString());
    formData.append('category_id', this.product.category_id.toString());
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: (product: Product) => {
        this.loading = false;
        Swal.fire({
          title: 'Success!',
          text: 'Product updated successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          const route = this.source === 'human' ? 'human-products' : 'vet-products';
          this.router.navigate(['/dashboard', route]);
        });
      },
      error: (error: any) => {
        console.error('Error updating product:', error);
        this.loading = false;
        let errorMessage = 'Failed to update product. Please try again.';
        
        if (error.status === 422 && error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error'
        });
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