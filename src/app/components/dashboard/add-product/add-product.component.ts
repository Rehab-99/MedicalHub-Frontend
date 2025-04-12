import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

let Swal: any;

interface Category {
  id: number;
  name: string;
  type: string;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  providers: [ProductService, CategoryService]
})
export class AddProductComponent implements OnInit {
  product = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: 0
  };
  categories: Category[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  loading = false;
  submitted = false;
  productType = 'human'; // Default type
  private isBrowser: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      import('sweetalert2').then(module => {
        Swal = module.default;
      });
    }
    console.log('AddProductComponent constructor initialized');
  }

  ngOnInit() {
    console.log('AddProductComponent initialized');
    
    // Use a more direct approach to get query parameters
    const params = this.route.snapshot.queryParams;
    console.log('Query params from snapshot:', params);
    
    this.productType = params['source'] || 'human';
    console.log('Product type set to:', this.productType);
    
    // Also subscribe to query params changes
    this.route.queryParams.subscribe(params => {
      console.log('Query params from subscription:', params);
      this.productType = params['source'] || 'human';
      console.log('Product type updated to:', this.productType);
      this.loadCategories();
    });
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategoriesByType(this.productType).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.categories = response.data;
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        this.loading = false;
        this.showAlert('Error!', 'Failed to load categories', 'error');
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  private async showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning', timer?: number) {
    if (this.isBrowser && Swal) {
      const options: any = {
        title,
        text,
        icon,
        showConfirmButton: !timer
      };
      if (timer) {
        options.timer = timer;
      }
      return Swal.fire(options);
    }
    return Promise.resolve();
  }

  onSubmit() {
    this.submitted = true;
    if (!this.product.name.trim() || !this.product.description.trim() || 
        this.product.price <= 0 || this.product.stock < 0 || this.product.category_id === 0) {
      this.showAlert('Error!', 'Please fill all required fields correctly', 'error');
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('stock', this.product.stock.toString());
    formData.append('category_id', this.product.category_id.toString());
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.createProduct(formData).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response && response.status === 201) {
          this.showAlert('Success!', response.message || 'Product created successfully', 'success', 1500)
            .then(() => {
              const route = this.productType === 'human' ? 'human-products' : 'vet-products';
              this.router.navigate(['/dashboard', route]);
            });
        }
      },
      error: (error: any) => {
        console.error('Error creating product:', error);
        this.loading = false;
        
        let errorMessage = 'Failed to create product. Please try again.';
        
        if (error.status === 422 && error.error?.message === 'The name has already been taken.') {
          errorMessage = 'A product with this name already exists. Please choose a different name.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.showAlert('Error!', errorMessage, 'error');
      }
    });
  }

  cancel() {
    const route = this.productType === 'human' ? 'human-products' : 'vet-products';
    this.router.navigate(['/dashboard', route]);
  }
} 