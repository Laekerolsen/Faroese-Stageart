import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { createImageUrlBuilder } from '@sanity/image-url';
import { client } from '../../../sanity/client';
import { BasketStore } from '../../../services/basket';
import { Address } from '../../../Models/address.model';
import { Subscription } from 'rxjs';
import { Order } from '../../../Models/order.model';
import { stringify } from 'querystring';
import { OrderLine } from '../../../Models/orderline.model';
import { Router } from '@angular/router';

const builder = createImageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source);


@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.html',
  styleUrl: './payment.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PaymentPageComponent implements OnInit {

  public store: BasketStore;
  private router: Router;

  constructor(private _store: BasketStore, _router: Router) {
    this.store = _store;
    this.router = _router;
  }

  ngOnInit(): void {
    if (!this.store.basket().lines || this.store.basket().lines.length == 0)
      this.router.navigate(['/kurv']);

    this.createOrder();
  }

  orderConfirmed()
  {
    this.store.order().orderStatus = 'confirmed';
  }

  orderPending()
  {
    this.store.order().orderStatus = 'pending';
  }

  orderApproved()
  {
    this.store.order().orderStatus = 'approved';
  }
  
  submit() {
    //  Go to PaymentProvider!!! =>
  }

  get shipping()
  {
    return this.store.order().shippingExclVat + this.store.order().shippingVat;
  }

  total = computed(() =>
      this.subtotal() + this.shipping
    );

  // derived state (auto updates)
  subtotal = computed(() => {
      const o = this.store.order();
      if (!o) return 0;

      return o.lines.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
    });

  createOrder() {
    const orderlines: OrderLine[] = [];
    
    if (this.store.basket().lines) this.store.basket().lines.forEach(bline => {
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
      invoiceAddress: this.store.basket().invoiceAddress,
      deliveryAddress: this.store.basket().deliveryAddress,
      id: this.store.basket().id,
      orderStatus: 'initialized',
      lines: orderlines,
      shippingExclVat: this.store.basket().shippingExclVat,
      shippingVat: this.store.basket().shippingVat,
      totalDiscount: this.store.basket().totalDiscount,
      totalExclVat: this.store.basket().totalExclVat,
      totalInclVat: this.store.basket().totalInclVat,
      totalVat: this.store.basket().totalVat,
      userId: this.store.basket().userId || '',
      useSameAddress: this.store.basket().useSameAddress,
      discount: this.store.basket().discount
    };

    this.store.order.set(order);
  }

  payWithViva() {
  //
  }

  backToAddress()
  {
    this.router.navigate(['/adresse']);
  }

  public urlFor = urlFor;

  public ShowModal = signal(false);

  openModal() {
    this.ShowModal.set(true);
    this.show = true;
  }

  public htmlContent: string = `<h2 class="text-2xl font-bold">Betaling er ikke implementeret endnu</h2>
                                <p>Kom tilbage når shoppen er aktiv, eller klik rundt og se om der er noget du ellers kan bruge</p>`;

  public ShowDynamicModal = signal(false);

  openDynamicModal() {
    this.ShowDynamicModal.set(true);
  }

  show: boolean = false;
}