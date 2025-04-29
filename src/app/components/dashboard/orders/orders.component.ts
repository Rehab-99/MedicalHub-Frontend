import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService, Order } from '../../../services/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm: string = '';

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getOrders().subscribe({
      next: (response) => {
        this.orders = response.data;
        this.filteredOrders = [...this.orders];
      },
      error: (error) => {
        console.error('Error loading orders:', error);
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
      order.user.name.toLowerCase().includes(searchLower) ||
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

  getPendingCount(): number {
    return this.orders.filter(order => order.status.toLowerCase() === 'pending').length;
  }

  getCompletedCount(): number {
    return this.orders.filter(order => order.status.toLowerCase() === 'completed').length;
  }

  getPaidCount(): number {
    return this.orders.filter(order => order.payment_status.toLowerCase() === 'paid').length;
  }
} 