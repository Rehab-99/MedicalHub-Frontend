import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-human-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './human-products.component.html',
  styleUrls: ['./human-products.component.css']
})
export class HumanProductsComponent implements OnInit {
  products: any[] = [];
  loading = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProductsByType('human').subscribe({
      next: (response) => {
        if (response && response.data) {
          this.products = response.data;
          console.log('Loaded human products:', this.products);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load products',
          icon: 'error'
        });
      }
    });
  }

  navigateToAddProduct() {
    this.router.navigate(['/dashboard/products/add'], { 
      queryParams: { source: 'human' }
    });
  }

  editProduct(product: any) {
    this.router.navigate(['/dashboard/products/edit', product.id], {
      queryParams: { source: 'human' }
    });
  }

  deleteProduct(product: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${product.name}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.products = this.products.filter(p => p.id !== product.id);
            Swal.fire(
              'Deleted!',
              `${product.name} has been deleted successfully.`,
              'success'
            );
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            Swal.fire(
              'Error!',
              'Failed to delete product. Please try again.',
              'error'
            );
          }
        });
      }
    });
  }
} 