import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';

import { App } from './app';
import { HomeComponent } from './pages/home/home';
import { PostComponent } from './pages/post/post';
import { routes } from './app.routes';
import { SeoMetadata } from './services/seo-metadata';
import { BasketStore } from './services/basket';
import { BasketPageComponent } from './pages/checkout/basket/basket';
import { CommonModule } from '@angular/common';
import { BasketComponent } from './components/basket/basket';
import { ShippingComponent } from './components/shipping/shipping';
import { CheckoutComponent } from './components/checkout/checkout';
import { DiscountComponent } from './components/discount/discount';

@NgModule({
  declarations: [App, HomeComponent, PostComponent, BasketPageComponent],
  imports: [BrowserModule, CommonModule, RouterModule.forRoot(routes), RouterOutlet, BasketComponent, ShippingComponent, DiscountComponent, CheckoutComponent],
  providers: [SeoMetadata, provideClientHydration(withEventReplay()), BasketStore],
  bootstrap: [App],
})
export class AppModule {}
