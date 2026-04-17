import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketStore } from '../../services/basket';


@Component({
  selector: 'app-shipping-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipping.html',
  styleUrl: './shipping.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ShippingComponent  {
  private store = inject(BasketStore);

  set(amount: number) {
    this.store.setShipping(amount);
  }
}