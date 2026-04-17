import { BasketLine } from './basketline.model';
import { Discount } from './discount.model';
import { OrderLine } from './orderline.model';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  userId: string;

  orderStatus: OrderStatus;

  lines: BasketLine[];

  discount?: Discount;

  shippingExclVat: number;
  shippingVat: number;

  totalExclVat: number;
  totalVat: number;
  totalDiscount: number;
  totalInclVat: number;

  currency: string;
  createdAt: string;
}