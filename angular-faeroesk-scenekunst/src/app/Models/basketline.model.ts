import { Product } from './product.model';

export interface BasketLine {
  productId: string;
  productName: string;
  product: Product;
  quantity: number;

  unitPriceExclVat: number;
  vatRate: number; // e.g. 0.25

  discountAmount?: number;

  totalExclVat: number;
  totalVat: number;
  totalInclVat: number;
  totalPrice: number;
}