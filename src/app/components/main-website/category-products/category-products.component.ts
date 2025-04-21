import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';


@Component({
  selector: 'app-category-products',
  imports: [CommonModule, FooterComponent],
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.css'
})
export class CategoryProductsComponent implements OnInit {
  categoryId!: number;
  products: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

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
}