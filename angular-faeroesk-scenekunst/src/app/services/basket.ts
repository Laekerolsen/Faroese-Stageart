import { Injectable, computed, signal, effect } from '@angular/core';
import { Basket } from '../Models/basket.model';
import { Product } from '../Models/product.model';
import { BasketLine } from '../Models/basketline.model';
import { Discount } from '../Models/discount.model';

@Injectable({ providedIn: 'root' })
export class BasketStore {
  private readonly vatRate = 0;
  private readonly vatRateShipping = 0.25;
  private readonly storageKey = 'basket';

  private basket = signal<Basket>(this.loadInitial());

  readonly basket$ = this.basket.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this.basket()));
    });
  }

  // 🛒 Add product
  add(product: any, quantity = 1) {
    const basket = this.basket();

    const existing = basket.lines.find(l => l.productId === product.id);



    if (existing) {
      existing.quantity += quantity;
    } else {
      basket.lines.push({
        productId: product.id,
        productName: product.name,
        product: product,
        quantity,
        unitPriceExclVat: product.price,
        vatRate: this.vatRate,
        discountAmount: 0,
        totalExclVat: 0,
        totalVat: 0,
        totalInclVat: 0,
        totalPrice: 0
      });
    }

    this.recalculate();
  }

  remove(productId: string) {
    const basket = this.basket();
    basket.lines = basket.lines.filter(l => l.productId !== productId);
    this.recalculate();
  }

  applyDiscount(discount: Discount) {
    this.basket.update(b => ({ ...b, discount }));
    this.recalculate();
  }

  setShipping(amountExclVat: number) {
    const vat = amountExclVat * this.vatRateShipping;

    this.basket.update(b => ({
      ...b,
      shippingExclVat: amountExclVat,
      shippingVat: vat,
      shippingInclVat: amountExclVat + vat
    }));

    this.recalculate();
  }

  // 🧮 CORE LOGIC (invoice-safe)
  private recalculate() {
    const basket = this.basket();

    let totalExclVat = 0;

    // Step 1: calculate base totals
    for (const line of basket.lines) {
      line.totalExclVat = line.unitPriceExclVat * line.quantity;
      totalExclVat += line.totalExclVat;
    }

    // Step 2: discount
    let totalDiscount = 0;

    if (basket.discount) {
      totalDiscount =
        basket.discount.type === 'percentage'
          ? totalExclVat * (basket.discount.value / 100)
          : basket.discount.value;
    }

    // Step 3: distribute discount proportionally
    for (const line of basket.lines) {
      const ratio = totalExclVat ? line.totalExclVat / totalExclVat : 0;
      line.discountAmount = totalDiscount * ratio;

      const discountedExclVat = line.totalExclVat - line.discountAmount;

      line.totalVat = discountedExclVat * line.vatRate;
      line.totalInclVat = discountedExclVat + line.totalVat;
    }

    // Step 4: totals
    const linesExclVat = basket.lines.reduce((s, l) => s + (l.totalExclVat - (l.discountAmount || 0)), 0);
    const linesVat = basket.lines.reduce((s, l) => s + l.totalVat, 0);

    const totalVat = linesVat + basket.shippingVat;

    const totalInclVat =
      linesExclVat +
      totalVat +
      basket.shippingExclVat;

    this.basket.set({
      ...basket,
      totalExclVat: linesExclVat,
      totalVat,
      totalDiscount,
      totalInclVat
    });
  }

  // 💾 Persistence
  private loadInitial(): Basket {
    const raw = localStorage.getItem(this.storageKey);

    if (raw) return JSON.parse(raw);

    return {
      id: crypto.randomUUID(),
      lines: [],
      currency: 'DKK',
      shippingExclVat: 0,
      shippingVat: 0,
      shippingInclVat: 0,
      totalExclVat: 0,
      totalVat: 0,
      totalDiscount: 0,
      totalInclVat: 0
    };
  }

  clear() {
    localStorage.removeItem(this.storageKey);
    this.basket.set(this.loadInitial());
  }
}