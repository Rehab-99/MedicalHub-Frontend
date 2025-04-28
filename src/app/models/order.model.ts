export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderDate: Date;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  billingAddress: Address;
  shippingAddress: Address;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postCode: string;
  country: string;
} 