// src/app/components/checkout/checkout.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutService, CartResponse, OrderResponse } from '../../../services/checkout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: any[] = [];
  paymentMethod: string = '';
  addressData: any = {
    shipping: {
      city: '',
      street: '',
      building: '',
    },
    billing: {
      city: '',
      street: '',
      building: '',
    }
  };
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private checkoutService: CheckoutService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.checkoutService.getCart().subscribe({
      next: (res: CartResponse) => {
        this.cart = res.cart;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'حدث خطأ أثناء تحميل سلة المشتريات';
        console.error('Error loading cart:', error);
        this.isLoading = false;
      }
    });
  }

  submitOrder(): void {
    if (!this.paymentMethod) {
      this.errorMessage = 'الرجاء اختيار طريقة الدفع';
      return;
    }

    this.isLoading = true;
    const payload = {
      payment_method: this.paymentMethod,
      addr: this.addressData
    };

    this.checkoutService.createOrder(payload).subscribe({
      next: (res: OrderResponse) => {
        console.log('Order created successfully:', res);
        this.router.navigate(['/order-success']);
      },
      error: (error) => {
        this.errorMessage = 'حدث خطأ أثناء إنشاء الطلب';
        console.error('Error creating order:', error);
        this.isLoading = false;
      }
    });
  }
}
// "user": {
//   "name": "Test User",
//   "email": "test@example.com",
//   "updated_at": "2025-04-13T11:16:38.000000Z",
//   "created_at": "2025-04-13T11:16:38.000000Z",
//   "id": 1
// },
// "token": "1|mi6GnaBInJ4VC7AWGsQGL5lXlyhPkj07oZcmyG9C59ae7bcc"

//login
// {
//   "message": "Login successful",
//   "user": {
//       "id": 1,
//       "name": "Test User",
//       "email": "test@example.com",
//       "provider": null,
//       "provider_id": null,
//       "email_verified_at": null,
//       "address": null,
//       "phone": null,
//       "image": null,
//       "created_at": "2025-04-13T11:16:38.000000Z",
//       "updated_at": "2025-04-13T11:16:38.000000Z"
//   },
//   "token": "2|EGAJOQDDTZyCOOsCCfruPrBbZQBQjZC83NOVZEp77f0720d7"
// }