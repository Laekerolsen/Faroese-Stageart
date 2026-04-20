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
import { BasketSmallComponent } from './components/basket-small/basket-small';
import { ReactiveFormsModule } from '@angular/forms';
import { AddressPageComponent } from './pages/checkout/address/address';
import { PaymentPageComponent } from './pages/checkout/payment/payment';

@NgModule({
  declarations: [App, HomeComponent, PostComponent, BasketPageComponent, AddressPageComponent, PaymentPageComponent],
  imports: [BrowserModule, CommonModule, RouterModule.forRoot(routes, {enableViewTransitions: true}), 
    RouterOutlet, ReactiveFormsModule, BasketComponent, BasketSmallComponent, ShippingComponent, DiscountComponent, CheckoutComponent],
  providers: [SeoMetadata, provideClientHydration(withEventReplay()), BasketStore],
  bootstrap: [App],
})
export class AppModule {}
