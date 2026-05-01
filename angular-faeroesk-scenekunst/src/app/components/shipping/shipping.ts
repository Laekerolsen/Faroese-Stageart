import { ChangeDetectionStrategy, Component, ErrorHandler, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketStore } from '../../services/basket';
import { GlobalErrorHandler } from '../../handlers/global-error-handler';


@Component({
  selector: 'app-shipping-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipping.html',
  styleUrl: './shipping.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class ShippingComponent  {
  private store = inject(BasketStore);
  basket = this.store.basket$;

  get noShippingClass()
  {
    if (this.store.basket().shippingInclVat === 0)
      return "bg-orange-800 shadow-lg ring-2 ring-orange-300"
    else
      return "bg-orange-600"
  }

  get hasShippingClass()
  {
    if (this.store.basket().shippingInclVat > 0)
      return "bg-orange-800 shadow-lg ring-2 ring-orange-300"
    else
      return "bg-orange-600"
  }

  set(amount: number) {
    this.store.setShipping(amount);
  }
}