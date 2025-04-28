import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService, CheckoutAddress, CheckoutRequest, CartResponse, CartItem } from '@app/services/checkout.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  isLoading = false;
  cartItems: CartItem[] = [];
  totalAmount = 0;

  constructor(
    private fb: FormBuilder,
    @Inject(CheckoutService) private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      payment_method: ['cash', Validators.required],
      addr: this.fb.group({
        billing: this.createAddressFormGroup(),
        shipping: this.createAddressFormGroup()
      })
    });
  }

  ngOnInit() {
    this.loadCart();
  }

  private createAddressFormGroup(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postCode: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  private loadCart() {
    this.isLoading = true;
    this.checkoutService.getCart().subscribe({
      next: (response: CartResponse) => {
        this.cartItems = response.cart;
        this.calculateTotal();
      },
      error: (error: Error) => {
        this.toastr.error('Error loading cart items');
        console.error('Cart loading error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private calculateTotal() {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      this.isLoading = true;
      const checkoutData: CheckoutRequest = this.checkoutForm.value;
      
      this.checkoutService.processCheckout(checkoutData).subscribe({
        next: (response: any) => {
          this.toastr.success('Order placed successfully!');
          this.router.navigate(['/order-confirmation']);
        },
        error: (error: Error) => {
          this.toastr.error('Error processing your order. Please try again.');
          console.error('Checkout error:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.toastr.warning('Please fill in all required fields');
    }
  }
}
