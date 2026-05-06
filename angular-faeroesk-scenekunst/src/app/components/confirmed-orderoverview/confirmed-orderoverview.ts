import { ChangeDetectionStrategy, Component, computed, ErrorHandler, inject, input, InputSignal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { client } from '../../sanity/client';
import { NgZone } from '@angular/core';
import { firstValueFrom, from, Observable } from 'rxjs';
import { createImageUrlBuilder } from '@sanity/image-url';
import { BasketStore } from '../../services/basket';
import { GlobalErrorHandler } from '../../handlers/global-error-handler';
import { Order } from '../../Models/order.model';
import { toSignal } from '@angular/core/rxjs-interop';

const builder = createImageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source);

interface Post {
  title: string;
  price: string;
  slug: { current: string };
  body?: any[];
  image?: any;
  publishedAt?: string;
  // add other fields your Sanity post has
}

@Component({
  selector: 'app-confirmed-orderoverview-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmed-orderoverview.html',
  styleUrl: './confirmed-orderoverview.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class ConfirmedOrderOverviewComponent implements OnInit {
  public OrderId = input<string>(crypto.randomUUID());
  public order: InputSignal<Order | null> = input<Order | null>(null);
  public store = inject(BasketStore);
  basket = this.store.basket$;

  
  
  readonly currentOrder = computed(() => {
    if (this.order() && this.order()?.id === this.OrderId()) {
      return this.order();
    }
    else if (this.order()) {
      return this.order();
    }

    const current = this.order() || this.store.order();
    if (current && (current.orderStatus === 'confirmed' && current.id === this.OrderId())) {
      return current;
    }
    return this.store.OldOrdersList.find(o => o.id === this.OrderId()) ?? null;
  });

  remove(id: string) {
    this.store.remove(id);
  }
  
  public hasLoaded: boolean = false;
  private zone: NgZone;

  private router: Router;

  constructor(private ngZone: NgZone, private _router: Router) {
    this.zone = ngZone;
    this.router = _router;
  }

  get currentOrderFromOldOrdersListInStore(): Order | undefined {
    const order = this.store.OldOrdersList.find(order => order.id === this.OrderId());
    if (!order) {
      
    }
    return order;
  }

  ngOnInit() {
    this.zone.run(() => {

      this.hasLoaded = true;
      });
  }

  get subTotal()
  {
    if (this.store.basket().lines)
    {
      let subtotal: number = 0;

      this.store.basket().lines.forEach(line =>{
        subtotal = subtotal + (line.totalInclVat * line.quantity);
      });

      return subtotal;
    }
    else
      return 0;
  }

  checkout(){
    this.router.navigate(['/kurv']);
  }

  public urlFor = urlFor;
}