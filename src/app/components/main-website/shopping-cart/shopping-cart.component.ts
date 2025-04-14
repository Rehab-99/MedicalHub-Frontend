// src/app/components/main-website/shopping-cart/shopping-cart.component.ts

import { Component } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CartItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
  memory?: string;  // إضافة خاصية memory
  total?: number;
  id?: number;
}

interface CartData {
  items: CartItem[];
  total: number;
}

interface CartResponse {
  data: CartData;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe((res: CartResponse) => {
      this.cartItems = res.data.items.map(item => ({
        ...item,
        total: item.price * item.quantity
      }));
      this.cartTotal = res.data.total;
    });
  }

  updateQuantity(productId: number, quantity: number) {
    if (!isNaN(quantity) && quantity > 0) {
      this.cartService.updateCart(productId, quantity).subscribe(() => this.loadCart());
    }
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId).subscribe(() => this.loadCart());
  }

  getQuantityOptions(max: number): number[] {
    return Array.from({ length: max }, (_, index) => index + 1);
  }
}
