import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketStore } from '../../services/basket';


@Component({
  selector: 'app-checkout-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CheckoutComponent  {
  private store = inject(BasketStore);

  public basket = this.store.basket$();

  async checkout() {
    this.basket = this.store.basket$();

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(this.basket)
    });

    const { url } = await res.json();
    window.location.href = url;
  }
  public ShowModal = signal(false);

  openModal() {
    this.ShowModal.set(true);
  }
}