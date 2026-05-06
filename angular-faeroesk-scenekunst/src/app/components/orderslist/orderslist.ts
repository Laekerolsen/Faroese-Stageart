import { ChangeDetectionStrategy, Component, computed, ErrorHandler, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { client } from '../../sanity/client';
import { NgZone } from '@angular/core';
import { firstValueFrom, from, Observable } from 'rxjs';
import { createImageUrlBuilder } from '@sanity/image-url';
import { BasketStore } from '../../services/basket';
import { GlobalErrorHandler } from '../../handlers/global-error-handler';
import { Order } from '../../Models/order.model';

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
  selector: 'app-orderslist-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orderslist.html',
  styleUrl: './orderslist.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class OrdersListComponent implements OnInit {
  public store = inject(BasketStore);
  basket = this.store.basket$;

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

  readonly searchTerm = signal('');

  readonly currentOrdersList = computed(() => {
    const confirmed: Order[] = this.store.orderList.filter(order => order.orderStatus === 'confirmed');
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return confirmed;
    return confirmed.filter(o =>
      o.id.toLowerCase().includes(term) ||
      o.orderStatus.toLowerCase().includes(term)
    );
  });

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