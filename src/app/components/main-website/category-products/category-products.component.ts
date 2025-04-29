import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-category-products',
  imports: [CommonModule, FormsModule, FooterComponent, ToastrModule, HeaderComponent],
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.css'
})
export class CategoryProductsComponent implements OnInit {
  categoryId!: number;
  products: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.categoryId = +id;
        this.loadProducts();
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.http.get<any>(`http://127.0.0.1:8000/api/products/category/${this.categoryId}`)
      .subscribe({
        next: (res) => {
          this.products = res.data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load products';
          this.isLoading = false;
        }
      });
  }

  addToCart(productId: number): void {
    const token = this.authService.getToken();
    
    if (!token) {
      this.error = 'Please login to add items to cart';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    this.http.post('http://localhost:8000/api/cart/add', 
      { 
        product_id: productId,
        quantity: 1
      },
      { 
        headers: headers,
        observe: 'response'
      }
    ).subscribe({
      next: (response) => {
        console.log('Product added to cart successfully', response.body);
        this.cartService.getCartItems();
        this.toastr.success('Product added to cart successfully', 'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          closeButton: true,
          progressBar: true,
          progressAnimation: 'increasing',
          toastClass: 'ngx-toastr custom-toast',
          titleClass: 'toast-title',
          messageClass: 'toast-message'
        });
      },
      error: (error) => {
        console.error('Detailed error:', error);
        if (error.status === 401) {
          this.error = 'Your session has expired. Please login again.';
        } else if (error.status === 403) {
          this.error = 'You do not have permission to perform this action.';
        } else {
          this.error = `Failed to add product to cart: ${error.error?.message || 'Unknown error'}`;
          this.toastr.error('Failed to add product to cart', 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            closeButton: true,
            progressBar: true,
            progressAnimation: 'increasing',
            toastClass: 'ngx-toastr custom-toast',
            titleClass: 'toast-title',
            messageClass: 'toast-message'
          });
        }
      }
    });
  }
}