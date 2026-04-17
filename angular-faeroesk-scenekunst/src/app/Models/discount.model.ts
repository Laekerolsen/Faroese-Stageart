export type DiscountType = 'percentage' | 'fixed';

export interface Discount {
  code: string;
  description?: string;
  type: DiscountType;
  value: number; // e.g. 10 (%) or 50 (DKK)
  isActive: boolean;
  expiresAt?: Date;
}