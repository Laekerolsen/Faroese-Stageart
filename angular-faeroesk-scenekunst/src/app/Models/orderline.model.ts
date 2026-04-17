import { Product } from "./product.model";

export interface OrderLine {
  productId: string;
  product: Product;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}