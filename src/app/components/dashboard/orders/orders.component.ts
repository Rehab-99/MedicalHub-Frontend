import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService, Order, OrderItem } from '../../../services/orders.service';

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
  selectedOrder: Order | null = null;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getOrders().subscribe({
      next: (response) => {
        this.orders = response.data;
        this.filteredOrders = [...this.orders];
        console.log('All Orders:', this.orders);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  loadOrderById(id: number): void {
    this.ordersService.getOrderById(id).subscribe({
      next: (order) => {
        this.selectedOrder = order;
        console.log('Order Data from API:', order);
        console.log('Order Items:', order.items);
        this.orders = [order];
        this.filteredOrders = [order];
      },
      error: (error) => {
        console.error('Error loading order:', error);
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

  showOrderDetails(order: Order): void {
    this.ordersService.getOrderById(order.id).subscribe({
      next: (orderDetails) => {
        this.selectedOrder = orderDetails;
        console.log('Order Details:', orderDetails);
      },
      error: (error) => {
        console.error('Error loading order details:', error);
      }
    });
  }

  closeModal(): void {
    this.selectedOrder = null;
  }

  calculateItemTotal(item: OrderItem): number {
    return parseFloat(item.price) * item.quantity;
  }

  calculateTotal(order: Order): number {
    return order.items.reduce((total, item) => {
      return total + this.calculateItemTotal(item);
    }, 0);
  }
} 