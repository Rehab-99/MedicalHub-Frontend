import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from '../header/header.component';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';




@Component({
  selector: 'app-search',
  imports: [CommonModule, FooterComponent, HeaderComponent ,ToastrModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  query: string = '';
  loading: boolean = true;
  errorMessage: string = '';
  results: { categories: any[], doctors: any[], posts: any[], products: any[] } = {
    categories: [],
    doctors: [],
    posts: [],
    products: []
  };
  error: string | null = null;


  selectedSection: 'categories' | 'doctors' | 'posts' | 'products' = 'categories'  ; // القسم الذي يتم عرضه حالياً


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';

      if (this.query.trim() !== '') {
        this.search();
      }
    });
  }

  setActiveSection(section: 'categories' | 'doctors' | 'posts' | 'products') {
    this.selectedSection = section;
  }
  
  search() {
    this.loading = true;
    this.http.get<any>(`http://localhost:8000/api/search?query=${this.query}`)
      .subscribe(
        (response) => {
          console.log('Search response:', response); 
          if (response?.data) {
            this.results = response.data;
          } else {
            this.results = {
              categories: [],
              doctors: [],
              posts: [],
              products: []
            };
          }
          this.loading = false;
        },
        (error) => {
          console.error('Error during search:', error);
          this.errorMessage = 'Something went wrong during search.';
          this.loading = false;
        }
      );
  }

  addToCart(productId: number): void {
      const token = this.authService.getToken();
      console.log('Current token:', token);
      
      if (!token) {
        this.error = 'Please login to add items to cart';
        return;
      }
  
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
  
      console.log('Sending request with headers:', headers);
  
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
          console.log('Full response:', response);
          console.log('Product added to cart successfully', response.body);
          this.toastr.success('تم إضافة المنتج للسلة بنجاح', 'نجاح', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            closeButton: true
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
            this.toastr.error('فشل في إضافة المنتج للسلة', 'خطأ', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              closeButton: true
            });
          }
        }
      });
    }

}
