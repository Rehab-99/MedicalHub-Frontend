import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent, ToastrModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  query: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  results: { categories: any[], doctors: any[], posts: any[], products: any[] } = {
    categories: [],
    doctors: [],
    posts: [],
    products: []
  };
  error: string | null = null;
  selectedSection: 'categories' | 'doctors' | 'posts' | 'products' = 'categories';
  viewMode: 'grid' = 'grid'; // إزالة الـ list، هيبقى بس grid

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      if (this.query.trim() !== '') {
        this.search();
      } else {
        this.loading = false;
        this.errorMessage = 'Please enter a search term.';
      }
    });
  }

  setActiveSection(section: 'categories' | 'doctors' | 'posts' | 'products'): void {
    this.selectedSection = section;
  }

  search(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>(`http://localhost:8000/api/search?query=${this.query}`)
      .subscribe(
        (response) => {
          if (response?.data) {
            this.results = response.data;
            this.selectedSection = this.results.categories.length ? 'categories' :
                                  this.results.doctors.length ? 'doctors' :
                                  this.results.posts.length ? 'posts' :
                                  this.results.products.length ? 'products' : 'categories';
          } else {
            this.results = {
              categories: [],
              doctors: [],
              posts: [],
              products: []
            };
            this.errorMessage = 'No results found.';
          }
          this.loading = false;
        },
        (error) => {
          this.errorMessage = error.status === 404 ? 'No results found.' : 'Something went wrong during search. Please try again.';
          this.results = { categories: [], doctors: [], posts: [], products: [] };
          this.loading = false;
        }
      );
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

        this.toastr.success('Product added to cart successfully', 'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          closeButton: true
        });
      },
      error: (error) => {

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


  bookAppointment(item: any) {
    this.router.navigate(['/appointment', item.id]);
  }

  goToCategory(category: any) {
    this.router.navigate(['/category', category.id]);
  }
  viewPost(postId: number) {
    this.router.navigate(['/blog/human', postId]);
  }
  

  bookAppointment(item: any): void {
    this.router.navigate(['/appointment', item.id]);
  }

  goToCategory(category: any): void {
    this.router.navigate(['/category', category.id]);
  }


  viewPost(postId: number): void {
    this.router.navigate(['/blog/human', postId]);
  }

  startChat(item: any): void {
    this.router.navigate(['/chat', item.id]);
  }
}