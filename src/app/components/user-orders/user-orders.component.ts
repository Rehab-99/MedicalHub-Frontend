import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService, Order, OrderItem } from '../../services/orders.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  error: string | null = null;
  baseUrl = environment.apiUrl;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadUserOrders();
  }

  loadUserOrders(): void {
    this.isLoading = true;
    this.error = null;
    
    this.ordersService.getUserOrders().subscribe({
      next: (response) => {
        this.orders = response.data;
        this.filteredOrders = [...this.orders];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user orders:', error);
        this.error = 'Failed to load orders. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  filterOrders(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = [...this.orders];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredOrders = this.orders.filter(order => 
      order.number.toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower) ||
      order.payment_status.toLowerCase().includes(searchLower) ||
      order.payment_method.toLowerCase().includes(searchLower)
    );
  }

  getStatusClass(status: string): string {
    const baseClass = 'status-badge ';
    switch (status.toLowerCase()) {
      case 'pending':
        return baseClass + 'status-pending';
      case 'completed':
        return baseClass + 'status-completed';
      case 'cancelled':
        return baseClass + 'status-cancelled';
      default:
        return baseClass + 'status-pending';
    }
  }

  getPaymentStatusClass(status: string): string {
    const baseClass = 'status-badge ';
    switch (status.toLowerCase()) {
      case 'paid':
        return baseClass + 'payment-status-paid';
      case 'pending':
        return baseClass + 'payment-status-pending';
      case 'failed':
        return baseClass + 'payment-status-failed';
      default:
        return baseClass + 'payment-status-pending';
    }
  }

  calculateItemTotal(item: OrderItem): number {
    return parseFloat(item.price) * item.quantity;
  }

  calculateTotal(order: Order): number {
    return order.items.reduce((total, item) => {
      return total + this.calculateItemTotal(item);
    }, 0);
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/100';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const storageUrl = this.baseUrl.replace('/api', '');
    return `${storageUrl}/storage/${imagePath}`;
  }
} 