import { ErrorHandler, NgModule } from '@angular/core';
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
import { OrderOverviewComponent } from './components/orderoverview/orderoverview';
import { CheckoutStepperComponent } from './components/checkout-stepper/checkout-stepper';
import { DeliveryModalComponent } from './components/delivery-modal/delivery-modal';
import { provideAnimations } from '@angular/platform-browser/animations';
import { VivaPaymentIconsComponent } from './components/viva-payment-icons/viva-payment-icons';
import { TermsModalComponent } from './components/terms-modal/terms-modal';
import { DynamicModalComponent } from './components/dynamic-modal/dynamic-modal';
import { GlobalErrorHandler } from './handlers/global-error-handler';
import { ConfirmationPageComponent } from './pages/checkout/confirmation/confirmation';
import { ConfirmedOrderOverviewComponent } from './components/confirmed-orderoverview/confirmed-orderoverview';

@NgModule({
  declarations: [App, HomeComponent, PostComponent, BasketPageComponent, AddressPageComponent, PaymentPageComponent, ConfirmationPageComponent],
  imports: [BrowserModule, CommonModule, RouterModule.forRoot(routes, {enableViewTransitions: true, scrollPositionRestoration: 'enabled'}), 
    RouterOutlet, ReactiveFormsModule, BasketComponent, BasketSmallComponent, ShippingComponent, DiscountComponent, CheckoutComponent, OrderOverviewComponent, ConfirmedOrderOverviewComponent, CheckoutStepperComponent, DeliveryModalComponent, VivaPaymentIconsComponent, TermsModalComponent, DynamicModalComponent],
  providers: [SeoMetadata, provideClientHydration(withEventReplay()), BasketStore, provideAnimations(), { provide: ErrorHandler, useClass: GlobalErrorHandler }],
  bootstrap: [App],
})
export class AppModule {}
