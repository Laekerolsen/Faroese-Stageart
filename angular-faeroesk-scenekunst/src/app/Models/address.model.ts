// address.model.ts
export interface Address {
  name: string;
  company?: string;
  street: string;
  street2?: string;
  zipCode: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
}