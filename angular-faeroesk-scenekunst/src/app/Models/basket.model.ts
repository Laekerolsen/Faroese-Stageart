import { BasketLine } from "./basketline.model";
import { Discount } from "./discount.model";

export interface Basket {
  id: string;
  userId?: string;

  lines: BasketLine[];
  discount?: Discount;

  shippingExclVat: number;
  shippingVat: number;
  shippingInclVat: number;

  totalExclVat: number;
  totalVat: number;
  totalDiscount: number;
  totalInclVat: number;

  currency: string;
  updatedAt?: Date;
}

export class BasketModel {
  id!: string;
  lines: BasketLine[] = [];
  currency!: string;

  get totalQuantity(): number {
    return this.lines.reduce((sum, l) => sum + l.quantity, 0);
  }

  get subtotal(): number {
    return this.lines.reduce((sum, l) => sum + l.totalPrice, 0);
  }
}