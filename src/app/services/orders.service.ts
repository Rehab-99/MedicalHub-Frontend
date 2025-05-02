import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: number;
  created_at: string | null;
  updated_at: string | null;
  product?: {
    id: number;
    category_id: number;
    name: string;
    description: string;
    image: string;
    price: string;
    quantity: number;
    stock: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    pharmacy_id: number | null;
  };
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  payment_status: string;
  number: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  items: OrderItem[];
  user: {
    id: number;
    name: string;
    email: string;
    notes: string | null;
    provider: string | null;
    provider_id: string | null;
    email_verified_at: string | null;
    address: string;
    phone: string;
    image: string | null;
    created_at: string;
    updated_at: string;
    status: string;
  };
}

export interface OrdersResponse {
  current_page: number;
  data: Order[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.apiUrl}/orders`);
  }

  getUserOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.apiUrl}/show`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/getorders/${id}`);
  }
} 