import { ChangeDetectionStrategy, Component, ErrorHandler, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { client } from '../../sanity/client';
import { NgZone } from '@angular/core';
import { firstValueFrom, from, Observable } from 'rxjs';
import { createImageUrlBuilder } from '@sanity/image-url';
import { BasketStore } from '../../services/basket';
import { GlobalErrorHandler } from '../../handlers/global-error-handler';

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
  selector: 'app-orderoverview-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orderoverview.html',
  styleUrl: './orderoverview.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class OrderOverviewComponent implements OnInit {
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