import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { HttpClientModule } from '@angular/common/http';

let Swal: any;

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: number;
  type: string;
  stock: number;
}

@Component({
  selector: 'app-human-products',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './human-products.component.html',
  styleUrls: ['./human-products.component.css']
})
export class HumanProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  private isBrowser: boolean;

  constructor(
    private productService: ProductService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      import('sweetalert2').then(module => {
        Swal = module.default;
      });
    }
  }

  private async showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning', showCancelButton = false) {
    if (this.isBrowser && Swal) {
      return Swal.fire({
        title,
        text,
        icon,
        showCancelButton,
        confirmButtonColor: showCancelButton ? '#d33' : undefined,
        cancelButtonColor: showCancelButton ? '#3085d6' : undefined,
        confirmButtonText: showCancelButton ? 'Yes, delete it!' : 'OK'
      });
    }
    return Promise.resolve({ isConfirmed: false });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProductsByType('human').subscribe({
      next: (products: Product[]) => {
        this.products = products;
        console.log('Loaded human products:', this.products);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.loading = false;
        this.showAlert('Error!', 'Failed to load products', 'error');
      }
    });
  }

  navigateToAddProduct() {
    console.log('Navigating to add product page...');
    window.location.href = '/dashboard/add-product?source=human';
  }

  editProduct(product: Product) {
    this.router.navigate(['/dashboard/edit-product', product.id], {
      queryParams: { source: 'human' }
    });
  }

  async deleteProduct(product: Product) {
    const result = await this.showAlert(
      'Are you sure?',
      `You are about to delete ${product.name}. This action cannot be undone!`,
      'warning',
      true
    );

    if (result.isConfirmed) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== product.id);
          this.showAlert('Deleted!', `${product.name} has been deleted successfully.`, 'success');
        },
        error: (error: any) => {
          console.error('Error deleting product:', error);
          this.showAlert('Error!', 'Failed to delete product. Please try again.', 'error');
        }
      });
    }
  }
} 