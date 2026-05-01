import { ChangeDetectionStrategy, Component, ElementRef, ErrorHandler, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { client } from '../../sanity/client';
import { NgZone } from '@angular/core';
import { firstValueFrom, from, Observable } from 'rxjs';
import { createImageUrlBuilder } from '@sanity/image-url';
import { BasketStore } from '../../services/basket';
import { BasketLine } from '../../Models/basketline.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
  selector: 'app-basket-small-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basket-small.html',
  styleUrl: './basket-small.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class BasketSmallComponent implements OnInit {

  private store = inject(BasketStore);
  basket = this.store.basket$;

  remove(id: string) {
    this.updateBasket(id);

  }

  updateBasket(id: string) {

  // mutate basket (add/remove/update)
  this.store.remove(id);
  }
  productId: string = "";

  removing(line: BasketLine)
  {
    if (this.productId === line.productId)
      return false;
    else
      return false;
  }

  removeLine(line: BasketLine) {
  //line.removing = true;
  this.productId = line.productId;

  setTimeout(() => {
    this.remove(line.productId);
  }, 200);
}
  
  public hasLoaded: boolean = false;
  private zone: NgZone;

  private router: Router;

  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  isPhone$ = this.breakpointObserver.observe([Breakpoints.Handset]);

  constructor(private ngZone: NgZone, private _router: Router) {
    this.zone = ngZone;
    this.router = _router;
  }

  showBasket: boolean = true;
  showBasketText: string = "Vis kurven";
  hideBasketText: string = "Luk kurven";

  get ShowBasket()
  {
    return this.basket().lines.length && (this.showBasket || this.store.basketIsTouched);
  }

  get showText()
  {
    if (this.store.basketIsTouched)
      this.showBasket = true;

    if (this.showBasket|| this.store.basketIsTouched)
      return this.hideBasketText;
    else
      return this.showBasketText;
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

  toggleShowBasket(event: MouseEvent)
  {
    this.spawnRipple(event);
    this.store.basketIsTouched = false;
    this.showBasket = !this.showBasket;
  }

  ngOnInit() {
    this.zone.run(() => {

      this.hasLoaded = true;
      });
  }

  spawnRipple(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);

    button.classList.remove('ripple'); // reset animation
    void button.offsetWidth; // force reflow
    button.classList.add('ripple');

    setTimeout(() => button.classList.remove('ripple'), 600);
  }

  checkout(){
    this.router.navigate(['/kurv']);
  }

  public urlFor = urlFor;
}