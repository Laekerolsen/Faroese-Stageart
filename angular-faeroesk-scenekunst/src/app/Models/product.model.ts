export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  stockQuantity?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}