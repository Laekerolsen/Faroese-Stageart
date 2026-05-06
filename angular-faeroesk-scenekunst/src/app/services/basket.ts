import { Injectable, computed, signal, effect } from '@angular/core';
import { Basket } from '../Models/basket.model';
import { Product } from '../Models/product.model';
import { BasketLine } from '../Models/basketline.model';
import { Discount } from '../Models/discount.model';
import { Order } from '../Models/order.model';
import { Address } from '../Models/address.model';
import { OrderLine } from '../Models/orderline.model';

@Injectable({ providedIn: 'root' })
export class BasketStore {
  private readonly vatRate = 0;
  private readonly vatRateShipping = 0.25;
  private readonly storageKey = 'basket';
  private readonly storageKeyIsConfirmed = 'isconfirmed';
  private readonly storageKeyHasAddress = 'hasaddress';
  private readonly storageOrderKey = 'order';
  public readonly storageOrdersListKey = 'orderslist';
  private readonly storageAddressesKey = 'addresses';

  public TermsAccepted = signal(false);
  public AddressConfirmed = signal(false);

  public basket = signal<Basket>(this.loadInitial());
  public order = signal<Order>(this.loadInitialOrder());

  public addresses = signal<Address[]>([]);

  public synchronizeAddresses() {

    if (this.AddressesFromStorage.length > 0) {
      this.addresses.set(this.AddressesFromStorage);
      this.setInvoiceAddress(this.AddressesFromStorage[0]);

      if (this.basket().useSameAddress) 
        this.setDeliveryAddress(this.AddressesFromStorage[0]);
      else
        this.setDeliveryAddress(this.AddressesFromStorage[1]);
    }

    const invoice = this.basket().invoiceAddress;
    const invoiceFromStorage = this.AddressesFromStorage.length > 0 ? this.AddressesFromStorage[0] : null;
    const delivery = this.basket().deliveryAddress;
    const deliveryFromStorage = this.AddressesFromStorage.length > 1 ? this.AddressesFromStorage[1] : null; 

    const uniqueAddresses: Address[] = [];

    if (invoice && !uniqueAddresses.some(a => JSON.stringify(a) === JSON.stringify(invoice))) {
      if (invoiceFromStorage && invoice !== invoiceFromStorage && invoice.name !== '')
        uniqueAddresses.push(invoice);
      else if (invoiceFromStorage)
        uniqueAddresses.push(invoiceFromStorage);
      else
        uniqueAddresses.push(invoice);
    }

    if (delivery && !uniqueAddresses.some(a => JSON.stringify(a) === JSON.stringify(delivery))) {
      if (this.basket().useSameAddress && deliveryFromStorage)
        uniqueAddresses.push(deliveryFromStorage);
      else if (this.basket().useSameAddress)
        uniqueAddresses.push(delivery);
      else
        uniqueAddresses.push(invoice);
    }

    this.addresses.set(uniqueAddresses);
  }

  readonly basket$ = this.basket.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this.basket()));
      localStorage.setItem(this.storageKeyIsConfirmed, JSON.stringify(this.TermsAccepted()));
      localStorage.setItem(this.storageKeyHasAddress, JSON.stringify(this.AddressConfirmed()));
    });
  }

  get AddressesFromStorage(): Address[] {
    const raw = localStorage.getItem(this.storageAddressesKey);
    return raw ? JSON.parse(raw) : [];
  }

  loadAddressesFromStorage() {
    const raw = localStorage.getItem(this.storageAddressesKey);
    if (raw) {
      this.addresses.set(JSON.parse(raw));
      const storedAddresses: Address[] = JSON.parse(raw);
      if (storedAddresses.length > 0) {
        this.setInvoiceAddress(storedAddresses[0]);
        if (this.basket().useSameAddress) {
          this.setDeliveryAddress(storedAddresses[0]);
        } else if (storedAddresses.length > 1) {
          this.setDeliveryAddress(storedAddresses[1]);
        }
      }
    }
  }

  saveAddresses()
  {
    localStorage.setItem(this.storageAddressesKey, JSON.stringify(this.addresses()));
  }

  saveTermsAccepted()
  {
    localStorage.setItem(this.storageKeyIsConfirmed, JSON.stringify(this.TermsAccepted()));
  }

  saveAddressConfirmed()
  {
    localStorage.setItem(this.storageKeyHasAddress, JSON.stringify(this.AddressConfirmed()));
  }

  basketIsTouched: boolean = false;

  // 🛒 Add product
  add(product: any, quantity = 1) {
    const newLine = {
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
    };

    this.basket.update(b => {
      const exists = b.lines.some(l => l.productId === product.id);
      const lines = exists
        ? b.lines.map(l => l.productId === product.id ? { ...l, quantity: l.quantity + quantity } : l)
        : [...b.lines, newLine];
      return { ...b, lines };
    });

    this.recalculate();
  }

  remove(productId: string) {
    this.basket.update(b => ({ ...b, lines: b.lines.filter(l => l.productId !== productId) }));
    this.recalculate();
  }

  update(productId: string)
  {
    const basket = this.basket();
    this.recalculate();
  }

  setInvoiceAddress(address: Address) {
    this.basket.update(b => ({ ...b, invoiceAddress: { ...address } }));
  }

  setDeliveryAddress(address: Address) {
    this.basket.update(b => ({ ...b, deliveryAddress: { ...address } }));
  }

  setUseSameAddress(value: boolean) {
    this.basket.update(b => ({ ...b, useSameAddress: value }));
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

    this.basketIsTouched = true;
  }

  // 💾 Persistence
  private loadInitial(): Basket {
    const raw = localStorage.getItem(this.storageKey);
    const rawIsConfirmed = localStorage.getItem(this.storageKeyIsConfirmed);
    const rawHasAddress = localStorage.getItem(this.storageKeyHasAddress);

    if (rawIsConfirmed) this.TermsAccepted.set(JSON.parse(rawIsConfirmed));

    if (rawHasAddress) this.AddressConfirmed.set(JSON.parse(rawHasAddress));

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
      totalInclVat: 0,
      useSameAddress: true,
      invoiceAddress: this.createEmptyAddress(),
      deliveryAddress: this.createEmptyAddress()
    };
  }

  private createEmptyAddress(): Address {
    return {
      name: '',
      company: '',
      street: '',
      street2: '',
      zipCode: '',
      city: '',
      country: '',
      phone: '',
      email: ''
    };
  }

  private loadInitialOrder(): Order {
    const raw = localStorage.getItem(this.storageOrderKey);

    const orderFromJson: Order = raw ? JSON.parse(raw) : null;

    if (raw && orderFromJson.orderStatus != 'created') return JSON.parse(raw);

    const orderlines: OrderLine[] = [];

    if (this.basket().lines) this.basket().lines.forEach(bline => {
      const oline: OrderLine = {
        product: bline.product,
        productId: bline.productId,
        productName: bline.productName,
        quantity: bline.quantity,
        totalPrice: bline.totalPrice,
        unitPrice: bline.unitPriceExclVat,
      };
      orderlines.push(oline);
    });

    const order: Order = {
      createdAt: new Date().toISOString(),
      currency: 'DKK',
      invoiceAddress: this.basket().invoiceAddress,
      deliveryAddress: this.basket().deliveryAddress,
      id: crypto.randomUUID(),
      orderStatus: 'created',
      lines: orderlines,
      shippingExclVat: this.basket().shippingExclVat,
      shippingVat: this.basket().shippingVat,
      totalDiscount: this.basket().totalDiscount,
      totalExclVat: this.basket().totalExclVat,
      totalInclVat: this.basket().totalInclVat,
      totalVat: this.basket().totalVat,
      userId: this.basket().userId || '',
      useSameAddress: this.basket().useSameAddress,
      discount: this.basket().discount
    };

    return order;
  }

  get OldOrdersList(): Order[] {
    const raw = localStorage.getItem(this.storageOrdersListKey);

    //this.OldOrdersListAsSignal.set(raw ? JSON.parse(raw) : []);

    return raw ? JSON.parse(raw) : [];
  }

  //OldOrdersListAsSignal = signal<Order[]>(this.OldOrdersList) || signal<Order[]>([]);

  get orderListSortedByDateDesc(): Order[] {
    const orders = this.OldOrdersList;
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  get orderListSortedByDateAsc(): Order[] {
    const orders = this.OldOrdersList;
    return orders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  get orderList(): Order[] {
    return this.orderListSortedByDateDesc;
  }

  setOldOrdersList(orders: Order[]) {
    localStorage.setItem(this.storageOrdersListKey, JSON.stringify(orders));
  }

  updateOldOrdersList(order: Order) {
    const orders = this.OldOrdersList;
    if (orders.some(o => o.id === order.id)) return;
    orders.push(order);
    this.setOldOrdersList(orders);
  }

  updateOrderInOldOrdersList(updatedOrder: Order) {
    const orders = this.OldOrdersList;
    const index = orders.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
      orders[index] = updatedOrder;
      this.setOldOrdersList(orders);
    }
  }

  clearOldOrders() {
    localStorage.removeItem(this.storageOrdersListKey);
  }


  clear() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.storageKeyIsConfirmed);
    localStorage.removeItem(this.storageKeyHasAddress);
    localStorage.removeItem(this.storageOrderKey);
    this.basket.set(this.loadInitial());
  }

  clearOnOrderConfirmation() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.storageKeyIsConfirmed);
    localStorage.removeItem(this.storageKeyHasAddress);
    this.TermsAccepted.set(false);
    this.AddressConfirmed.set(false);

    this.basket.set(this.loadInitial());

  }
  clearOrder() {
    localStorage.removeItem(this.storageOrderKey);
    this.order.set(this.loadInitialOrder());
  }
}