import { Address } from './address.model';
import { Discount } from './discount.model';
import { OrderLine } from './orderline.model';

export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'created'
  | 'abandoned'
  | 'initialized';

export interface Order {
  id: string;
  userId: string;

  orderStatus: OrderStatus;

  lines: OrderLine[];

  discount?: Discount;

  shippingExclVat: number;
  shippingVat: number;

  totalExclVat: number;
  totalVat: number;
  totalDiscount: number;
  totalInclVat: number;

  currency: string;
  createdAt: string;

  invoiceAddress: Address;
  deliveryAddress: Address;
  useSameAddress: boolean;
}