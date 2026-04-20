import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SeoMetadata } from './services/seo-metadata';
import { BasketComponent } from './components/basket/basket';
import { BasketStore } from './services/basket';
import { CheckoutStep, CheckoutStepperComponent } from './components/checkout-stepper/checkout-stepper';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Færøsk Scenekunst');
  protected readonly description = signal('Færøsk Scenekunst er en samling av teater, dans og performancekunst fra Færøyene.');
  protected readonly keywords = signal('Færøsk Scenekunst, teater, dans, performancekunst, Færøyene');
  currentYear = new Date().getFullYear();
  seoMetadata: SeoMetadata;

  route: ActivatedRoute;

  store: BasketStore;

  public basket: ReturnType<BasketStore['basket$']>;

  get hasLines() {


    return this.basket && (this.basket.lines?.length || 0) > 0;
  }

  constructor(private _seoMetadata: SeoMetadata, private activatedRoute: ActivatedRoute, private basketStore: BasketStore) {
    this.store = basketStore;
    this.basket = this.store.basket$();
    this.route = activatedRoute;
    this.seoMetadata = _seoMetadata;
    this.seoMetadata.title.set(this.title());
    this.seoMetadata.description.set(this.description());
    this.seoMetadata.keywords.set(this.keywords());

    this.route.data.subscribe(data => {
      this.seoMetadata.title.set(data['title']);
      this.seoMetadata.description.set(data['description']);
      this.seoMetadata.keywords.set(data['keywords']);
    });
  }

  get BasketFlowClass()
  {
    if (this.IsCheckoutRoute)
      return 'basket-flow'
    else 
      return '';
  }

  get CheckoutStage(): CheckoutStep
  {
    let currentRoute = this.route;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    const path = currentRoute.snapshot.routeConfig?.path || 'kurv' as CheckoutStep;

    

    if (this.IsCheckoutRoute)
      return path as CheckoutStep
    else 
      return 'kurv' as CheckoutStep;
  }

  get IsCheckoutRoute() {

    let currentRoute = this.route;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    const path = currentRoute.snapshot.routeConfig?.path;
    const isKurv = path === 'kurv' || path === 'adresse' || path === 'betaling';

    console.log('Current route path:', path);
    console.log('Is checkout route:', isKurv);
    return isKurv;
  }

  ngOnInit(): void {
    let currentRoute = this.route;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    console.log(currentRoute.snapshot.routeConfig?.path);
  }
}
